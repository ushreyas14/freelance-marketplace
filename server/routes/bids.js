const express = require('express');
const router = express.Router();
const { placeBid, getBidsByJob, getMyBids, acceptBid, rejectBid } = require('../controllers/bidController');
const auth = require('../middleware/auth');

// @route   POST api/bids/:jobId
// @desc    Place a bid on a job
// @access  Private
router.post('/:jobId', auth, placeBid);

// @route   GET api/bids/:jobId
// @desc    Get all bids for a job
// @access  Public
router.get('/:jobId', getBidsByJob);

// @route   GET api/bids/my-bids
// @desc    Get current user's bids
// @access  Private
router.get('/my/all', auth, getMyBids);

// @route   PUT api/bids/accept/:id
// @desc    Accept a bid
// @access  Private
router.put('/accept/:id', auth, acceptBid);

// @route   PUT api/bids/reject/:id
// @desc    Reject a bid
// @access  Private
router.put('/reject/:id', auth, rejectBid);

module.exports = router;
