import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/profile/me', {
                        headers: { 'x-auth-token': token }
                    });
                    setUser(res.data);
                } catch (err) {
                    console.error('Auth Load Error:', err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);

        // Fetch user details immediately after login
        const profileRes = await api.get('/profile/me', {
            headers: { 'x-auth-token': res.data.token }
        });
        setUser(profileRes.data);
    };

    const register = async (name, email, password, role) => {
        const res = await api.post('/auth/register', { name, email, password, role });
        localStorage.setItem('token', res.data.token);
        // Fetch user details immediately after register
        const profileRes = await api.get('/profile/me', {
            headers: { 'x-auth-token': res.data.token }
        });
        setUser(profileRes.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
