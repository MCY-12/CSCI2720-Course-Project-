const User = require('../models/userModel');
const Message = require('../models/messageModel');
const jwt = require('jsonwebtoken');

// List all users
exports.listAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords from the result
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// Delete a tweet
exports.deleteTweet = async (req, res) => {
    try {
        const tweetId = req.params.tweetId;
        await Message.findByIdAndDelete(tweetId);
        res.json({ message: 'Tweet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tweet', error: error.message });
    }
};
