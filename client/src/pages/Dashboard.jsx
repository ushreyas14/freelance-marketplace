import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [myJobs, setMyJobs] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token ) {
                    setLoading(false);
                    return;
                }

                const profileRes = await api.get('/profile/me', { headers: { 'x-auth-token': token } });
                setUser(profileRes.data );

                if (profileRes.data.role === 'client') {
                    const jobsRes = await api.get('/jobs/my-jobs', { headers: { 'x-auth-token': token } });
                    setMyJobs(jobsRes.data);
                } else {
                    const bidsRes = await api.get('/bids/my/all', { headers: { 'x-auth-token': token } });
                    setMyBids(bidsRes.data);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);  
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return <div className="container mx-auto mt-10 p-4">Please log in.</div>;

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h2>
                    <p className="text-gray-500 capitalize">{user.role} Account</p>
                </div>
                <Link to="/profile" className="text-blue-600 hover:text-blue-700 font-medium">Edit Profile</Link>
            </div>

            {user.role === 'client' ? (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">My Posted Jobs</h3>
                        <Link to="/post-job" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">Post New Job</Link>
                    </div>
                    {myJobs.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg border border-gray-100 border-dashed">
                            <p className="text-gray-500">You haven't posted any jobs yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {myJobs.map(job => (
                                <div key={job._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800 hover:text-blue-600">
                                            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                                        </h4>
                                        <p className="text-sm text-gray-500">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                            ${job.status === 'open' ? 'bg-green-100 text-green-700' :
                                                job.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {job.status.replace('_', ' ')}
                                        </span>
                                        <Link to={`/jobs/${job._id}`} className="text-gray-400 hover:text-blue-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">My Bids</h3>
                    {myBids.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg border border-gray-100 border-dashed">
                            <p className="text-gray-500">You haven't placed any bids yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {myBids.map(bid => (
                                <div key={bid._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-bold text-gray-800">{bid.job.title}</h4>
                                        <span className="font-bold text-green-600 text-lg">Rs {bid.amount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Job Status: <span className="font-medium text-gray-700 capitalize">{bid.job.status.replace('_', ' ')}</span></p>
                                            <p className="text-sm text-gray-500">My Bid Status: <span className={`font-bold capitalize ${bid.status === 'accepted' ? 'text-green-600' : 'text-gray-600'}`}>{bid.status}</span></p>
                                        </div>
                                        <Link to={`/jobs/${bid.job._id}`} className="text-blue-600 hover:underline text-sm font-medium">View Job</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
