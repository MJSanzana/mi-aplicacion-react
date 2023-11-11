import React, { useState, useRef } from 'react';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Soporte = () => {
    const [Nombre, setNombre] = useState('');
    const [Email, setEmail] = useState('');
    const [Problema, setProblema] = useState('');
    const [CommonErrors, setCommonErrors] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const formRef = useRef();

    const validateEmail = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(Email)) {
            alert('Por favor, ingresa una dirección de email válida.');
            return false;
        }
        return true;
    }

    const handleCloseModal = () => {
        setShowSuccessModal(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail()) return;

        if (Nombre && Email && CommonErrors.length > 0 && Problema) {
            try {
                const response = await axios.post('http://localhost:5000/api/Tickets/Soporte', {
                    Nombre,
                    Email,
                    Problema,
                    CommonErrors
                });

                if (response.status === 200) {
                    setNombre('');
                    setEmail('');
                    setCommonErrors([]);
                    setProblema('');
                    setShowSuccessModal(true);
                    setTimeout(() => {
                        formRef.current.reset();
                    }, 1000);
                } else {
                    console.error("Error en el servidor:", response.status);
                }

            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                alert('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
            }
        } else {
            alert('Por favor, complete todos los campos del formulario.');
        }
    }

    const handleCheckboxChange = (e) => {
        if (e.target.checked) {
            setCommonErrors([...CommonErrors, e.target.value])
        } else {
            setCommonErrors(CommonErrors.filter(error => error !== e.target.value))
        }
    }
    return (

        <div className="d-flex flex-column min-vh-100">
            <div className="container my-5">
                <h1 className="mb-4">Contacto soporte</h1>
                <form onSubmit={handleSubmit} className="p-4 border rounded" ref={formRef}>
                    <div className="form-group mb-3">
                        <label htmlFor="Nombre">Nombre:</label>
                        <input type="text" className="form-control" name="Nombre" id="Nombre" value={Nombre} onChange={e => setNombre(e.target.value)} required />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="Email">Email:</label>
                        <input type="Email" className="form-control" name="Email" id="Email" value={Email} onChange={e => setEmail(e.target.value)} required />
                    </div>

                    <div className="form-group mb-3">
                        <label>Error:</label><br />
                        <input type="checkbox" value="Inicio de sesión fallido" name="CommonErrors[]" onChange={handleCheckboxChange} /> Inicio de sesión fallido<br />
                        <input type="checkbox" value="Problema al realizar un pedido" name="CommonErrors[]" onChange={handleCheckboxChange} /> Problema al realizar un pedido<br />
                        <input type="checkbox" value="Error al visualizar productos" name="CommonErrors[]" onChange={handleCheckboxChange} /> Error al visualizar productos<br />
                        <input type="checkbox" value="Otro" name="commonErrors[]" onChange={handleCheckboxChange} /> Otro<br />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="Problema">Describa su problema:</label>
                        <textarea className="form-control" name="Problema" id="Problema" rows="5" value={Problema} onChange={e => setProblema(e.target.value)} required></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={CommonErrors.length === 0}>Enviar</button>
                </form>
                <Footer />

                {/* Success Modal */}
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