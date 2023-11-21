import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getImageUrl = (imageName) => {
  return `http://localhost:5000/${imageName}`;
};
const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerProductos = async () => {
      // Asegúrate de que hay un ID de usuario y un token antes de hacer la solicitud
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        setError('No se ha iniciado sesión o falta la información del usuario.');
        return; // Salir temprano si no hay userId o token
      }

      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const response = await axios.get(`http://localhost:5000/api/ObtenerProductos/${userId}`, { headers });

        // Asegúrate de que la estructura de datos es correcta
        if (response.data && Array.isArray(response.data)) {
          setProductos(response.data);
        } else {
          throw new Error("Formato de respuesta inesperado");
        }
      } catch (err) {
        setError('Error al obtener los productos: ' + err.message);
        console.error(err);
      }
    };

    obtenerProductos();
  }, []); 

  const actualizarVariantes = async (productoId, variantes) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const body = {
        producto_id: productoId,
        variantes
      };

      await axios.put('http://localhost:5000/api/actualizarVariante', body, { headers });
      // Aquí puedes actualizar el estado de tus productos si es necesario
    } catch (err) {
      setError('Error al actualizar variantes');
      console.error(err);
    }
  };

  // Renderiza los productos y un formulario para actualizar las cantidades
  return (
    <div style={{ margin: '20px' }}>
      <h1 style={{ marginBottom: '15px' }}>Productos del Usuario</h1>
      {error && <p className="text-danger" style={{ margin: '10px 0' }}>{error}</p>}
      <div>
        {productos.map((producto) => (
          <div key={producto.Id} style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px' }}>
            <h3>{producto.Nombre}</h3>
            <p>{producto.Descripcion}</p>
            <p>Género: {producto.Genero}</p>
            <p>Precio: ${producto.Precio}</p>
            <img src={`http://localhost:5000/${producto.Imagen}`} alt={producto.Nombre} style={{ maxWidth: '5%', margin: '10px 30px' }} />
          <form onSubmit={(e) => {
            e.preventDefault();
            // Lógica para recoger los valores de los inputs y llamar a actualizarVariantes
          }}>
            {producto.variantes && producto.variantes.map((variante, index) => (
              <div key={index}>
                <label>Talla {variante.talla}:</label>
                <input type="number" defaultValue={variante.cantidad} />
              </div>
            ))}
            <button type="submit">Actualizar Cantidades</button>
          </form>
        </div>
      ))}
    </div>
    </div>
  );
};

export default GestionProductos;