const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

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

// Helper function to get user ID from JWT token
const getUserIdFromToken = (token) => {
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

// User registration
exports.signup = async (req, res) => {
  try {
      const { username, email, password } = req.body;
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).send('User already registered.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password, isAdmin: false });
      await newUser.save();

      const token = generateToken(newUser);
      res.status(200).json({ message: 'Signup successful!', token });
  } catch (error) {
    res.status(500).json({ message: 'Error in registration process', error: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = generateToken(user);
    res.json({ message: 'Login successful!', token });
} catch (error) {
    res.status(500).json({ message: error.message || 'Error during login.' });
}
};

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);
    const targetUserId = req.params.userId;

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).send('User not found.');
    }

    if (!user.following.includes(targetUserId)) {
      user.following.push(targetUserId);
      await user.save();
      res.send('User followed successfully.');
    } else {
      res.send('Already following the user.');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserIdFromToken(token);

    const user = await User.findById(userId);

    if (user.following.includes(targetUserId)) {
      user.following.pull(targetUserId);
      await user.save();
      res.send('User unfollowed successfully.');
    } else {
      res.send('Not following the user.');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
