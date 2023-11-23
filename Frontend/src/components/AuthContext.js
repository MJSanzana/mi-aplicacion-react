// AuthProvider.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tipoUsuario = localStorage.getItem('tipoUsuario');
        const NombreUsuario = localStorage.getItem('NombreUsuario'); 
        // Devuelve el usuario si todos los valores están presentes
        return token && userId && tipoUsuario ? { token, userId, tipoUsuario, NombreUsuario } : null;
    });

    useEffect(() => {
        // Esta función verifica si el usuario actualmente en el estado es diferente al usuario almacenado localmente
        const checkUser = () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const tipoUsuario = localStorage.getItem('tipoUsuario');
            
            // Comprueba si hay alguna diferencia y, de ser así, actualiza el estado
            if (token && userId && tipoUsuario && (usuario?.userId !== userId || usuario?.token !== token || usuario?.tipoUsuario !== tipoUsuario)) {
                setUsuario({
                    userId,
                    tipoUsuario,
                    token
                });
            }
        };

        // Llama a la función checkUser cuando el componente se monta
        checkUser();
    }, []);

    const login = (datosUsuario) => {
        localStorage.setItem('token', datosUsuario.token);
        localStorage.setItem('userId', datosUsuario.userId);
        localStorage.setItem('tipoUsuario', datosUsuario.tipoUsuario);
        localStorage.setItem('NombreUsuario', datosUsuario.NombreUsuario); 
        
        setUsuario({
            userId: datosUsuario.userId,
            tipoUsuario: datosUsuario.tipoUsuario,
            token: datosUsuario.token,
            NombreUsuario: datosUsuario.NombreUsuario 
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tipoUsuario');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, setUsuario }}>
            {children}
        </AuthContext.Provider>
    );
};


