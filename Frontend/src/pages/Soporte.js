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
        <div className="d-flex flex-column min-vh-100">
            <div className="container my-5">
                <h1 className="mb-4">Contacto soporte</h1>
                <form onSubmit={handleSubmit} className="p-4 border rounded" ref={formRef}>
                    <div className="form-group mb-3">
                        <label htmlFor="Nombre">Nombre:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="Nombre"
                            id="Nombre"
                            value={formData.Nombre}
                            onChange={handleChange} // Utilizando handleChange
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="Email">Email:</label>
                        <input
                            type="Email"
                            className="form-control"
                            name="Email"
                            id="Email"
                            value={formData.Email}
                            onChange={handleChange} // Utilizando handleChange
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Error:</label><br />
                        <input type="checkbox" value="Inicio de sesión fallido" name="CommonErrors" onChange={handleCheckboxChange} /> Inicio de sesión fallido<br />
                        <input type="checkbox" value="Problema al realizar un pedido" name="CommonErrors" onChange={handleCheckboxChange} /> Problema al realizar un pedido<br />
                        <input type="checkbox" value="Error al visualizar productos" name="CommonErrors" onChange={handleCheckboxChange} /> Error al visualizar productos<br />
                        <input type="checkbox" value="Otro" name="CommonErrors" onChange={handleCheckboxChange} /> Otro<br />
                    </div>


                    <div className="form-group mb-3">
                        <label htmlFor="Problema">Describa su problema:</label>
                        <textarea
                            className="form-control"
                            name="Problema"
                            id="Problema"
                            rows="5"
                            value={formData.Problema} // Usa formData.Problema aquí
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={formData.CommonErrors.length === 0}>Enviar</button>
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
        </div>
    );
};

export default Soporte;