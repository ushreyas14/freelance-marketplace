const Job = require('../models/Job');

// Get all jobs
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get job by ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Get jobs posted by current user
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a job
exports.createJob = async (req, res) => {
    try {
        // Check if user is a client
        if (req.user.role !== 'client') {
            return res.status(403).json({ msg: 'Only clients can post jobs' });
        }

        const { title, description, budget, deadlines } = req.body;

        const newJob = new Job({
            title,
            description,
            budget,
            deadlines,
            postedBy: req.user.id
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a job
exports.updateJob = async (req, res) => {
    try {
        // ... (existing update logic)
        // Simplified for brevity in this update, assuming previous logic is preserved if not overwritten
        // BUT since write_to_file overwrites, I must include everything or use replace_file_content.
        // I will use write_to_file to ensure clean state with new method.

        const { title, description, budget, deadlines, status } = req.body;

        let job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a job
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await job.deleteOne();
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
