import React, { createContext, useState, useContext, useEffect } from 'react';

// Crea un contexto para la autenticación.
const AuthContext = createContext({});

// Usa este hook personalizado para acceder al contexto de autenticación.
export const useAuth = () => useContext(AuthContext);

// Este es tu proveedor de autenticación que combina la lógica de autenticación de admin y usuario general.
export const AuthProvider = ({ children }) => {
    // Estado para la autenticación del administrador.
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    // Estado para la autenticación del usuario general.
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    // Efecto para verificar la autenticación del administrador.
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        setIsAdminAuthenticated(!!adminToken);
    }, []);

    // Efecto para verificar la autenticación del usuario general.
    useEffect(() => {
        const userToken = localStorage.getItem('authToken');
        setIsUserAuthenticated(!!userToken);
    }, []);

    // Función para iniciar sesión como administrador.
    const adminLogin = (token) => {
        localStorage.setItem('adminToken', token);
        setIsAdminAuthenticated(true);
    };

    // Función para cerrar sesión como administrador.
    const adminLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAdminAuthenticated(false);
    };

    // Función para iniciar sesión como usuario general.
    const userLogin = (token) => {
        localStorage.setItem('authToken', token);
        setIsUserAuthenticated(true);
    };

    // Función para cerrar sesión como usuario general.
    const userLogout = () => {
        localStorage.removeItem('authToken');
        setIsUserAuthenticated(false);
    };

    // El valor del contexto proporciona tanto las funciones de autenticación como los estados de autenticación.
    return (
        <AuthContext.Provider value={{
            isAdminAuthenticated,
            isUserAuthenticated,
            adminLogin,
            adminLogout,
            userLogin,
            userLogout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
