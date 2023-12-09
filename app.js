const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const axios = require('axios');
const xml2js = require('xml2js');
const app = express();
const port = 3000;
const parser = new xml2js.Parser();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/CSCI2720');
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', function() {
  console.log("Connection is opne...");
})

// Venue Schema
const venueSchema = new mongoose.Schema({
  venueId: Number,
  venueNameE: String,
  latitude: String,
  longitude: String,
});

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
  password: String, // Consider using hashing for storing passwords
  email: String,
  isAdmin: Boolean,
  // Add other relevant fields
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


// Function to fetch and process venue data
async function processVenueData() {
  const venueResponse = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/venues.xml');
  const venueXml = await parser.parseStringPromise(venueResponse.data);

  const processedVenues = venueXml.venues.venue.map(v => ({
    venueId: parseInt(v.$.id),
    venueNameE: v.venuee[0].trim(),
    latitude: v.latitude[0].trim(),
    longitude: v.longitude[0].trim(),
  }));

  // Save processed venues to MongoDB
  Venue.insertMany(processedVenues)
  .then(docs => {
    console.log("Venues saved successfully");
  })
  .catch(err => {
    console.error("Error saving venues:", err);
  });
}

// Function to fetch and process event data
async function processEventData() {
  const eventResponse = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/events.xml');
  const eventXml = await parser.parseStringPromise(eventResponse.data);

  const processedEvents = eventXml.events.event.map(e => ({
    eventId: parseInt(e.$.id),
    titleE: e.titlee[0].trim(),
    venueId: parseInt(e.venueid[0].trim()),
    date: e.predateE[0].trim(),
    descriptionE: e.desce[0].trim() || '',
    presenterE: e.presenterorge[0].trim(),
    price: e.pricee[0].trim(),
  }));

  // Save processed events to MongoDB
  Event.insertMany(processedEvents)
  .then(docs => {
    console.log("Events saved successfully");
  })
  .catch(err => {
    console.error("Error saving events:", err);
  });
}

// endpoint to trigger data processing
app.get('/update-data', async (req, res) => {
  await processVenueData();
  await processEventData();
  res.send('Data updated successfully');
});

app.get('/process-venues', async (req, res) => {
  try {
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

    // Assuming Show uses the same schema as Venue
    const Show = mongoose.model('Show', venueSchema);

    await Show.insertMany(venues);
    res.send('Venues processed and saved successfully');
  } catch (error) {
    console.error('Error processing venues:', error);
    res.status(500).send('Error processing venues');
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

app.use(express.static(__dirname + '/public'));

// Define RESTful API endpoints here
// Example: app.get('/api/locations', (req, res) => { /* list locations */ });

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
    const { username, email } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
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
app.post('/admin/event', isAdmin, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(200).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

// READ Events
app.get('/admin/events', isAdmin, async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// UPDATE Event
app.put('/admin/event/:eventId', isAdmin, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

// DELETE Event
app.delete('/admin/event/:eventId', isAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.eventId);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

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

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login'); // Redirect to login page
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
