const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.get('/users', adminController.listAllUsers); // List all users
router.delete('/user/:userId', adminController.deleteUser); // Delete a user

module.exports = router;
