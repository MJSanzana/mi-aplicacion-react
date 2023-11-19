import React, { createContext, useState } from 'react';

// Crea el contexto con un valor inicial predeterminado
export const AuthContext = createContext({
    usuario: null, // Estado inicial del usuario
    login: () => {}, // Función para manejar el inicio de sesión
    logout: () => {}, // Función para manejar el cierre de sesión
});

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    // Función para establecer los datos del usuario tras un inicio de sesión exitoso
    const login = (datosUsuario) => {
        localStorage.setItem('token', datosUsuario.token); // Opcional, dependiendo de tu estrategia de manejo de sesión
        setUsuario({
            Id: datosUsuario.Id,
            TipoUsuario: datosUsuario.TipoUsuario,
            token: datosUsuario.token
        });
    };

    // Función para cerrar la sesión del usuario
    const logout = () => {
        localStorage.removeItem('token'); // Opcional, dependiendo de tu estrategia de manejo de sesión
        setUsuario(null);
    };

    // Proporciona el estado del usuario y las funciones para manipularlo a los componentes descendientes
    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
