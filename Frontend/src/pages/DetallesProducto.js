import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

const DetallesProducto = () => {
  const { productId } = useParams();
  // Aquí podrías hacer una llamada a la API para obtener los detalles del producto usando el productId
  // Para este ejemplo, simplemente usaré datos ficticios

  const producto = {
    id: productId,
    nombre: 'Piscina Estructural 239 x 150 x 58 cm Bestway',
    precio: 64990,
    precioOriginal: 119990,
    descripcion: 'Una piscina resistente y amplia perfecta para el verano.',
    imagen: 'url-de-tu-imagen.jpg',
    // ... otros datos que podrías necesitar
  };

  // Asume que tienes una función para volver a la lista de productos
  const volverALista = () => {
    // Implementa tu lógica de navegación aquí
  };

  return (
    <div className="container mt-5">
      <Card>
        <Card.Img variant="top" src={producto.imagen} alt={`Imagen de ${producto.nombre}`} />
        <Card.Body>
          <Card.Title>{producto.nombre}</Card.Title>
          <Card.Text>
            Precio: ${producto.precio.toLocaleString()}
            <br />
            Precio original: <s>${producto.precioOriginal.toLocaleString()}</s>
          </Card.Text>
          <Button variant="primary" onClick={() => {/* Lógica para agregar al carrito */}}>
            Agregar al Carrito
          </Button>
          <Button variant="secondary" onClick={volverALista} className="mt-2">
            Volver a la lista
          </Button>
        </Card.Body>
      </Card>
      <div className="my-3">
        <h3>Descripción</h3>
        <p>{producto.descripcion}</p>
        {/* ... más detalles que quieras agregar */}
      </div>
    </div>
  );
};

export default DetallesProducto;
