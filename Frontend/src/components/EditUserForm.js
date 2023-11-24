// EditUserForm.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

function EditUserForm() {
    const { usuario } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        NombreUsuario: '',
        Apellido: '',
        Email: '',
        Contraseña: '',
        Documento_Numero: '',
        Celular_Numero: '',
        Direccion: '',
        Comuna: ''
    });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');
    const [error, setError] = useState(null);
    const homePath = '/pagina-usuario';

    useEffect(() => {
        if (usuario && usuario.userId) {
            axios.get(`http://localhost:5000/api/Users/${usuario.userId}`)
                .then(response => {
                    setUserData(response.data);
                })
                .catch(error => {
                    console.error(error);
                    // Manejar error
                });
        }
    }, [usuario]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (usuario && usuario.userId) {

            // Actualiza la información del usuario
            try {
                await axios.put(`http://localhost:5000/api/EditUsers/${usuario.userId}`, userData);
                alert('Información actualizada exitosamente');
            } catch (error) {
                console.error('Error al actualizar la información:', error);
                setError('Error al actualizar la información');
            }

            // Cambia la contraseña si es necesario
            if (newPassword && newPassword === repeatNewPassword) {
                try {
                    await axios.put(`http://localhost:5000/api/cambiar-contrasena/${usuario.userId}`, {
                        nuevaContraseña: newPassword
                    });
                    alert('Contraseña actualizada exitosamente');
                } catch (error) {
                    console.error('Error al cambiar la contraseña:', error);
                    setError('Error al actualizar la contraseña');
                }
            } else if (newPassword && newPassword !== repeatNewPassword) {
                alert('Las contraseñas no coinciden.');
            }
        };
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Editar Usuario</h3>
                <Link to={homePath} className="btn btn-outline-secondary">
                    <FontAwesomeIcon icon={faHome} /> Inicio
                </Link>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="card card-body bg-light">
                <div className="mb-3">
                    <label htmlFor="NombreUsuario" className="form-label">Nombre de Usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        id="NombreUsuario"
                        name="NombreUsuario"
                        value={userData.NombreUsuario}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Apellido" className="form-label">Apellido</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Apellido"
                        name="Apellido"
                        value={userData.Apellido}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Email" className="form-label">Correo electrónico</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Email"
                        name="Email"
                        value={userData.Email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Apellido" className="form-label">RÚN</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Documento_Numero"
                        name="Documento_Numero"
                        value={userData.Documento_Numero}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Apellido" className="form-label">Teléfono Celular</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Celular_Numero"
                        name="Celular_Numero"
                        value={userData.Celular_Numero}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Apellido" className="form-label">Direccion</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Direccion"
                        name="Direccion"
                        value={userData.Direccion}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Comuna" className="form-label">Comuna</label>
                    <select
                        className="form-control"
                        id="Comuna"
                        name="Comuna"
                        value={userData.Comuna}
                        onChange={handleInputChange}
                    >
                        <option value="">-- Selecciona una Comuna --</option>
                        <option value="Cerrillos">Cerrillos</option>
                        <option value="Cerro Navia">Cerro Navia</option>
                        <option value="Conchali">Conchali</option>
                        <option value="El Bosque">El Bosque</option>
                        <option value="Estación Central">Estación Central</option>
                        <option value="Huechuraba">Huechuraba</option>
                        <option value="Independencia">Independencia</option>
                        <option value="La Cisterna">La Cisterna</option>
                        <option value="La Florida">La Florida</option>
                        <option value="La Granja">La Granja</option>
                        <option value="La Pintana">La Pintana</option>
                        <option value="La Reina">La Reina</option>
                        <option value="Las Condes">Las Condes</option>
                        <option value="Lo Barnechea">Lo Barnechea</option>
                        <option value="Lo Espejo">Lo Espejo</option>
                        <option value="Lo Prado">Lo Prado</option>
                        <option value="Macul">Macul</option>
                        <option value="Maipu">Maipu</option>
                        <option value="Ñuñoa">Ñuñoa</option>
                        <option value="Pedro Aguirre Cerda">Pedro Aguirre Cerda</option>
                        <option value="Peñalolen">Peñalolen</option>
                        <option value="Providencia">Providencia</option>
                        <option value="Pudahuel">Pudahuel</option>
                        <option value="Quilicura">Quilicura</option>
                        <option value="Quinta Normal">Quinta Normal</option>
                        <option value="Recoleta">Recoleta</option>
                        <option value="Renca">Renca</option>
                        <option value="San Joaquin">San Joaquín</option>
                        <option value="San Miguel">San Miguel</option>
                        <option value="San Ramón">San Ramón</option>
                        <option value="Santiago">Santiago</option>
                        <option value="Vitacura">Vitacura</option>
                    </select>
                </div>

                {/* Repite la estructura de .mb-3 para los otros campos del formulario */}

                {/* Sección de cambio de contraseña */}
                <h5 className="mt-4 mb-3">Cambiar Contraseña</h5>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="repeatNewPassword" className="form-label">Repetir Nueva Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="repeatNewPassword"
                        name="repeatNewPassword"
                        value={repeatNewPassword}
                        onChange={(e) => setRepeatNewPassword(e.target.value)}
                    />
                </div>
                <div className="text-end">
                    <button type="submit" className="btn btn-primary">Guardar cambios</button>
                </div>
            </form >
        </div >
    );
}

export default EditUserForm;