const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const xml2js = require('xml2js');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
//original 3000
const port = 3001;
// Use CORS middleware
app.use(cors());

const parser = new xml2js.Parser();
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(cors({
    origin: 'http://localhost:3000', // Adjust to match your frontend server
}));

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/CSCI2720'); //127.0.0.1 may better
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', function() {
	console.log("Connection is open...");
})

// Venue Schema
const venueSchema = new mongoose.Schema({
	venueId: Number,
	venueNameE: String,
	latitude: String,
	longitude: String,
});

// Create a text index on the venueNameE field
venueSchema.index({ venueNameE: 'text' });
const Venue = mongoose.model('Venue', venueSchema);

// Event Schema
const eventSchema = new mongoose.Schema({
	eventId: Number,
	titleE: String,
	venueId: Number,  // to associate with Venue
	date: String,
	descriptionE: String,
	presenterE: String,
	price: String,
	// Include other relevant fields if necessary
});

const Event = mongoose.model('Event', eventSchema);

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	//email: String,
	isAdmin: Boolean,
	favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }] // Array of venue IDs
});

const User = mongoose.model('User', userSchema);

const commentSchema = new mongoose.Schema({
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }, // Linking comment to venue
    postedAt: { type: Date, default: Date.now },
    // Add other relevant fields if needed
});

const Comment = mongoose.model('Comment', commentSchema);

let selectedVenueIds = [];


async function processVenueData(eventXml) {
    const venueResponse = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/venues.xml');
    const venueXml = await parser.parseStringPromise(venueResponse.data);

    let processedVenues = venueXml.venues.venue
        .filter(v => v.latitude && v.longitude && v.latitude[0].trim() !== '' && v.longitude[0].trim() !== '')
        .map(v => ({
            venueId: parseInt(v.$.id),
            venueNameE: v.venuee[0].trim(),
            rootVenueName: v.venuee[0].trim().split('(')[0].trim(), // Extracting the root venue name
            latitude: v.latitude[0].trim(),
            longitude: v.longitude[0].trim(),
        }));

    // Filter venues that have at least 3 events
    const validVenues = processedVenues.filter(v => 
        eventXml.events.event.filter(e => parseInt(e.venueid[0].trim()) === v.venueId).length >= 3
    );

    // Randomly pick 10 venues with distinct root names
    let selectedVenues = [];
    let selectedRootNames = new Set();

    while(selectedVenues.length < 10 && validVenues.length > 0) {
        let randomIndex = Math.floor(Math.random() * validVenues.length);
        let candidateVenue = validVenues[randomIndex];

        if (!selectedRootNames.has(candidateVenue.rootVenueName)) {
            selectedVenues.push(candidateVenue);
            selectedRootNames.add(candidateVenue.rootVenueName);
            validVenues.splice(randomIndex, 1); // Remove the selected venue from the pool
        }
    }

    let selectedVenueIds = selectedVenues.map(venue => venue.venueId);

    await Venue.deleteMany({});
    await Venue.insertMany(selectedVenues);

    return selectedVenueIds;
}

async function processEventData(eventXml, selectedVenueIds) {
	let processedEvents = eventXml.events.event.map(e => ({
		eventId: parseInt(e.$.id),
		titleE: e.titlee[0].trim(),
		venueId: parseInt(e.venueid[0].trim()),
		date: e.predateE[0].trim(),
		descriptionE: e.desce[0].trim() || '',
		presenterE: e.presenterorge[0].trim(),
		price: e.pricee[0].trim(),
	}));

	// Filter events based on selected venue IDs
	processedEvents = processedEvents.filter(event => selectedVenueIds.includes(event.venueId));

	await Event.deleteMany({});
	await Event.insertMany(processedEvents);
}

// endpoint to trigger data processing
/*app.get('/update-data', async (req, res) => {
	await processVenueData();
	await processEventData();
	res.send('Data updated successfully');
});*/
// let lastUpdatedTime = null;

