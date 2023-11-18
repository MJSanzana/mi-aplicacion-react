// frontend/src/components/UserPage.js
import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

const productos = [
  { 
    id: 1, 
    nombre: 'Polera Escolar Niños', 
    precio: 15000, 
    imagen: 'imagenes/PoleraMC01.jpg' 
  },
  { 
    id: 2, 
    nombre: 'Polera Escolar Niñas', 
    precio: 15000, 
    imagen: 'url-de-tu-imagen-para-polera-niñas.jpg' 
  },
  // Agrega más productos según sea necesario
];

const UserPage = () => {
  const [carrito, setCarrito] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productoActivo, setProductoActivo] = useState({});

  const agregarAlCarrito = (producto) => {
    // Verificar si el producto ya está en el carrito
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      // Si ya existe, actualizamos la cantidad
      setCarrito(carrito.map((item) => 
        item.id === producto.id ? { ...existe, cantidad: existe.cantidad + 1 } : item
      ));
    } else {
      // Si no existe, lo agregamos al carrito con cantidad 1
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Función para calcular el total del carrito
  const calcularTotal = () => {
    return carrito.reduce((acum, item) => acum + item.precio * item.cantidad, 0);
  };

   // Función para manejar la visualización del modal
   const handleShowDetails = (producto) => {
    setProductoActivo(producto);
    setModalShow(true);
  };

  return (
    <>
      <div className="container mt-5">
        <h2>Productos Disponibles</h2>
        <div className="row">
          {productos.map((producto) => (
            <div key={producto.id} className="col-md-4 mb-3">
              <Card>
                <Card.Img variant="top" src={producto.imagen} alt={`Imagen de ${producto.nombre}`} />
                <Card.Body>
                  <Card.Title>{producto.nombre}</Card.Title>
                  <Card.Text>Precio: ${producto.precio.toLocaleString()}</Card.Text>
                  <Button variant="primary" onClick={() => agregarAlCarrito(producto)}>
                    Agregar al Carrito
                  </Button>
                  <Button variant="secondary" onClick={() => handleShowDetails(producto)} className="mt-2">
                    Ver Detalles
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
        {carrito.length > 0 && (
          <div className="mt-5">
            <h3>Carrito de Compras</h3>
            <ul>
              {carrito.map((item, index) => (
                <li key={index}>
                  {item.nombre} - ${item.precio.toLocaleString()} x {item.cantidad}
                </li>
              ))}
            </ul>
            <h4>Total: ${calcularTotal().toLocaleString()}</h4>
          </div>
        )}
      </div>
      <ProductoModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        producto={productoActivo}
      />
    </>
  );
};

// Componente Modal para mostrar los detalles del producto
const ProductoModal = (props) => {
  const precio = props.producto && props.producto.precio ? props.producto.precio.toLocaleString() : 'No disponible';
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Detalles del Producto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{props.producto ? props.producto.nombre : 'Cargando...'}</h4>
        {props.producto && <img src={props.producto.imagen} alt={`Imagen de ${props.producto.nombre}`} className="img-fluid" />}
        <p>Precio: ${precio}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default UserPage;


