const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs } = require('../controllers/jobController');
const auth = require('../middleware/auth');

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', (req, res, next) => {
    console.log('Request to GET /');
    next();
}, getJobs);

// @route   GET api/jobs/my-jobs
// @desc    Get current user's jobs
// @access  Private
router.get('/my-jobs', (req, res, next) => {
    console.log('Request to GET /my-jobs');
    next();
}, auth, getMyJobs);

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', (req, res, next) => {
    console.log(`Request to GET /:id with id: ${req.params.id}`);
    next();
}, getJobById);

// @route   POST api/jobs
// @desc    Create a job
// @access  Private
router.post('/', auth, createJob);

// @route   PUT api/jobs/:id
// @desc    Update a job
// @access  Private
router.put('/:id', auth, updateJob);

// @route   DELETE api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', auth, deleteJob);

module.exports = router;
