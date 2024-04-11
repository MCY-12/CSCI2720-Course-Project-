const Message = require('../models/messageModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Helper function to get user ID from JWT token
const getUserIdFromToken = (token) => {
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
};

exports.createMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(token); // Get user ID from JWT token
        const message = new Message({ content, author: userId });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error creating message', error: error.message });
    }
};

// Like a message
exports.likeMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).send('Message not found');
        }
        message.likes += 1;
        await message.save();
        res.send('Message liked successfully');
    } catch (error) {
        res.status(500).send('Error liking message');
    }
};

// Dislike a message
exports.dislikeMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).send('Message not found');
        }
        message.dislikes += 1;
        await message.save();
        res.send('Message disliked successfully');
    } catch (error) {
        res.status(500).send('Error disliking message');
    }
};

// Comment on a message
exports.commentOnMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const messageId = req.params.messageId;
        const token = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(token); // Get user ID from JWT token
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        message.comments.push({ text, author: userId });
        await message.save();
        res.json({ message: 'Comment added successfully', comment: { text, author: userId } });
    } catch (error) {
        res.status(500).json({ message: 'Error commenting on message', error: error.message });
    }
};

// Retweet a message
exports.retweetMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).send('Message not found');
        }
        message.retweetCount += 1;
        await message.save();
        res.send('Message retweeted successfully');
    } catch (error) {
        res.status(500).send('Error retweeting message');
    }
};

// Fetch messages from followed users
exports.getFollowingMessages = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userId = getUserIdFromToken(token); // Get user ID from JWT token
        const user = await User.findById(userId).populate('following');
        const messages = await Message.find({ author: { $in: user.following } }).populate('author');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};
