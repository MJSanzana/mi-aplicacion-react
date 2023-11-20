// Login.js
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Footer from '../pages/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Login() {
    const [Email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const { usuario, login } = useContext(AuthContext);
    const navigate = useNavigate();

    // useEffect colocado en el nivel superior del componente
    useEffect(() => {
        console.log('useEffect usuario:', usuario); // Para depuración
        if (usuario) {
            switch (usuario.TipoUsuario) {
                case "Usuario":
                    navigate('/pagina-usuario');
                    break;
                case "Administrador":
                    navigate('/pagina-administrador');
                    break;
                case "Proveedor":
                    navigate('/pagina-proveedor');
                    break;
                case "Soporte":
                    navigate('/pagina-soporte');
                    break;
                default:
                    navigate('/'); // Redirige al Home si no coincide con ningún tipo
            }
        }
    }, [usuario, navigate]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                login({
                    userId: response.data.userId,
                    tipoUsuario: response.data.tipoUsuario,
                    token: response.data.token
                });
                console.log(usuario); // Agrega esto para depuración

            } else if (response.status === 400 && response.data.message) {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Error al intentar iniciar sesión. Por favor intenta nuevamente.');
        }
    };
    return (
        <div>
            <main>
                <div className="container">
                    <h1 className="mt-4 mb-3">Iniciar Sesión</h1>
                    {error && <p className="text-danger">{error}</p>}
                    <div className="row">
                        <div className="col-lg-4 offset-lg-4">
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="Email" className="form-label">Correo electrónico</label>
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
                                    <label htmlFor="password" className="form-label">Contraseña</label>
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

                                    <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                                    <div className="d-grid">
                                        <input className="btn btn-primary" type="submit" name="submit" value="Iniciar sesión" />
                                    </div>
                                    <div className="mt-3">
                                        ¿Aún no tienes cuenta? <Link to="/Registro">Regístrate</Link>
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