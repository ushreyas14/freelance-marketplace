import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [job, setJob] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [proposal, setProposal] = useState('');

    // Modal State for Accept/Reject
    const [selectedBid, setSelectedBid] = useState(null);
    const [actionType, setActionType] = useState(null); // 'accept' or 'reject'
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchJobAndBids = async () => {
            try {
                const jobRes = await api.get(`/jobs/${id}`);
                setJob(jobRes.data);

                // Fetch bids if user is logged in
                if (localStorage.getItem('token')) {
                    const bidsRes = await api.get(`/bids/${id}`);
                    setBids(bidsRes.data);
                }
            } catch (err) {
                console.error(err);
                alert("Error fetching job details");
            }
        };
        fetchJobAndBids();
    }, [id]);

    const onBidSubmit = async e => {
        e.preventDefault();
        try {
            await api.post(`/bids/${id}`, { amount: bidAmount, proposal });
            // Refresh bids
            const bidsRes = await api.get(`/bids/${id}`);
            setBids(bidsRes.data);
            setBidAmount('');
            setProposal('');
            alert('Bid placed successfully!');
        } catch (err) {
            alert('Error placing bid');
        }
    };

    const handleActionClick = (bid, type) => {
        setSelectedBid(bid);
        setActionType(type);
        setFeedback('');
    };

    const submitAction = async () => {
        if (!selectedBid || !actionType) return;
        try {
            await api.put(`/bids/${actionType}/${selectedBid._id}`, { feedback });

            // Refresh Data
            const jobRes = await api.get(`/jobs/${id}`);
            setJob(jobRes.data);
            const bidsRes = await api.get(`/bids/${id}`);
            setBids(bidsRes.data);

            setSelectedBid(null);
            setActionType(null);
            setFeedback('');
            alert(`Bid ${actionType}ed successfully!`);
        } catch (err) {
            alert('Error processing request');
        }
    };
    //loading
    if (!job) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    const isClientOwner = user && user._id === job.postedBy._id;

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-8 mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
                        <p className="text-gray-500 text-sm mb-4">Posted by {job.postedBy.name} on {new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {job.status.replace('_', ' ')}
                    </span>
                </div>

                <div className="prose max-w-none text-gray-600 mb-6">
                    {job.description}
                </div>

                <div className="flex items-center space-x-2 text-lg font-semibold">
                    <span>Budget:</span>
                    <span className="text-green-600">Rs {job.budget.toLocaleString('en-IN')}</span>
                </div>
            </div>

            {/* Freelancer Bid Form */}
            {user && user.role === 'freelancer' && job.status === 'open' && (
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-8 mb-8">
                    <h3 className="text-xl font-bold mb-4">Place a Bid</h3>
                    <form onSubmit={onBidSubmit}>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Bid Amount (Rs)</label>
                                <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Proposal</label>
                            <textarea value={proposal} onChange={e => setProposal(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 h-32" required></textarea>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">Submit Quote</button>
                    </form>
                </div>
            )}

            {/* Bids List */}
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Bids ({bids.length})</h3>
                {bids.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg border border-gray-100 border-dashed text-gray-500">
                        No bids placed yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bids.map(bid => (
                            <div key={bid._id} className={`p-6 bg-white rounded-xl shadow-sm border ${bid.status === 'accepted' ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-100'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800">{bid.freelancer.name}</h4>
                                        <p className="text-sm text-gray-500">{new Date(bid.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold text-green-600">Rs {bid.amount.toLocaleString('en-IN')}</span>
                                        <span className={`text-xs font-bold uppercase ${bid.status === 'accepted' ? 'text-green-600' : bid.status === 'rejected' ? 'text-red-500' : 'text-gray-500'}`}>
                                            {bid.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">{bid.proposal}</p>

                                {bid.feedback && (
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic">
                                        <strong>Feedback:</strong> {bid.feedback}
                                    </div>
                                )}

                                {/* Client Controls */}
                                {isClientOwner && bid.status === 'pending' && job.status === 'open' && (
                                    <div className="mt-4 flex space-x-3 border-t pt-4">
                                        <button onClick={() => handleActionClick(bid, 'accept')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium">Accept Bid</button>
                                        <button onClick={() => handleActionClick(bid, 'reject')} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm font-medium">Reject Bid</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Modal */}
            {selectedBid && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 capitalize">{actionType} Bid from {selectedBid.freelancer.name}</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to {actionType} this bid?
                            {actionType === 'accept' && " This will mark the job as In Progress and reject other bids."}
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Feedback (Optional)</label>
                            <textarea
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}
                                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500"
                                placeholder={`Reason for ${actionType}ing...`}
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setSelectedBid(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={submitAction} className={`px-4 py-2 text-white rounded-lg capitalize ${actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                Confirm {actionType}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;
