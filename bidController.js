const Bid = require('../models/Bid');
const Job = require('../models/Job');

// Place a bid on a job
exports.placeBid = async (req, res) => {
    try {
        const { amount, proposal } = req.body;
        const jobId = req.params.jobId;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        if (job.postedBy.toString() === req.user.id) {
            return res.status(400).json({ msg: 'Cannot bid on your own job' });
        }

        const existingBid = await Bid.findOne({ job: jobId, freelancer: req.user.id });
        if (existingBid) {
            return res.status(400).json({ msg: 'You have already placed a bid on this job' });
        }

        const newBid = new Bid({
            job: jobId,
            freelancer: req.user.id,
            amount,
            proposal
        });

        const bid = await newBid.save();
        res.json(bid);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all bids for a job
exports.getBidsByJob = async (req, res) => {
    try {
        const bids = await Bid.find({ job: req.params.jobId })
            .populate('freelancer', 'name email')
            .sort({ createdAt: -1 });
        res.json(bids);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get bids by current freelancer
exports.getMyBids = async (req, res) => {
    try {
        const bids = await Bid.find({ freelancer: req.user.id })
            .populate('job', 'title status')
            .sort({ createdAt: -1 });
        res.json(bids);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Accept a bid (Client Only)
exports.acceptBid = async (req, res) => {
    try {
        const { feedback } = req.body;
        const bid = await Bid.findById(req.params.id).populate('job');
        if (!bid) return res.status(404).json({ msg: 'Bid not found' });

        // Check if user is job owner
        if (bid.job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Update Bid status
        bid.status = 'accepted';
        if (feedback) bid.feedback = feedback;
        await bid.save();

        // Update Job status to 'in_progress'
        const job = await Job.findById(bid.job._id);
        job.status = 'in_progress';
        await job.save();

        // Reject other bids for this job
        await Bid.updateMany(
            { job: bid.job._id, _id: { $ne: bid._id } },
            { status: 'rejected', feedback: 'Another bid was accepted for this job.' }
        );

        res.json({ bid, job });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Reject a bid (Client Only)
exports.rejectBid = async (req, res) => {
    try {
        const { feedback } = req.body;
        const bid = await Bid.findById(req.params.id).populate('job');
        if (!bid) return res.status(404).json({ msg: 'Bid not found' });

        // Check if user is job owner
        if (bid.job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Update Bid status
        bid.status = 'rejected';
        if (feedback) bid.feedback = feedback;
        await bid.save();

        res.json(bid);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
