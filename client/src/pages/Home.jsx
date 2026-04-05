import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Background" className="w-full h-full object-cover opacity-20" />
                </div>
                <div className="relative container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Hire Expert Freelancers for <span className="text-blue-400">Any Job</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl">
                        Millions of people use FreelanceHub to turn their ideas into reality. Find professionals for your next project or find work that matches your skills.
                    </p>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        {user ? (
                            <Link to="/jobs" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                                Browse Jobs
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                                    Get Started
                                </Link>
                                <Link to="/jobs" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-slate-900 transition">
                                    Browse Jobs
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose FreelanceHub?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Safe & Secure</h3>
                            <p className="text-gray-600">Your payments are secured with our escrow system. Release funds only when you're 100% satisfied.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Quality Work</h3>
                            <p className="text-gray-600">Find the right freelancer with the right skills. Review profiles, portfolios, and ratings.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Fast Bidding</h3>
                            <p className="text-gray-600">Receive bids from talented freelancers within minutes of posting your job.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