async function checkDataExists() {
    // Assuming 'Event' is your Mongoose model for event data
    const eventCount = await Event.countDocuments();
	const venueCount = await Venue.countDocuments();
    // Assuming data exists if there's at least one event in the database
    return (eventCount > 0 && venueCount > 0);
}

app.get('/update-data', async (req, res) => {
    try {
        // Check if data already exists in the database
        const dataExists = await checkDataExists(); // This function needs to be implemented

        if (dataExists) {
            // If data exists, send a message indicating no update is needed
            res.status(200).send('Data already exists. No update performed.');
        } else {
            // Fetching and processing new data since it doesn't exist
            const eventResponse = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/events.xml');
            const eventXml = await parser.parseStringPromise(eventResponse.data);

            // Process venues and get selected venue IDs
            const selectedVenueIds = await processVenueData(eventXml);

            // Process events with selected venue IDs
            await processEventData(eventXml, selectedVenueIds);

            // Update lastUpdatedTime or similar logic after successful update
            lastUpdatedTime = new Date(); // Consider persisting this in the database
            res.send(`Data updated successfully at ${lastUpdatedTime}`);
        }
    } catch (error) {
        console.error('Error in /update-data:', error);
        res.status(500).send('Server error occurred');
    }
});

// app.get('/last-updated', (req, res) => {
// 	if (lastUpdatedTime) {
// 		res.json({ lastUpdated: lastUpdatedTime });
// 	} else {
// 		res.status(404).send("Data not updated yet");
// 	}
// });

