import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, FormControl, InputGroup, Image } from 'react-bootstrap';
// Otras importaciones aquí...
const getImageUrl = (imageName) => {
  return `http://localhost:5000/${imageName}`;
};

function Productos({changeView}) {

  const [productos, setProductos] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productoActivo, setProductoActivo] = useState({});
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    axios.get('http://localhost:5000/api/ObtenerProductos/')
      .then(response => {
        const productosAprobados = response.data.filter(producto => producto.Aprobado === 1);
        setProductos(productosAprobados);
      })
      .catch(err => {
        console.error("Error al cargar los productos:", err);
      });
  };

  // Esta función ahora maneja tanto agregar al carrito como mostrar detalles
  const agregarYMostrarDetalles = (producto) => {
    const carritoActualizado = actualizarCarrito(producto);
    localStorage.setItem('cartItems', JSON.stringify(carritoActualizado));
    handleShowDetails(producto);
  };

  // Función para actualizar el carrito
  const actualizarCarrito = (producto) => {
    const carrito = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existe = carrito.find(item => item.Id === producto.Id);
    if (existe) {
      return carrito.map(item =>
        item.Id === producto.Id ? { ...existe, cantidad: existe.cantidad + 1 } : item
      );
    } else {
      return [...carrito, { ...producto, cantidad: 1 }];
    }
  };

  // Función para mostrar los detalles del producto
  const handleShowDetails = (producto) => {
    setProductoActivo(producto);
    setModalShow(true);
  };

  // Filtro para los productos basado en la entrada del usuario
  const productosFiltrados = productos.filter(producto =>
    producto.Nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <div className="container mt-5">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar producto..."
            onChange={(e) => setFiltro(e.target.value)}
          />
        </InputGroup>
        <h2>Productos Disponibles</h2>
        <div className="row">
          {productosFiltrados.map((producto) => (
            <div key={producto.Id} className="col-md-3 mb-3">
              <Card>
                <Card.Img variant="top" src={getImageUrl(producto.Imagen)} className="img-cuadrada" alt={`Imagen de ${producto.Nombre}`} />
                <Card.Body>
                  <Card.Title>{producto.Nombre}</Card.Title>
                  <Card.Text>Precio: ${producto.Precio.toLocaleString()}</Card.Text>
                  <Button variant="primary" onClick={() => agregarYMostrarDetalles(producto)}>
                    Agregar al Carrito
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <ProductoModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        producto={productoActivo}
        changeView={changeView}
      />
    </>
  );
}

const ProductoModal = ({ show, onHide, producto, changeView }) => {
  const [cantidad, setCantidad] = useState(1);
  const navigateToCart = () => {
    onHide();
    changeView('ShoppingCart'); // Cambia la vista usando changeView
  };


  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem('cartItems')) || [];
    const productoEnCarrito = carrito.find(item => item.Id === producto.Id);
    setCantidad(productoEnCarrito ? productoEnCarrito.cantidad : 1);
  }, [show, producto.Id]);



  const actualizarCarrito = (delta) => {
    const carrito = JSON.parse(localStorage.getItem('cartItems')) || [];
    const index = carrito.findIndex((item) => item.Id === producto.Id);
    let nuevaCantidad = cantidad + delta;

    if (index !== -1) {
      if (nuevaCantidad > 0) {
        carrito[index].cantidad = nuevaCantidad;
      } else {
        carrito.splice(index, 1);
      }
    } else if (nuevaCantidad > 0) {
      carrito.push({ ...producto, cantidad: nuevaCantidad });
    }

    localStorage.setItem('cartItems', JSON.stringify(carrito));
    setCantidad(nuevaCantidad > 0 ? nuevaCantidad : 1);
  };

  const incrementarCantidad = () => {
    actualizarCarrito(1);
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      actualizarCarrito(-1);
    }
  };

  const agregarAlCarrito = () => {
    if (producto) {
      onAddToCart({ ...producto, cantidad });
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {producto?.Nombre || 'Cargando...'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {producto && (
          <>
            <Image src={getImageUrl(producto.Imagen)} alt={`Imagen de ${producto.Nombre}`} className="modal-image" fluid />
            <p>Precio: ${producto.Precio?.toLocaleString() || 'No disponible'}</p>
            <div className="d-flex align-items-center justify-content-center">
              <Button onClick={decrementarCantidad} disabled={cantidad <= 1}>-</Button>
              <span className="mx-2">{cantidad}</span>
              <Button onClick={incrementarCantidad} disabled={cantidad >= 20}>+</Button>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={navigateToCart}>
          Ir al Carro
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Productos;