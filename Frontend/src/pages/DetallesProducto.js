// DetallesProducto.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../components/AuthContext';

const getImageUrl = (imageName) => `http://localhost:5000/${imageName}`;

const DetallesProducto = ({ productoId }) => {
  const [producto, setProducto] = useState(null);
  const [reseñas, setReseñas] = useState([]);
  const [comentario, setComentario] = useState('');
  const [valoracion, setValoracion] = useState(0);
  const [variantes, setVariantes] = useState([]);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const [cantidadAComprar, setCantidadAComprar] = useState(1);
  const [stockDisponible, setStockDisponible] = useState(0);
  const { usuario } = useContext(AuthContext);
  const estrellas = [1, 2, 3, 4, 5];

  const handleAddToCart = () => {
    if (producto && tallaSeleccionada && cantidadAComprar > 0) {
      const productoParaCarrito = {
        ...producto,
        cantidad: cantidadAComprar,
        talla: tallaSeleccionada
      };
      console.log('Producto añadido al carrito', productoParaCarrito);
      // Aquí agregarías el producto al carrito
    } else {
      alert('Por favor, selecciona una talla y asegúrate de que la cantidad sea mayor que 0.');
    }
  };

  useEffect(() => {
    if (!productoId) {
      console.error('No se proporcionó ID de producto');
      return;
    }
  
    const fetchData = async () => {
      try {
        const resProducto = await axios.get(`http://localhost:5000/api/ObtenerProductoPorId/${productoId}`);
        if (resProducto.data && resProducto.data.Imagen) {
          setProducto({
            ...resProducto.data,
            imageUrl: getImageUrl(resProducto.data.Imagen)
          });
        }
  
        const resReseñas = await axios.get(`http://localhost:5000/api/resenas/${productoId}`);
        setReseñas(resReseñas.data);
      } catch (error) {
        console.error('Error al cargar el producto o las reseñas:', error);
      }
    };
  
    fetchData();
  }, [productoId]);
  
  useEffect(() => {
    const fetchVariantes = async () => {
      try {
        const resVariantes = await axios.get(`http://localhost:5000/api/obtenerVariantesPorProductoId/${productoId}`);
        if (resVariantes.data.length > 0) {
          setVariantes(resVariantes.data);
          setTallaSeleccionada(resVariantes.data[0].Talla);
          setStockDisponible(resVariantes.data[0].Cantidad);
        }
      } catch (error) {
        console.error('Error al cargar las variantes del producto:', error);
      }
    };
  
    if (productoId) {
      fetchVariantes();
    }
  }, [productoId]);
  

  // Funciones adicionales para manejar la interacción del usuario
  const manejarValoracion = (valor) => {
    setValoracion(valor);
  };

  const handleTallaChange = (event) => {
    const talla = event.target.value;
    setTallaSeleccionada(talla);
    const varianteSeleccionada = variantes.find(v => v.Talla === talla);
    setStockDisponible(varianteSeleccionada ? varianteSeleccionada.Cantidad : 0);
    setCantidadAComprar(1);
  };

  const incrementarCantidadAComprar = () => {
    setCantidadAComprar(prev => (prev < stockDisponible ? prev + 1 : prev));
  };

  const decrementarCantidadAComprar = () => {
    setCantidadAComprar(prev => (prev > 1 ? prev - 1 : prev));
  };


  const enviarComentario = () => {
    if (!usuario || !usuario.id) {
      alert("Solo los usuarios registrados o logueados pueden dejar comentarios.");
      return;
    }
    if (!comentario.trim()) {
      alert("Por favor, ingrese un comentario.");
      return;
    }
    if (valoracion < 1 || valoracion > 5) {
      alert("Por favor, ingrese una valoración válida.");
      return;
    }

    const comentarioData = {
      usuario_id: usuario.id,
      producto_id: producto.Id,
      valoracion,
      comentario
    };


    axios.post('http://localhost:5000/api/crearOpinionValoracion', comentarioData)
      .then(response => {
        alert("Comentario enviado con éxito.");
        setComentario('');
        setValoracion(0);
      })
      .catch(err => {
        console.error("Error al enviar el comentario:", err);
        alert("Hubo un error al enviar el comentario.");
      });
  };

  if (!producto) {
    return <div>Cargando detalles del producto...</div>;
  }


  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <Card>
            <Card.Img variant="top" src={producto.imageUrl} alt={`Imagen de ${producto.Nombre}`} />
          </Card>
        </div>
        <div className="col-md-6">
          <h2>{producto.Nombre}</h2>
          <p>{producto.Descripción}</p>
          <h3>${producto.Precio}</h3>
          <div>
            <label htmlFor="tallaSelect">Talla:</label>
            <select
              className="form-control"
              id="tallaSelect"
              value={tallaSeleccionada}
              onChange={handleTallaChange}
            >
              <option value="" disabled>Seleccione una talla</option>
              {variantes.map((variante, index) => (
                <option key={index} value={variante.Talla}>{variante.Talla}</option>
              ))}
            </select>
          </div>
          <p>Cantidad disponible: {stockDisponible}</p>
          <div className="d-flex align-items-center justify-content-center">
            <Button onClick={decrementarCantidadAComprar} disabled={cantidadAComprar <= 1}>-</Button>
            <span className="mx-2">{cantidadAComprar}</span>
            <Button onClick={incrementarCantidadAComprar} disabled={cantidadAComprar >= stockDisponible}>+</Button>
          </div>
          <Button variant="primary" onClick={handleAddToCart}>Añadir al Carrito</Button>
        </div>
      </div>

      {/* Sección de reseñas */}

      <h2 className="mb-3">Reseñas</h2>
      {reseñas.map(reseña => (
        <div key={reseña.id} className="mb-2">

        </div>
      ))}

      <Card className="mt-4 mb-4">
        <Card.Body>
          <h3>Dejar un Comentario</h3>
          <Form>
            <div className="mb-3">
              <Form.Label>Valoración</Form.Label>
              <div>
                {estrellas.map((num) => (
                  <span
                    key={num}
                    onClick={() => manejarValoracion(num)}
                    style={{ cursor: 'pointer', color: num <= valoracion ? 'orange' : 'grey' }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            {/* Resto de tu formulario */}
            <Form.Group className="mb-3">
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={enviarComentario}>Enviar Comentario</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );

};

export default DetallesProducto;