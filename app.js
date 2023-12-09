const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const axios = require('axios');
const xml2js = require('xml2js');
const app = express();
const port = 3000;
const parser = new xml2js.Parser();

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
  progtimeE: String,
  agelimitE: String,
  urlE: String,
  remarkE: String,
  enquiry: String,
  email: String,
  saledate: String,
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
    progtimeE: e.progtimee[0].trim(),
    agelimitE: e.agelimite[0].trim(),
    urlE: e.urle[0].trim(),
    remarkE: e.remarke[0].trim(),
    enquiry: e.enquiry[0].trim(),
    email: e.email[0].trim(),
    saledate: e.saledate[0].trim(),
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

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(session({ /* session configuration */ }));
// app.use(express.static(__dirname + '/public'));

// // Define RESTful API endpoints here
// // Example: app.get('/api/locations', (req, res) => { /* list locations */ });

// // User authentication routes
// app.post('/login', (req, res) => { /* handle login */ });
// app.post('/register', (req, res) => { /* handle registration */ });

// // Admin-specific routes
// app.get('/admin', isAdmin, (req, res) => { /* admin panel */ });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
