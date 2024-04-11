const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/follow/:userId', userController.followUser);
router.post('/unfollow/:userId', userController.unfollowUser);

module.exports = router;
