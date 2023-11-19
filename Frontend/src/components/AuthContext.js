import React, { createContext, useState, useContext } from 'react';

// Crea el contexto
export const AuthContext = createContext({
    usuario: null, // Aquí puedes añadir más propiedades iniciales si es necesario
    setUsuario: () => { }
});

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    // Aquí puedes añadir lógica para manejar la autenticación

    return (
        <AuthContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </AuthContext.Provider>
    );
};
