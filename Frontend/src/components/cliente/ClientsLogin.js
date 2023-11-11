import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ClientsLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { userLogin } = useAuth(); // Usa el hook personalizado useAuth
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await axios.post('http://localhost:5000/api/clients/Confeccionistas/login', {
                email: email,
                contrasena: password
            });

            const token = response.data.token;
            userLogin(token); // Asumiendo que userLogin actualiza correctamente el estado de autenticación
            navigate('/Cliente/Home'); // Redirige al usuario a la página de inicio del cliente
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error desconocido.");
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div style={{ maxWidth: "500px", width: "100%" }}>
                <h2 className="text-center mb-4">Iniciar sesión como proveedor</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fas fa-lock"></i></span>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password" // Añadido aquí
                            />
                        </div>
                    </div>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <div className="alert alert-success" role="alert">Inicio de sesión exitoso. Redirigiendo...</div>
                    <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
                </form>
            </div>
        </div>
    );
}
export default ClientsLogin;