app.get('/process-venues', async (req, res) => {
	try {
		// Aggregate venues with non-empty latitude and longitude, and at least 3 events
		const venues = await Venue.aggregate([
			{ $match: { latitude: { $ne: '' }, longitude: { $ne: '' } } },
			{ $lookup: {
					from: "events",
					localField: "venueId",
					foreignField: "venueId",
					as: "events"
				}
			},
			{ $addFields: { eventCount: { $size: "$events" } } },
			{ $match: { eventCount: { $gte: 3 } } },
			{ $limit: 10 }
		]);

		// Insert the venues into the Venue collection
		await Venue.insertMany(venues);

		// For each venue, find and store its events
		for (const venue of venues) {
			const events = await Event.find({ venueId: venue.venueId });

			await ShowEvent.insertMany(events);
		}

		res.send('Venues and events processed and saved successfully');
	} catch (error) {
		console.error('Error processing venues and events:', error);
		res.status(500).send('Error processing venues and events');
	}
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/front-end/public'));

// Endpoint to list all locations in a table format, including functionality for sorting by the number of events at each venue.
app.get('/locations', async (req, res) => {
	try {
		// Determine sorting order based on query parameter, default is ascending
		const sortOrder = req.query.sort === 'desc' ? -1 : 1;

		const locations = await Venue.aggregate([
			{
				$lookup: {
					from: "events",
					localField: 'venueId',
					foreignField: 'venueId',
					as: 'events'
				}
			},
			{
				$addFields: { eventCount: { $size: '$events' } }
			},


			//new added
			{ $match: { eventCount: { $gte: 3 } } },
			{ $limit: 10 },


			{
				$sort: { eventCount: sortOrder }
			}
		]);

		res.status(200).json(locations);
	} catch (error) {
		console.error('Error fetching locations:', error);
		res.status(500).send('Error fetching locations');
	}
});

// Endpoint to search for locations by keywords in the name.
app.get('/search-venues', async (req, res) => {
	try {
		const searchTerm = req.query.keyword;
		const searchResult = await Venue.find({ $text: { $search: searchTerm } });
		
		res.status(200).json(searchResult);
	} catch (error) {
		console.error('Error searching venues:', error);
		res.status(500).send('Error searching venues');
	}
});

// Endpoint to provide detailed view for a single location, including map integration, location details, and user comments functionality.
app.get('/location/:venueId', async (req, res) => {
	try {
		if (!req.params.venueId) {
			return res.status(400).send('Venue ID is required');
		}
		const venueId = Number(req.params.venueId); // Convert to number
		if (isNaN(venueId)) {
			return res.status(400).send('Invalid venueId');
		}
		
		
		// Fetch venue details
		const venue = await Venue.findOne({ venueId });
		if (!venue) {
			return res.status(404).send('Venue not found');
		}

		// Fetch associated events
		const events = await Event.find({ venueId });

		// Fetch comments for the venue
		const comments = await Comment.find({ event: { $in: events.map(event => event._id) } }).populate('user', 'username');

		// Prepare data for the client
		const locationData = {
			venue,
			events,
			comments,
			mapUrl: `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`
		};

		res.json(locationData);
	} catch (error) {
		console.error('Error fetching location details:', error);
		res.status(500).send('Error fetching location details');
	}
});

// Endpoints for adding locations to a user's list of favorite locations and viewing this list.
app.post('/user/favorites/:venueId', async (req, res) => {
    try {
        const userId = req.body.id;
        const venueId = req.params.venueId;
        
        // Find the venue by its identifier
        const venue = await Venue.findOne({ venueId });
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        // Add the venue's ObjectId to the user's favorites
        await User.findByIdAndUpdate(
            userId, 
            { $addToSet: { favorites: venue._id } }, // Using venue's ObjectId
            { new: true }
        );

        // Populate updated favorites
        const updatedUser = await User.findById(userId).populate({
            path: 'favorites',
            model: 'Venue'
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Added to favorites', favorites: updatedUser.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Error adding favorite', error: error.message });
    }
});

// Unfavorite locations
app.delete('/user/favorites/:venueId', async (req, res) => {
    try {
        const userId = req.query.userId;
        const venueId = req.params.venueId;

        // Find the venue by its identifier
        const venue = await Venue.findOne({ venueId });
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        // Remove the venue's ObjectId from the user's favorites
        await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: venue._id } }, // Using venue's ObjectId
            { new: true }
        );

        // Populate updated favorites
        const updatedUser = await User.findById(userId).populate({
            path: 'favorites',
            model: 'Venue'
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Removed from favorites', favorites: updatedUser.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error: error.message });
    }
});

// View favorite locations
app.get('/user/favorites', async (req, res) => {
    try {
        const userId = req.query.userId;

        // Find the user and populate the favorites with the venue details
        const user = await User.findById(userId).populate({
            path: 'favorites',
            model: 'Venue' // Replace with the name of your venue model
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract and send the array of venue objects
        const favoriteVenues = user.favorites.map(fav => ({
            _id: fav._id,
            venueId: fav.venueId, // Replace with the field name used in your Venue schema
            // include other venue details you want to send
			venueNameE: fav.venueNameE
        }));

        res.json({ favorites: favoriteVenues });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites', error: error.message });
    }
});

function extractPrices(priceString) {
    // Check if the price string contains '$'
    if (!priceString.includes('$')) {
        return [0]; // If no '$' symbol, return [0]
    }

    const prices = priceString.match(/\d+/g) || [];
    return prices.map(Number);
}

// Endpoint for events with price under a certain value
app.get('/events/price/under/:maxPrice/:venueId', async (req, res) => {
    const maxPrice = parseInt(req.params.maxPrice);
	const venueId = parseInt(req.params.venueId);
    const events = await Event.find({venueId: venueId});
    const filteredEvents = events.filter(event => {
        const prices = extractPrices(event.price);
        return prices.some(price => price <= maxPrice);
    });
    res.json(filteredEvents);
});

// Endpoint for events with price over a certain value
app.get('/events/price/over/:minPrice/:venueId', async (req, res) => {
    const minPrice = parseInt(req.params.minPrice);
	const venueId = parseInt(req.params.venueId);
    const events = await Event.find({venueId: venueId});
    const filteredEvents = events.filter(event => {
        const prices = extractPrices(event.price);
        return prices.some(price => price >= minPrice);
    });
    res.json(filteredEvents);
});

// Endpoint for events with a specific price
app.get('/events/price/exactly/:exactPrice/:venueId', async (req, res) => {
    const exactPrice = parseInt(req.params.exactPrice);
	const venueId = parseInt(req.params.venueId);
    const events = await Event.find({venueId: venueId});
    const filteredEvents = events.filter(event => {
        const prices = extractPrices(event.price);
        return prices.includes(exactPrice);
    });
    res.json(filteredEvents);
});

// Create a POST endpoint for creating comments
// app.post('/comments', verifyToken, async (req, res) => {
// 	try {
// 		const { content, eventId } = req.body;
// 		const userId = req.user._id; // from verifyToken	  
// 		const comment = new Comment({
// 			content,
// 			user: userId, 
// 			event: eventId
// 	  	});
// 	  	await comment.save();
// 	  	res.status(201).json(comment);  
// 	} catch (error) {
// 		res.status(500).json({ message: 'Error fetching comments', error: error.message });
// 	}
// });

app.post('/comments', verifyToken, async (req, res) => {
    try {
        const { content, venueId } = req.body;
        const userId = req.user.id; // from verifyToken

        // Find the venue using the custom venueId
        const venue = await Venue.findOne({ venueId: venueId });
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
		// console.log(userId);
        // Create a new comment with the ObjectId of the found venue
        const comment = new Comment({
            content,
            user: userId,
            venue: venue._id // Using the ObjectId of the venue
        });
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
});

// GET /events/:eventId
app.get('/events/:eventId', async (req, res) => {
	try {
		const eventId = req.params.eventId;
	  	const event = await Event.findById(eventId)
			.populate({
		  	path: 'comments',
		  	populate: {
				path: 'user',
				model: 'User' 
		  	}
			});
	  	res.json(event); 
	} catch (error) {
	  	console.error(error);
	  	res.status(500).send('Error fetching event'); 
	}
  });

app.get('/venue/:venueId/comments', async (req, res) => {
    try {
        const venueId = req.params.venueId;
		// Find the venue using the custom venueId
		const venue = await Venue.findOne({ venueId: venueId });
		if (!venue) {
			return res.status(404).json({ message: 'Venue not found' });
		}
        const comments = await Comment.find({ venue: venue._id })
            .populate('user', 'username'); // Assuming 'username' field in 'User' model

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching comments for venue');
    }
});

function generateToken(user) {
    // Ensure you have a secret key to sign the JWT
    const secretKey = 'UDcuPgXEaN8Y8K'; // Replace with your secret key

    // Define the payload. Don't include sensitive information
    const payload = {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
    };

    // Define the token expiration time
    const expiresIn = '24h'; // Token expires in 24 hours

    // Generate the token
    const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });

    return token;
}

// Middleware to verify token
function verifyToken(req, res, next) {
	const secretKey = 'UDcuPgXEaN8Y8K';
    const token = req.headers['authorization']; // Typically token is sent in the Authorization header
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
}

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            const token = generateToken(user); // Implement this function to generate a JWT
            const userInfo = { id: user._id, username: user.username, isAdmin: user.isAdmin };
            res.json({ message: 'Login successful', token: token, user: userInfo });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error) {
		console.error('Login error:', error);
        res.status(500).json({ message: 'Error in login process', error: error.message });
    }
});

