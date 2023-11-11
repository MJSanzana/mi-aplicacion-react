// ProtectedRoute.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EnsureAuth({ children }) {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (!token) {
            navigate('/Login');
        }
    }, [token, navigate]);

    return token ? children : null;
}

export default EnsureAuth;
