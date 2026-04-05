import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const Profile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        bio: '',
        skills: ''
    });
    const [loading, setLoading] = useState(true);

    const { name, email, role, bio, skills } = formData;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await api.get('/profile/me', {
                    headers: { 'x-auth-token': token }
                });

                setFormData({
                    name: res.data.name,
                    email: res.data.email,
                    role: res.data.role,
                    bio: res.data.bio || '',
                    skills: res.data.skills ? res.data.skills.join(', ') : ''
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.put('/profile', { name, bio, skills }, {
                headers: { 'x-auth-token': token }
            });
            alert('Profile Updated Successfully');
        } catch (err) {
            console.error(err.response.data);
            alert('Error updating profile');
        }
    };

    if (loading) return <div className="container mx-auto mt-10">Loading...</div>;

    return (
        <div className="container mx-auto mt-10 max-w-2xl text-white">
            <div className="bg-white p-8 rounded shadow-md text-gray-800">
                <h2 className="text-3xl font-bold mb-6">User Profile</h2>
                <div className="mb-4">
                    <span className="font-bold">Email:</span> {email}
                </div>
                <div className="mb-4">
                    <span className="font-bold">Role:</span> <span className="capitalize">{role}</span>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
                        <textarea
                            name="bio"
                            value={bio}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 h-24"
                            placeholder="Tell us about yourself..."
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Skills (comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={skills}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="React, Node.js, Design"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