// User Register
app.post('/register', async (req, res) => {
	try {
		const { username, password } = req.body;

		// Check if username already exists
		const existingUser = await User.findOne({ username });
		if (existingUser) {
		return res.status(400).json({ message: 'Username already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, saltRounds);
		const newUser = new User({
			username,
			password: hashedPassword,
			isAdmin: false
		});

		await newUser.save();
		res.status(200).json({ message: 'User registered successfully!' });
	} catch (error) {
		res.status(500).json({ message: 'Error in registration process', error: error.message });
	}
});

//Check admin permission
function isAdmin(req, res, next) {
	const getUserInfo = () => {
		const userInfo = localStorage.getItem('userInfo');
		return userInfo ? JSON.parse(userInfo) : null;
	};
	if (userInfo.user && userInfo.isAdmin) {
		next();
	} else {
		res.status(403).send('Access Denied');
	}
}

// Admin-specific routes
app.get('/admin', isAdmin, (req, res) => {
	res.sendFile(path.join(__dirname, 'write the path to the admin panel or index html then render the admin panel'));
});

// CREATE Event
app.post('/admin/showevent', isAdmin, async (req, res) => {
	try {
		const newShowEvent = new ShowEvent(req.body);
		await newShowEvent.save();
		res.status(200).json({ message: 'ShowEvent created successfully', showEvent: newShowEvent });
	} catch (error) {
		res.status(500).json({ message: 'Error creating show event', error: error.message });
	}
});

// READ Events
app.get('/admin/showevents', isAdmin, async (req, res) => {
	try {
		const showEvents = await ShowEvent.find({});
		res.status(200).json(showEvents);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching show events', error: error.message });
	}
});

// UPDATE Event
app.put('/admin/showevent/:showEventId', isAdmin, async (req, res) => {
	try {
		const updatedShowEvent = await ShowEvent.findByIdAndUpdate(req.params.showEventId, req.body, { new: true });
		res.status(200).json({ message: 'ShowEvent updated successfully', showEvent: updatedShowEvent });
	} catch (error) {
		res.status(500).json({ message: 'Error updating show event', error: error.message });
	}
});

// DELETE Event
app.delete('/admin/showevent/:showEventId', isAdmin, async (req, res) => {
	try {
		await ShowEvent.findByIdAndDelete(req.params.showEventId);
		res.status(200).json({ message: 'ShowEvent deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting show event', error: error.message });
	}
});

// CRUD User
// CREATE User
app.post('/admin/user', isAdmin, async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
		const newUser = new User({ ...req.body, password: hashedPassword });
		await newUser.save();
		res.status(200).json({ message: 'User created successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error creating user', error: error.message });
	}
});

// READ Users
app.get('/admin/users', isAdmin, async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching users', error: error.message });
	}
});

