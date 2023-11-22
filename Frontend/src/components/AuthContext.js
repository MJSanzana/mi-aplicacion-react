// AuthProvider.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tipoUsuario = localStorage.getItem('tipoUsuario'); // Consistencia en la propiedad
        
        if (token && userId && tipoUsuario) {
            setUsuario({
                userId,
                tipoUsuario, // Consistencia en la propiedad
                token
            });
        }
    }, []);

    const login = (datosUsuario) => {
        localStorage.setItem('token', datosUsuario.token);
        localStorage.setItem('userId', datosUsuario.userId);
        localStorage.setItem('tipoUsuario', datosUsuario.tipoUsuario); // Consistencia en la propiedad
        
        setUsuario({
            userId: datosUsuario.userId,
            tipoUsuario: datosUsuario.tipoUsuario, // Consistencia en la propiedad
            token: datosUsuario.token
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tipoUsuario'); // Consistencia en la propiedad
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

