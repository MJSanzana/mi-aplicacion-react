// EditUserForm.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

function EditUserForm() {
    const { user } = useContext(AuthContext);
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

    useEffect(() => {
        if (user && user.userId) {
            axios.get(`http://localhost:5000/api/Users/${user.userId}`)
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error(error);
                // Manejar error
            });
    }
}, [user]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Actualiza la información del usuario
        try {
            await axios.put(`http://localhost:5000/api/EditUsers/${userId}`, userData);
            alert('Información actualizada exitosamente');
        } catch (error) {
            console.error('Error al actualizar la información:', error);
            setError('Error al actualizar la información');
        }

        // Cambia la contraseña si es necesario
        if (newPassword && newPassword === repeatNewPassword) {
            try {
                await axios.put(`http://localhost:5000/api/usuarios/cambiar-contraseña/${userId}`, {
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

    return (
        <div className="container mt-5">
            <h3 className="mb-3">Editar Usuario</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                {/* Asegúrate de que los atributos 'onChange' de los inputs llamen a 'handleInputChange' */}
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
                {/* Agrega aquí los otros campos como Apellido, Email, etc., con el mismo patrón que el campo NombreUsuario */}
                
                {/* Campos adicionales para el cambio de contraseña */}
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
                <button type="submit" className="btn btn-primary">Guardar cambios</button>
            </form>
        </div>
    );
}

export default EditUserForm;