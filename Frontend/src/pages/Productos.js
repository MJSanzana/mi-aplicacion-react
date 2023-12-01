import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, FormControl, InputGroup, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// Otras importaciones aquí...
const getImageUrl = (imageName) => {
  return `http://localhost:5000/${imageName}`;

};

function Productos({ changeView, setProductoSeleccionado }) {

  const [productos, setProductos] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productoActivo, setProductoActivo] = useState({});
  const [filtro, setFiltro] = useState('');
  const [variantes, setVariantes] = useState([]);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const [cantidadAComprar, setCantidadAComprar] = useState(1);
  const [stockDisponible, setStockDisponible] = useState(0);

  const mostrarDetallesProducto = (idProducto) => {
    console.log("Seleccionado producto ID:", idProducto); // Esto debería mostrar el ID correcto del producto clickeado
    setProductoSeleccionado(idProducto);
    changeView('DetallesProducto');
  };


  // Función para manejar agregar productos al carrito
  const onAddToCart = (productToAdd) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingProductIndex = cartItems.findIndex(item => item.Id === productToAdd.Id && item.talla === productToAdd.talla);

    if (existingProductIndex > -1) {
      // Producto ya existe en el carrito, actualizar la cantidad
      const updatedItems = cartItems.map((item, index) => {
        if (index === existingProductIndex) {
          return { ...item, cantidad: item.cantidad + productToAdd.cantidad };
        }
        return item;
      });

      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    } else {
      // Producto no existe en el carrito, agregar nuevo
      localStorage.setItem('cartItems', JSON.stringify([...cartItems, productToAdd]));
    }
  };

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
  // Cuando se hace clic en la imagen del producto, cambia a la vista de detalles del producto
  const navegarADetallesProducto = (productoId) => {
    console.log("Navegando a DetallesProducto con ID:", productoId);
    setProductoSeleccionado(productoId); // Establece el ID del producto seleccionado
    changeView('DetallesProducto'); // Cambia la vista a DetallesProducto
  };

  // Cuando se hace clic en el botón, muestra los detalles en el modal
  const mostrarDetallesEnModal = (producto) => {
    console.log("Mostrando detalles en modal para el producto ID:", producto.Id);
    setProductoActivo(producto); // Establece el producto activo para el modal
    handleShowDetails(producto); // Muestra el modal con los detalles
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
    axios.get(`http://localhost:5000/api/obtenerVariantesPorProductoId/${producto.Id}`)
      .then(response => {
        setVariantes(response.data.length > 0 ? response.data : 'sin stock');
      })
      .catch(err => {
        console.error("Error al cargar las variantes:", err);
        setVariantes('sin stock');
      });
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
                <Card.Img
                  variant="top"
                  src={getImageUrl(producto.Imagen)}
                  className="img-cuadrada"
                  alt={`Imagen de ${producto.Nombre}`}
                  onClick={() => navegarADetallesProducto(producto.Id)} // Se llama al hacer clic en la imagen
                />
                <Card.Body>
                  <Card.Title>{producto.Nombre}</Card.Title>
                  <Card.Text>Precio: ${producto.Precio.toLocaleString()}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation(); // Previene que el evento clic en la imagen se dispare también
                      mostrarDetallesEnModal(producto); // Se llama al hacer clic en el botón
                    }}>
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
        variantes={variantes}
        tallaSeleccionada={tallaSeleccionada}
        setTallaSeleccionada={setTallaSeleccionada}
        stockDisponible={stockDisponible}
        setStockDisponible={setStockDisponible}
        cantidadAComprar={cantidadAComprar}
        setCantidadAComprar={setCantidadAComprar}
        onAddToCart={onAddToCart}
      />
    </>
  );
}
const ProductoModal = ({
  show, onHide, producto, changeView, variantes, tallaSeleccionada, setTallaSeleccionada,
  stockDisponible, setStockDisponible, cantidadAComprar, setCantidadAComprar, onAddToCart
}) => {
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

  const incrementarCantidadAComprar = () => {
    if (cantidadAComprar < stockDisponible) {
      setCantidadAComprar(cantidadAComprar + 1);
    }
  };
  const decrementarCantidadAComprar = () => {
    if (cantidadAComprar > 1) {
      setCantidadAComprar(cantidadAComprar - 1);
    }
  };

  const agregarAlCarrito = () => {
    if (producto && tallaSeleccionada && cantidadAComprar > 0) {
      // Aquí usas la función onAddToCart pasada como prop
      onAddToCart({ ...producto, cantidad: cantidadAComprar, talla: tallaSeleccionada });
      onHide();
    } else {
      alert('Por favor, selecciona una talla y asegúrate de que la cantidad sea mayor que 0.');
    }
  };

  const handleTallaChange = (talla) => {
    setTallaSeleccionada(talla);
    const variante = variantes.find(v => v.Talla === talla);
    setStockDisponible(variante ? variante.Cantidad : 0);
    setCantidadAComprar(1); // Reiniciar la cantidad a comprar al cambiar de talla
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
            <div>
              <label htmlFor="tallaSelect">Talla:</label>
              <select
                className="form-control"
                id="tallaSelect"
                value={tallaSeleccionada}
                onChange={(e) => handleTallaChange(e.target.value)}
                required
              >
                <option value="" disabled>Seleccione una talla</option>
                {variantes.map((variante, index) => (
                  <option key={index} value={variante.Talla}>
                    {variante.Talla}
                  </option>
                ))}
              </select>
              <p>Cantidad disponible: {stockDisponible}</p>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <Button onClick={decrementarCantidadAComprar} disabled={cantidadAComprar <= 1}>-</Button>
              <span className="mx-2">{cantidadAComprar}</span>
              <Button onClick={incrementarCantidadAComprar} disabled={cantidadAComprar >= stockDisponible}>+</Button>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={agregarAlCarrito}>
          Agregar al Carrito
        </Button>
        <Button variant="secondary" onClick={navigateToCart}>
          Ir al Carro
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Productos;