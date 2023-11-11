import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function MiCuenta() {
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Email: '',
    Direccion: '',
    Telefono: '',
    Comuna: '',
  });

  const [setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchUserData = async () => {
    try {
      // Obtener el token JWT del localStorage (o sessionStorage)
      const token = localStorage.getItem('authToken');

      // Si no hay token, probablemente el usuario no ha iniciado sesión o el token ha expirado
      if (!token) {
        console.error('No hay token disponible. El usuario debe iniciar sesión.');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/Usuarios/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setFormData(response.data);
      } else {
        console.error('No se encontró ningún usuario.');
      }
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error, error.response);
      setError('Error al obtener la información del usuario');
      if (error.response && error.response.data && error.response.data.message) {
        console.error('Mensaje del servidor:', error.response.data.message);
      } else {
        console.error('Error desconocido al obtener la información del usuario');
      }
    }
  };


  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obtener el token JWT del localStorage (o sessionStorage)
      const token = localStorage.getItem('authToken');

      // Si no hay token, probablemente el usuario no ha iniciado sesión o el token ha expirado
      if (!token) {
        console.error('No hay token disponible. El usuario debe iniciar sesión.');
        alert('Por favor, inicia sesión de nuevo.');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.put('http://localhost:5000/api/usuarios/update', formData, config);

      alert('Información actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la información:', error);
      let errorMessage = 'Error al actualizar';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage += ': ' + error.response.data.message;
      } else {
        errorMessage += ', no se pudo conectar con el servidor.';
      }
      alert(errorMessage);
    }
  };


  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== repeatNewPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No hay token disponible. El usuario debe iniciar sesión.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/usuarios/cambio-contrasena', {
        email: formData.Email,
        currentPassword,
        newPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        alert('Contraseña actualizada exitosamente');
        setChangePassword(false);
      } else {
        alert('Error al actualizar la contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      let errorMessage = 'Error al actualizar la contraseña';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage += ': ' + error.response.data.message;
      } else {
        errorMessage += ', no se pudo conectar con el servidor.';
      }
      alert(errorMessage);
    }
  };
  return (
    <div className="container mt-5">
      <h3 className="mb-3">Mi Cuenta</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="Nombre" className="form-label">Nombre</label>
          <input type="text" className="form-control" id="Nombre" name="Nombre" value={formData.Nombre} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="Apellido" className="form-label">Apellido</label>
          <input type="text" className="form-control" id="Apellido" name="Apellido" value={formData.Apellido} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="Email" className="form-label">Email</label>
          <input type="email" className="form-control" id="Email" name="Email" value={formData.Email} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="Direccion" className="form-label">Dirección</label>
          <input type="text" className="form-control" id="Direccion" name="Direccion" value={formData.Direccion} onChange={handleInputChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="Comuna" className="form-label">Comuna</label>
          <select className="form-control" id="Comuna" name="Comuna" value={formData.Comuna} onChange={handleInputChange} required>
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
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input type="tel" className="form-control" id="Telefono" name="Telefono" value={formData.Telefono} onChange={handleInputChange} required />
        </div>

        <button type="submit" className="btn btn-primary">Guardar cambios</button>
      </form>
      <div className="container mt-5">
        <h3 className="mb-3">Cambiar Contraseña</h3>
        <form onSubmit={handlePasswordChange}>
          {/* Campo oculto de Email */}
          <input type="hidden" name="Email" value={formData.Email} />

          <div className="form-group">
            <label htmlFor="currentPassword">Contraseña Actual</label>
            <input type="password" id="currentPassword" className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <input type="password" id="newPassword" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label htmlFor="repeatNewPassword">Repetir Nueva Contraseña</label>
            <input type="password" id="repeatNewPassword" className="form-control" value={repeatNewPassword} onChange={(e) => setRepeatNewPassword(e.target.value)} autoComplete="new-password" />
          </div>

          <button type="submit" className="btn btn-primary">Cambiar Contraseña</button>
        </form>
      </div>

      <Footer /> {/* Se añade el Footer aquí */}
    </div>
  );
}
export default MiCuenta;










