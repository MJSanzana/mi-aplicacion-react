import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, FormControl, InputGroup, Image } from 'react-bootstrap';

const getImageUrl = (imageName) => {
  return `http://localhost:5000/${imageName}`;
};
const Productos = ({ changeView }) => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
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

  const agregarAlCarrito = (producto) => {
    let carritoActualizado = [];
    const existe = carrito.find(item => item.Id === producto.Id);
    if (existe) {
      carritoActualizado = carrito.map(item =>
        item.Id === producto.Id ? { ...existe, cantidad: existe.cantidad + 1 } : item
      );
    } else {
      carritoActualizado = [...carrito, { ...producto, cantidad: 1 }];
    }
    setCarrito(carritoActualizado);
    localStorage.setItem('cartItems', JSON.stringify(carritoActualizado)); 
  };
  

  const calcularTotal = () => {
    return carrito.reduce((acum, item) => acum + item.Precio * item.cantidad, 0);
  };

  const handleShowDetails = (producto) => {
    setProductoActivo(producto);
    setModalShow(true);
  };

  const handleAddToCart = (productoConCantidad) => {
    // Aquí recibimos el producto con su cantidad y lo agregamos al carrito
    const { Id, cantidad } = productoConCantidad;
    const productoExiste = carrito.find((item) => item.Id === Id);
    if (productoExiste) {
      // Actualizamos la cantidad del producto existente
      setCarrito(carrito.map((item) =>
        item.Id === Id ? { ...item, cantidad: item.cantidad + cantidad } : item
      ));
    } else {
      // Agregamos el nuevo producto al carrito
      setCarrito([...carrito, productoConCantidad]);
    }
  };

  const productosFiltrados = productos.filter(producto =>
    producto.Nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const getImageUrl = (imageName) => {
    return `http://localhost:5000/${imageName}`;
  };

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
          <div className="mt-3">
            <h3>Carrito de Compras</h3>
            <ul>
              {carrito.map((item, index) => (
                <li key={index}>
                  {item.Nombre} - ${item.Precio.toLocaleString()} x {item.cantidad}
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
        onAddToCart={handleAddToCart}
        changeView={changeView}
      />
    </>
  );
};

const ProductoModal = ({ show, onHide, producto, onAddToCart, changeView }) => {
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (show) {
      setCantidad(1);
    }
  }, [show]);

  const incrementarCantidad = () => {
    if (cantidad < 20) {
      setCantidad(cantidad + 1);
    }
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const agregarAlCarrito = () => {
    if (producto) {
      onAddToCart({ ...producto, cantidad });
      onHide();
    }
  };
  const navigateToCart = () => {
    onHide();
    changeView('ShoppingCart ');
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
        <Button variant="secondary" onClick={navigateToCart}>
          Ir a Carrito
        </Button>
        <Button onClick={agregarAlCarrito}>Agregar al Carrito</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Productos;