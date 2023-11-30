//DetallesProducto.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../components/AuthContext'

const DetallesProducto = ({ productoId }) => {
  const [producto, setProducto] = useState({});
  const [imagenUrl, setImagenUrl] = useState('');
  const [reseñas, setReseñas] = useState([]);
  const [comentario, setComentario] = useState('');
  const [valoracion, setValoracion] = useState(0);

  const { usuario } = useContext(AuthContext);
  const getImageUrl = (imageName) => {
    return `http://localhost:5000/${imageName}`;
  };

  const estrellas = [1, 2, 3, 4, 5];

  const manejarValoracion = (valor) => {
    setValoracion(valor);
  };

  useEffect(() => {
    if (productoId) {
      axios.get(`http://localhost:5000/api/ObtenerProductoPorId/${productoId}`)
        .then(response => {
          const productoCargado = response.data;
          // Supongamos que la imagen viene en la propiedad 'Imagen' de la respuesta
          productoCargado.imagenUrl = getImageUrl(productoCargado.Imagen);
          setProducto(productoCargado);
        })
        .catch(err => console.error("Error al cargar los detalles del producto:", err));
      axios.get(`http://localhost:5000/api/reseñas/${Producto.id}`)
        .then(response => {
          setReseñas(response.data);
        })
        .catch(err => console.error("Error al cargar las reseñas del producto:", err));
    }
  }, [productoId]);

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
        // Aquí podrías recargar las reseñas si es necesario
      })
      .catch(err => {
        console.error("Error al enviar el comentario:", err);
        alert("Hubo un error al enviar el comentario.");
      });
  };


  return (
    <div className="container mt-5">
      <Card className="mb-4">
        {/* Usar imagenUrl para mostrar la imagen del producto */}
        <Card.Img variant="top" src={producto.imagenUrl} />
        <Card.Body>
          <Card.Title>{producto.Nombre}</Card.Title>
          <Card.Text>{producto.Descripción}</Card.Text>
          {/* Otros detalles del producto */}
        </Card.Body>
      </Card>

      <h2 className="mb-3">Reseñas</h2>
      {reseñas.map(reseña => (
        <div key={reseña.id} className="mb-2">
          {/* Aquí puedes mostrar el contenido de cada reseña */}
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