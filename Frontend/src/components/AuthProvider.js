import React, { useState, createContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    // Función para establecer los datos del usuario tras un inicio de sesión exitoso
    const login = (datosUsuario) => {
        localStorage.setItem('token', datosUsuario.token);
        setUsuario({
            Id: datosUsuario.Id,
            TipoUsuario: datosUsuario.TipoUsuario,
            token: datosUsuario.token
        });
    };
    

    // Función para cerrar la sesión del usuario
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

