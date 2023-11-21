import React, { useState, useRef } from 'react';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Soporte = () => {
    const [formData, setFormData] = useState({
        Nombre: '',
        Email: '',
        Problema: '',
        CommonErrors: []
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState('');
    const formRef = useRef();

    const validateEmail = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(formData.Email);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { Nombre, Email, Problema, CommonErrors } = formData;

        if (!validateEmail(Email)) {
            setError('Por favor, ingresa una dirección de email válida.');
            return;
        }

        if (Nombre && Email && CommonErrors.length > 0 && Problema) {
            try {
                const response = await axios.post('http://localhost:5000/api/createTicket', {
                    Nombre,
                    Email,
                    Problema,
                    CommonErrors
                });

                if (response.status === 200) {
                    setShowSuccessModal(true);
                    // Restablece formData y cualquier otro estado necesario aquí
                    setFormData({
                        Nombre: '',
                        Email: '',
                        Problema: '',
                        CommonErrors: []
                    });
                    // Si también quieres borrar el mensaje de error después de un envío exitoso
                    setError('');
                } else {
                    setError("Error en el servidor: " + response.status);
                }
            } catch (error) {
                setError('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
            }
        } else {
            setError('Por favor, complete todos los campos del formulario.');
        }
    }


    const handleCheckboxChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            CommonErrors: e.target.checked
                ? [...prevState.CommonErrors, e.target.value]
                : prevState.CommonErrors.filter(error => error !== e.target.value)
        }));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    }
    const handleCloseModal = () => {
        setShowSuccessModal(false);
    };
    return (

        <div className="container mt-5">
            <h1 className="mt-1 mb-4">Contacto Soporte</h1>
            <form onSubmit={handleSubmit} className="p-5 border rounded" ref={formRef}>
                {/* Campo Nombre */}
                <div className="row">
                    <div className="input-field col-8 offset-2">
                        <label htmlFor="Nombre">Nombre:</label>
                        <input type="text" className="form-control form-control-lg" name="Nombre" id="Nombre" value={formData.Nombre} onChange={handleChange} required />
                    </div>
                </div>

                {/* Campo Email */}
                <div className="row">
                    <div className="input-field col-8 offset-2">
                        <label htmlFor="Email">Email:</label>
                        <input type="Email" className="form-control form-control-lg" name="Email" id="Email" value={formData.Email} onChange={handleChange} required />
                    </div>
                </div>

                {/* Selección de Error Común */}
                <div className="row">
                    <div className="input-field col-8 offset-2">
                        <label>Error:</label><br />
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="CommonErrors" id="error1" value="Inicio de sesión fallido" onChange={handleCheckboxChange} />
                            <label className="form-check-label" htmlFor="error1">
                                Inicio de sesión fallido
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="CommonErrors" id="error2" value="Problema al realizar un pedido" onChange={handleCheckboxChange} />
                            <label className="form-check-label" htmlFor="error2">
                                Problema al realizar un pedido
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="CommonErrors" id="error3" value="Error al visualizar productos" onChange={handleCheckboxChange} />
                            <label className="form-check-label" htmlFor="error3">
                                Error al visualizar productos
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="CommonErrors" id="error4" value="Otro" onChange={handleCheckboxChange} />
                            <label className="form-check-label" htmlFor="error4">
                                Otro
                            </label>
                        </div>
                    </div>
                </div>

                {/* Descripción del Problema */}
                <div className="row">
                    <div className="input-field col-8 offset-2">
                        <label htmlFor="Problema">Describa su problema:</label>
                        <textarea className="form-control form-control-lg" name="Problema" id="Problema" rows="5" value={formData.Problema} onChange={handleChange} required />
                    </div>
                </div>

                {/* Botón de Enviar */}
                <div className="row">
                    <div className="input-field col-5 offset-5">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={formData.CommonErrors.length === 0}>Enviar</button>
                    </div>
                </div>
            </form>
            <Footer />

            <div className={`modal fade ${showSuccessModal ? 'show' : ''}`} id="successModal" tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true" style={showSuccessModal ? { display: 'block' } : {}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="successModalLabel">Éxito</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="modal-body">
                            <p>Su mensaje ha sido enviado correctamente. Hemos enviado su ticket al equipo de soporte.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default Soporte;