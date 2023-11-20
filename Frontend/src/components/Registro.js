// Registro.js
import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../pages/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';

function Registro({ changeView }) {
    const [formData, setFormData] = useState({
        Nombre: '',
        Apellido: '',
        pwd: '',
        repeat_pwd: '',
        Email: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Nuevo estado para controlar la visibilidad de la contraseña
    const [showRepeatPassword, setShowRepeatPassword] = useState(false); // Nuevo estado

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const togglePasswordVisibility = () => { // Nueva función para alternar la visibilidad
        setShowPassword(!showPassword);
    };

    const toggleRepeatPasswordVisibility = () => { // Nueva función
        setShowRepeatPassword(!showRepeatPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { Nombre, Apellido, pwd, repeat_pwd, Email } = formData;

        // Validación de email
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!regexEmail.test(Email)) {
            alert('Por favor, introduce un email válido');
            return;
        }

        if (pwd !== repeat_pwd) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/CreateUser', {
                NombreUsuario: formData.Nombre,
                Apellido: formData.Apellido,
                Email: formData.Email,
                Contraseña: formData.pwd,
                TipoUsuario: 'Usuario'
            });            
            alert('Usuario registrado exitosamente');
        } catch (error) {
            console.error('Error registrando el usuario:', error);

            if (error.response) {
                console.error('Detalles del error:', error.response.data);
                alert('Error registrando el usuario: ' + error.response.data.message);
            } else {
                alert('Error registrando el usuario, no se pudo conectar con el servidor.');
            }
        }
    };
    const navigateToLogin = () => {
        changeView('Login'); 
    };

    return (
        <div className="container mt-5">
            <h1 className="mt-4 mb-3">Regístrate</h1>
            <div className="rounded-card-parent">
                <div className="card rounded-card">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="input-field col-8 offset-2">
                                <label htmlFor="Nombre" className="black-text">Nombre</label>
                                <input name="Nombre" placeholder="Ingresa tu nombre" id="Nombre" type="text" className="form-control black-text" minLength="2" maxLength="20" required
                                    value={formData.Nombre} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col-8 offset-2">
                                <label htmlFor="Apellido" className="black-text">Apellido</label>
                                <input name="Apellido" placeholder="Ingresa tu apellido" id="Apellido" type="text" className="form-control black-text" minLength="2" maxLength="20" required
                                    value={formData.Apellido} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col-8 offset-2">
                                <label htmlFor="pwd" className="black-text">Contraseña</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        name="pwd"
                                        id="pwd"
                                        type={showPassword ? "text" : "password"}
                                        className="form-control black-text"
                                        minLength="8"
                                        maxLength="8"
                                        placeholder="Ingresa una contraseña"
                                        required
                                        autocomplete="current-password"  // Añadido el atributo autocomplete
                                        value={formData.pwd}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        style={{ background: 'transparent', border: 'none' }}
                                    >
                                        {showPassword ? '🔒' : '🔓'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col-8 offset-2">
                                <label htmlFor="repeat_pwd" className="black-text">Repita Contraseña</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        name="repeat_pwd"
                                        id="repeat_pwd"
                                        type={showRepeatPassword ? "text" : "password"} // Alternar tipo
                                        className="form-control black-text"
                                        maxLength="8"
                                        placeholder="Repite la contraseña"
                                        required
                                        value={formData.repeat_pwd}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleRepeatPasswordVisibility}
                                        style={{ background: 'transparent', border: 'none' }}
                                    >
                                        {showRepeatPassword ? '🔒' : '🔓'}

                                    </button>
                                </div>
                                <span id="password-error" className="errormsg">{passwordError}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col-8 offset-2">
                                <label htmlFor="Email" className="black-text">Correo electrónico</label>
                                <input name="Email" placeholder="Ingresa tu Correo electrónico" id="Email" type="Email" className="form-control black-text" maxLength="25" required
                                    value={formData.Email} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col-8 offset-4">
                                <input className="btn btn-primary" type="submit" name="submit" value="Registrarse" />
                            </div>
                            <div className="mt-3">
                                ¿Ya tienes cuenta? <Button variant="secondary" onClick={navigateToLogin}>Inicia sesión</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer /> {/* Aquí se añade el Footer */}
        </div>
    );
}

export default Registro;