const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, getProfile);

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, updateProfile);

module.exports = router;
