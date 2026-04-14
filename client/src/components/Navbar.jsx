import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-slate-900 text-white shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-tight hover:text-blue-400 transition">
                    FreelanceHub
                </Link>

                {/* Desktop Menu Only */}
                <div className="flex items-center space-x-8">
                    
                    {(!user || user.role !== 'client') && (
                        <Link to="/jobs" className="hover:text-blue-400 transition">
                            Find Jobs
                        </Link>
                    )}

                    {user ? (
                        <>
                            <Link to="/dashboard" className="hover:text-blue-400 transition">
                                Dashboard
                            </Link>

                            {user.role === 'client' && (
                                <Link 
                                    to="/post-job" 
                                    className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Post Job
                                </Link>
                            )}

                            {/* Profile Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center space-x-2 focus:outline-none">
                                    
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name */}
                                    <span className="font-medium">{user.name}</span>

                                    {/* Role */}
                                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded uppercase">
                                        {user.role}
                                    </span>
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <Link 
                                        to="/profile" 
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>

                                    <button 
                                        onClick={onLogout} 
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-400 transition">
                                Login
                            </Link>

                            <Link 
                                to="/register" 
                                className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Join Now
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;