import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  // Supongamos que este es tu ID de usuario y token almacenados en algún lugar
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const response = await axios.get(`http://localhost:5000/api/ObtenerProductos/${userId}`, { headers });
        setProductos(response.data.productos);
      } catch (err) {
        setError('Error al obtener los productos');
        console.error(err);
      }
    };

    obtenerProductos();
  }, [userId, token]);

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

      await axios.post('http://localhost:5000/api/productosvariantes', body, { headers });
      // Aquí puedes actualizar el estado de tus productos si es necesario
    } catch (err) {
      setError('Error al actualizar variantes');
      console.error(err);
    }
  };

  // Renderiza los productos y un formulario para actualizar las cantidades
  return (
    <div>
      <h1>Productos del Usuario</h1>
      {error && <p className="text-danger">{error}</p>}
      {productos.map((producto) => (
        <div key={producto.id}>
          <h2>{producto.nombre}</h2>
          {/* Resto de la información del producto */}
          {/* Un formulario por producto para actualizar las variantes */}
          <form onSubmit={(e) => {
            e.preventDefault();
            // Aquí recogerías los valores de los inputs para cada talla y llamarías a actualizarVariantes
          }}>
            {/* Genera un input por cada talla disponible */}
            {producto.variantes.map(variante => (
              <div key={variante.Talla}>
                <label>Talla {variante.Talla}:</label>
                <input type="number" defaultValue={variante.Cantidad} /* Aquí vinculas el input con el estado o form */ />
              </div>
            ))}
            <button type="submit">Actualizar Cantidades</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default GestionProductos;
