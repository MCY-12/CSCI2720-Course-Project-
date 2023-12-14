const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const axios = require('axios');
const xml2js = require('xml2js');
// Import CORS
const cors = require('cors');

const app = express();
//original 3000
const port = 3001;
// Use CORS middleware
app.use(cors());

const parser = new xml2js.Parser();
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show' }] // Array of venue IDs
});

const User = mongoose.model('User', userSchema);

const commentSchema = new mongoose.Schema({
  content: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  postedAt: { type: Date, default: Date.now },
  // Add other relevant fields
});

const Comment = mongoose.model('Comment', commentSchema);

const Show = mongoose.model('Show', venueSchema);
const ShowEvent = mongoose.model('ShowEvent', eventSchema);


let selectedVenueIds = [];


async function processVenueData(eventXml) {
  const venueResponse = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/venues.xml');
  const venueXml = await parser.parseStringPromise(venueResponse.data);

  let processedVenues = venueXml.venues.venue.map(v => ({
    venueId: parseInt(v.$.id),
    venueNameE: v.venuee[0].trim(),
    latitude: v.latitude[0].trim(),
    longitude: v.longitude[0].trim(),
  }));


  // Filter venues that have at least 3 events
  const validVenues = processedVenues.filter(v => 
    eventXml.events.event.filter(e => parseInt(e.venueid[0].trim()) === v.venueId).length >= 3
  );

  // Randomly pick 10 venues
  let selectedVenues = [];
  while(selectedVenues.length < 10 && validVenues.length > 0) {
    let randomIndex = Math.floor(Math.random() * validVenues.length);
    selectedVenues.push(validVenues[randomIndex]);
    validVenues.splice(randomIndex, 1);
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
let lastUpdatedTime = null;

app.get('/update-data', async (req, res) => {
  if (!lastUpdatedTime) {
    try {
      const eventResponse = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/events.xml');
      const eventXml = await parser.parseStringPromise(eventResponse.data);

      // Process venues and get selected venue IDs
      const selectedVenueIds = await processVenueData(eventXml);

      // Process events with selected venue IDs
      await processEventData(eventXml, selectedVenueIds);

      lastUpdatedTime = new Date();
      res.send(`Data updated successfully at ${lastUpdatedTime}`);
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).send('Error updating data');
    }
  } else {
    res.send(`Data was already updated at ${lastUpdatedTime}`);
  }
});




app.get('/last-updated', (req, res) => {
  if (lastUpdatedTime) {
    res.json({ lastUpdated: lastUpdatedTime });
  } else {
    res.status(404).send("Data not updated yet");
  }
});


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

    // Insert the venues into the Show collection
    await Show.insertMany(venues);

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

app.use(session({
  secret: 'IKg4qePyQt',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // use secure:true in production with HTTPS
}));

app.use(express.static(__dirname + '/front-end/public'));

// Endpoint to list all locations in a table format, including functionality for sorting by the number of events at each venue.
app.get('/locations', async (req, res) => {
  try {
    // Determine sorting order based on query parameter, default is ascending
    const sortOrder = req.query.sort === 'desc' ? -1 : 1;

    const locations = await Show.aggregate([
      {
        $lookup: {
          //from: 'showevents',
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
    const venue = await Show.findOne({ venueId });
    if (!venue) {
      return res.status(404).send('Venue not found');
    }

    // Fetch associated events
    const events = await ShowEvent.find({ venueId });

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
    const userId = req.session.user.id; // Assuming user ID is stored in session
    const venueId = req.params.venueId;
    
    // Check if venue exists
    const venueExists = await Show.exists({ venueId });
    if (!venueExists) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Add to user's favorites
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $addToSet: { favorites: venueId } }, 
      { new: true }
    );

    res.json({ message: 'Added to favorites', favorites: updatedUser.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite', error: error.message });
  }
});

// Unfavorite locations
app.delete('/user/favorites/:venueId', async (req, res) => {
  try {
    const userId = req.session.user.id; // Assuming user ID is stored in session
    const venueId = req.params.venueId;

    // Remove from user's favorites
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: venueId } }, // Pulls the venueId from the favorites array
      { new: true }
    );

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
    const userId = req.session.user.id;
    
    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
});

// Endpoint to list events filtered by price criteria (e.g., events with price ≤100).
app.get('/events/price/:maxPrice', async (req, res) => {
  try {
    const maxPrice = parseInt(req.params.maxPrice);

    // Filter events where price is less than or equal to maxPrice
    const events = await Event.find({ 
      price: { $lte: maxPrice }
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      req.session.user = { id: user._id, username: user.username }; // Store user info in session
      res.json({ message: 'Login successful', user: req.session.user });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error in login process', error: error.message });
  }
});

// User Register
app.post('/register', async (req, res) => {
  try {
    const { username} = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      username,
      password: hashedPassword,
      //email,
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
  if (req.session.user && req.session.user.isAdmin) {
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
    const newShow = new Show(req.body);
    await newShow.save();
    res.status(200).json({ message: 'Show created successfully', show: newShow });
  } catch (error) {
    res.status(500).json({ message: 'Error creating show', error: error.message });
  }
});

app.get('/admin/shows', isAdmin, async (req, res) => {
  try {
    const shows = await Show.find({});
    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shows', error: error.message });
  }
});

app.put('/admin/show/:showId', isAdmin, async (req, res) => {
  try {
    const updatedShow = await Show.findByIdAndUpdate(req.params.showId, req.body, { new: true });
    res.status(200).json({ message: 'Show updated successfully', show: updatedShow });
  } catch (error) {
    res.status(500).json({ message: 'Error updating show', error: error.message });
  }
});

app.delete('/admin/show/:showId', isAdmin, async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.params.showId);
    res.status(200).json({ message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting show', error: error.message });
  }
});

// User logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login'); // Redirect to login page after session is destroyed
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
