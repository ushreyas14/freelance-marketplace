import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const JobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/jobs');
                setJobs(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                alert("Failed to load jobs. Please try again.");
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Latest Jobs</h2>
                {user && user.role === 'client' && (
                    <Link to="/post-job" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-medium">
                        Post a Job
                    </Link>
                )}
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500 text-lg">No jobs available at the moment.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <Link to={`/jobs/${job._id}`} key={job._id} className="block group">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition line-clamp-1">{job.title}</h3>
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                                        Rs {job.budget.toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-6 flex-grow line-clamp-3">{job.description}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                            {job.postedBy?.name?.charAt(0) || '?'}
                                        </div>
                                        <span>{job.postedBy?.name || 'Unknown'}</span>
                                    </div>
                                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobBoard;
