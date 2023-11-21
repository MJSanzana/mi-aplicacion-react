import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getImageUrl = (imageName) => {
  return `http://localhost:5000/${imageName}`;
};

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [variantesModificadas, setVariantesModificadas] = useState({});
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');
  const token = localStorage.getItem('token'); // Mueve el token aquí para usarlo en múltiples funciones

  useEffect(() => {
    const obtenerVariantesPorProducto = async (productoId) => {
      try {
        const variantesResponse = await axios.get(`http://localhost:5000/api/obtenerVariantesPorProductoId/${productoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return variantesResponse.data;
      } catch (err) {
        setError('Error al obtener las variantes: ' + err.message);
        console.error(err);
        return [];
      }
    };

    const obtenerProductos = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId || !token) {
        setError('No se ha iniciado sesión o falta la información del usuario.');
        return;
      }

      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const productosResponse = await axios.get(`http://localhost:5000/api/ObtenerProductos/${userId}`, { headers });
        if (productosResponse.data && Array.isArray(productosResponse.data)) {
          const productosConVariantes = await Promise.all(productosResponse.data.map(async (producto) => {
            const variantes = await obtenerVariantesPorProducto(producto.Id);
            return { ...producto, variantes };
          }));
          setProductos(productosConVariantes);
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
  const handleCantidadChange = (productoId, talla, nuevaCantidad) => {
    setVariantesModificadas(prevState => ({
      ...prevState,
      [`${productoId}-${talla}`]: nuevaCantidad
    }));
  };
  const actualizarVariantes = async (e, productoId) => {
    e.preventDefault();
    setUpdateSuccess('');
    setUpdateError('');

    const variantesParaActualizar = Object.entries(variantesModificadas)
      .filter(([key]) => key.startsWith(`${productoId}-`))
      .map(([key, cantidad]) => {
        const talla = key.split('-')[1];
        return { producto_id: productoId, talla, cantidad };
      });

    try {
      for (const variante of variantesParaActualizar) {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const response = await axios.put('http://localhost:5000/api/actualizarVariante', variante, { headers });
        if (response.status === 200) {
          // Aquí podrías actualizar el estado de tus productos si es necesario
          console.log('Variante actualizada con éxito');
          setUpdateSuccess(`Variante Cantidad con talla ${variante.talla} actualizada correctamente.`);
        }
      }
      // Limpia el estado de variantesModificadas y refresca los productos
      setVariantesModificadas({});
      await obtenerProductos();
    } catch (err) {
      // Configura un mensaje de error si algo sale mal
      setUpdateError('Error al actualizar variantes: ' + (err.response?.data?.message || err.message));
    }
  };
  // Renderiza los productos y un formulario para actualizar las cantidades
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Productos del Usuario</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {updateError && <div className="alert alert-danger" role="alert">{updateError}</div>}
      {updateSuccess && <div className="alert alert-success" role="alert">{updateSuccess}</div>}
      {productos.map((producto) => (
        <div key={producto.Id} className="card mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-2 mb-3">
                <img src={`http://localhost:5000/${producto.Imagen}`} alt={producto.Nombre} className="img-fluid" />
              </div>
              <div className="col-lg-3">
                <h4 className="card-title">{producto.Nombre}</h4>
                <p className="card-text">{producto.Descripcion}</p>
                <p className="card-text">Género: {producto.Genero}</p>
                <p className="card-text">Precio: ${producto.Precio}</p>
                <form onSubmit={(e) => actualizarVariantes(e, producto.Id)}>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Talla</th>
                          <th scope="col">Cantidad Actual</th>
                          <th scope="col">Actualizar Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {producto.variantes.map((variante, index) => (
                          <tr key={index}>
                            <td>{variante.Talla}</td>
                            <td>{variante.Cantidad}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                defaultValue={variante.Cantidad}
                                onChange={(e) => handleCantidadChange(producto.Id, variante.Talla, e.target.value)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="submit" className="btn btn-primary">Actualizar Cantidades</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GestionProductos;