// UPDATE User
app.put('/admin/user/:userId', isAdmin, async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
		res.status(200).json({ message: 'User updated successfully', user: updatedUser });
	} catch (error) {
		res.status(500).json({ message: 'Error updating user', error: error.message });
	}
});

// DELETE User
app.delete('/admin/user/:userId', isAdmin, async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.userId);
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting user', error: error.message });
	}
});

// Venuen CRUD
app.post('/admin/show', isAdmin, async (req, res) => {
	try {
		const newShow = new Venue(req.body);
		await newShow.save();
		res.status(200).json({ message: 'Venue created successfully', show: newShow });
	} catch (error) {
		res.status(500).json({ message: 'Error creating show', error: error.message });
	}
});

app.get('/admin/shows', isAdmin, async (req, res) => {
	try {
		const shows = await Venue.find({});
		res.status(200).json(shows);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching shows', error: error.message });
	}
});

app.put('/admin/show/:showId', isAdmin, async (req, res) => {
	try {
		const updatedShow = await Venue.findByIdAndUpdate(req.params.showId, req.body, { new: true });
		res.status(200).json({ message: 'Venue updated successfully', show: updatedShow });
	} catch (error) {
		res.status(500).json({ message: 'Error updating show', error: error.message });
	}
});

app.delete('/admin/show/:showId', isAdmin, async (req, res) => {
	try {
		await Venue.findByIdAndDelete(req.params.showId);
		res.status(200).json({ message: 'Venue deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting show', error: error.message });
	}
});

// User logout
app.get('/logout', (req, res) => {
	res.redirect('/login');
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
