// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../pages/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

function Login({ changeView }) {
    const [Email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    const handleLoginResponse = (tipoUsuario) => {

        switch (tipoUsuario) {
            case "Usuario":
                navigate('/pagina-usuario'); // Navega a la página del usuario
                break;
            case "Administrador":
                navigate('/pagina-administrador'); // Navega a la página del administrador
                break;
            case "Proveedor":
                navigate('/pagina-proveedor'); // Navega a la página del proveedor
                break;
            case "Soporte":
                navigate('/pagina-soporte'); // Navega a la página de soporte
                break;
            default:
                navigate('/pagina-usuario'); // Navega a la página de inicio por defecto
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!regexEmail.test(Email.trim())) {
            setError("Formato de correo inválido.");
            return;
        }

        if (!password.trim()) {
            setError("La contraseña es obligatoria.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/Login', { Email, Contraseña: password });
            if (response.status === 200 && response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId); // Asegúrate de que la clave 'userId' sea la misma que el backend envía.
                handleLoginResponse(response.data.tipoUsuario); // Llama a la función con la respuesta correcta
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Error al intentar iniciar sesión. Por favor intenta nuevamente.');
        }
    
    };
    const navigateToRegister = () => {
        changeView('Registro');
    };

    return (
        <div>
            <main>
                <div className="container mt-5 mb-2">
                    <h1 className="mt-1 mb-4">Iniciar Sesión</h1>
                    {error && <p className="text-danger">{error}</p>}
                    <div className="row">
                        <div className="col-lg-4 offset-lg-4">
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="Email" className="form-label">Correo electrónico:</label>
                                    {/* Añadido margen inferior */}
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        className="form-control mb-2"
                                        id="Email"
                                        placeholder="Ingresa tu correo electrónico"
                                        value={Email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label htmlFor="password" className="form-label">Contraseña:</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Ingresa tu contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ marginRight: '5px' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            style={{ background: 'transparent', border: 'none' }}
                                        >
                                            {showPassword ? '🔒' : '🔓'}
                                        </button>
                                    </div>
                                    <div className="input-field col-8 offset-1 mb-2">
                                        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                                    </div>
                                    <div className="d-grid ">
                                        <div className="row">
                                            <div className="input-field col-5 offset-5 mb-5">
                                                <input className="btn btn-primary" type="submit" name="submit" value="Iniciar sesión" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 mb-2">
                                        ¿Aún no tienes cuenta? <Button variant="secondary" onClick={navigateToRegister}>Regístrate</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Login;