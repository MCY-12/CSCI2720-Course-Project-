const express = require('express');
const messageController = require('../controllers/messageController');
const router = express.Router();

router.post('/', messageController.createMessage); // Post a new message
router.post('/like/:messageId', messageController.likeMessage); // Like a message
router.post('/dislike/:messageId', messageController.dislikeMessage); // Dislike a message
router.post('/comment/:messageId', messageController.commentOnMessage); // Comment on a message
router.post('/retweet/:messageId', messageController.retweetMessage); // Retweet a message
router.get('/following', messageController.getFollowingMessages); // Get messages from followed users

module.exports = router;
