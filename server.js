const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const xml2js = require('xml2js');

const path = require('path');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const User = require('./models/userModel');

const app = express();
//original 3000
const port = 3001;
app.use(express.json());

const parser = new xml2js.Parser();
const saltRounds = 10;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build'))); // Serve static files from the React root directory

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/CSCI3100_Project'); 
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', function() {
	console.log("Connection is open...");
})

async function createDefaultAdmin() {
	try {
	  // Check if an admin user already exists
	  const adminExists = await User.findOne({ username: 'admin' });
	  if (adminExists) {
		console.log('Admin user already exists.');
		return;
	  }
  
	  // Hash the password
	  const hashedPassword = await bcrypt.hash('admin', saltRounds);
  
	  // Create a new admin user
	  const adminUser = new User({
		username: 'admin',
    email: 'admin@example.com',
		password: hashedPassword,
		isAdmin: true,
	  });
  
	  // Save the admin user to the database
	  await adminUser.save();
	  console.log('Admin user created successfully.');
	} catch (error) {
	  console.error('Error creating admin user:', error);
	}
}
  // Call the function to create a default admin if it doesn't exist
createDefaultAdmin();

// Function to generate JWT token
function generateToken(user) {
  const secretKey = process.env.JWT_SECRET; 
  const payload = {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
  };
  const expiresIn = '1h';
  return jwt.sign(payload, secretKey, { expiresIn });
}

// Middleware to verify token
function verifyToken(req, res, next) {
	const secretKey = process.env.JWT_SECRET;
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

//Check admin permission
function isAdmin(req, res, next) {
  // Assuming the user's information including their admin status is stored in the JWT token
  // and the token is sent in the Authorization header as 'Bearer <token>'
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      return res.status(403).json({ message: 'No token provided, access denied' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret key
      req.user = decoded;

      // Check if the user has admin privileges
      if (req.user.isAdmin) {
          next(); // User is admin, proceed to the next middleware
      } else {
          res.status(403).json({ message: 'Access denied' });
      }
  } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
  }
}

// Admin-specific routes
app.get('/admin', isAdmin, (req, res) => {
	res.sendFile(path.join(__dirname, 'write the path to the admin panel or index html then render the admin panel'));
});

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all route to serve the React application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
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
	  let update = req.body;
	  if (update.password) {
		update.password = await bcrypt.hash(update.password, saltRounds);
	  }
  
	  const updatedUser = await User.findByIdAndUpdate(req.params.userId, update, { new: true });
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

// User logout
app.get('/logout', (req, res) => {
	res.redirect('/login');
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
