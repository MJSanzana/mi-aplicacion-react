// AuthProvider.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    const login = (datosUsuario) => {
        localStorage.setItem('token', datosUsuario.token);
        setUsuario({
            userId: datosUsuario.userId,
            TipoUsuario: datosUsuario.tipoUsuario,
            token: datosUsuario.token
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};