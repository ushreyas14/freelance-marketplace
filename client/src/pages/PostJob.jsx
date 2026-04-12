import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const PostJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        deadlines: ''
    });

    const { title, description, budget, deadlines } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to post a job');
                return navigate('/login');
            }

            await api.post('/jobs', formData, {
                headers: {
                    'x-auth-token': token
                }
            });
            navigate('/jobs');
        } catch (err) {
            console.error(err?.response?.data || err.message);
            alert(err?.response?.data?.msg || 'Error posting job');
        }
    };

    return (
        <div className="container mx-auto mt-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center">Post a Job</h2>
            <div className="bg-white p-8 rounded shadow-md">
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Job Title</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 h-32"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Budget (Rs)</label>
                        <input
                            type="number"
                            name="budget"
                            value={budget}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Deadline</label>
                        <input
                            type="date"
                            name="deadlines"
                            value={deadlines}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Post Job</button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
