//shoppingCart.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Table, ListGroup, ListGroupItem, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';

const getImageUrl = (imageName) => {
    return `http://localhost:5000/${imageName}`;

};

function ShoppingCart() {
    const { usuario } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [direccionEnvio, setDireccionEnvio] = useState('');
    const [comuna, setComuna] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [errores, setErrores] = useState({});
    const [showShippingInfo, setShowShippingInfo] = useState(false);
    const fixedShippingCost = 3500;
    const [costoEnvio, setCostoEnvio] = useState(fixedShippingCost);
    const [totalConEnvio, setTotalConEnvio] = useState(0);

    const validarDatosEnvio = () => {
        const nuevosErrores = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar email
        const telefonoRegex = /^\d{9}$/; // Regex para validar un teléfono de 9 dígitos

        if (!direccionEnvio) nuevosErrores.direccionEnvio = 'La dirección de envío es obligatoria.';
        if (!comuna) nuevosErrores.comuna = 'La comuna es obligatoria.';
        if (!telefonoRegex.test(telefono)) nuevosErrores.telefono = 'El teléfono debe tener 9 dígitos.';
        if (!emailRegex.test(email)) nuevosErrores.email = 'El email no tiene un formato válido.';
        if (!nombre) nuevosErrores.nombre = 'El nombre es obligatorio.';

        setErrores(nuevosErrores);

        return Object.keys(nuevosErrores).length === 0;
    };


    useEffect(() => {
        if (usuario) {
            loadCartFromBackend();
        } else {
            loadCartFromLocalStorage();
        }
    }, [usuario]);

    const loadCartFromLocalStorage = () => {
        const storedCartItems = localStorage.getItem('cartItems');
        setItems(storedCartItems ? JSON.parse(storedCartItems) : []);
    };

    const loadCartFromBackend = async () => {
        try {
            const response = await axios.get('/api/cart', {
                headers: { Authorization: `Bearer ${usuario.token}` }
            });
            setItems(response.data);
        } catch (error) {
            console.error("Error al cargar el carrito desde el backend:", error);
        }
    };

    const formatPrice = (price) => `$${price.toLocaleString('es-CL')}`;
    const total = items.reduce((acc, item) => acc + (item.Precio * item.cantidad), 0);

    const clearCart = () => {
        localStorage.removeItem('cartItems');
        setItems([]);
        alert('El carrito se ha vaciado correctamente.');
    };

    const updateQuantity = (itemToUpdate, change) => {
        const newItems = items.map(item => {
            if (item.Nombre === itemToUpdate.Nombre && item.talla === itemToUpdate.talla) {
                const updatedQuantity = Math.max(1, item.cantidad + change);
                return { ...item, cantidad: updatedQuantity };
            }
            return item;
        });
        setItems(newItems);
        if (!usuario) {
            localStorage.setItem('cartItems', JSON.stringify(newItems));
        }
    };

    // Elimina un item específico del carrito
    const removeItem = (itemToRemove) => {
        const newItems = items.filter(item => !(item.Nombre === itemToRemove.Nombre && item.talla === itemToRemove.talla));
        setItems(newItems);
        if (!usuario) {
            localStorage.setItem('cartItems', JSON.stringify(newItems));
        }
    };

    const procesarPago = async () => {
        // Comprobar si hay productos en el carrito antes de procesar el pago
        if (items.length === 0) {
            alert('No hay productos en el carrito.');
            return; // Detiene la ejecución si el carrito está vacío
        }

        // Continuar con la validación de los datos de envío
        if (!validarDatosEnvio()) {
            return; // Detiene el proceso si la validación de los datos de envío falla
        }

        const total = items.reduce((acc, item) => acc + (item.Precio * item.cantidad), 0);
        const totalConEnvio = total + costoEnvio;
        const headers = usuario && usuario.token ? { Authorization: `Bearer ${usuario.token}` } : {};

        try {
            const pedidoData = {
                usuario_id: usuario ? usuario.id : null,
                total: totalConEnvio,
                metodo_pago: 'OnePay',
            };
            const pedidoRes = await axios.post('http://localhost:5000/api/pedidos', pedidoData, { headers });

            for (const item of items) {
                if (typeof item.productoVarianteId === 'undefined') {
                    alert(`El producto ${item.Nombre} no tiene un ID de variante definido.`);
                    return; // Detiene la ejecución si no hay ID de variante
                }
                const detallePedidoData = {
                    pedidoId: pedidoRes.data.pedidoId,
                    productoVarianteId: item.productoVarianteId,
                    cantidad: item.cantidad,
                    precio: item.Precio
                };
                await axios.post('http://localhost:5000/api/detallepedidos', detallePedidoData, { headers });
            }

            // Crear un pago simulado
            const pagoSimuladoData = {
                pedidoId: pedidoRes.data.pedidoId,
                monto: totalConEnvio,
                moneda: 'CLP',
                usuarioId: usuario ? usuario.id : null, // Si el usuario no está logueado, este valor será null
            };
            await axios.post('http://localhost:5000/api/crearPagoSimulado', pagoSimuladoData, { headers });

            // Si todo sale bien, mostrar un mensaje de éxito y limpiar el carrito
            alert('Pago realizado con éxito.');
            clearCart();
        } catch (error) {
            // Manejar los errores adecuadamente
            console.error('Error en el proceso de pago:', error);
            alert('Hubo un error al procesar el pago: ' + error.message);
        }
    };
    
    useEffect(() => {
        setTotalConEnvio(total + costoEnvio);
      }, [total, costoEnvio]);

    const renderProductImage = (imageName) => {
        // Si imageName no está definido o es una cadena vacía, devuelve una imagen de reserva o un mensaje
        if (!imageName) {
            return (
                <div className="text-center">
                    {/* Aquí puedes poner una imagen por defecto o un texto si no hay imagen */}
                    <img
                        src="ruta_a_tu_imagen_de_reserva.jpg" // Reemplazar con tu imagen de reserva
                        alt="Imagen de reserva"
                        className="img-thumbnail"
                        style={{ width: 'auto', height: '80px' }}
                    />
                </div>
            );
        } else {
            return (
                <img
                    src={getImageUrl(imageName)}
                    alt="Imagen del producto"
                    className="img-thumbnail"
                    style={{ width: 'auto', height: '80px' }}
                />
            );
        }
    };
    const toggleShippingInfo = () => {
        setShowShippingInfo(!showShippingInfo);
    };
    const handleContinue = () => {
        setShowShippingInfo(true);
    };

    return (
        <Container>
            <Row>
                <Col xs="12" lg="8">
                    <h2>Carrito de Compras</h2>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Nombre</th>
                                <th>Talla</th>
                                <th>Precio Unitario</th>
                                <th>Cantidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{renderProductImage(item.Imagen)}</td>
                                    <td>{item.Nombre}</td>
                                    <td>{item.talla}</td>
                                    <td>{formatPrice(item.Precio)}</td>
                                    <td>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Button onClick={() => updateQuantity(item, -1)} disabled={item.cantidad <= 1}>-</Button>
                                            {` ${item.cantidad} `}
                                            <Button onClick={() => updateQuantity(item, 1)}>+</Button>
                                        </div>
                                    </td>
                                    <td>
                                        <Button color="danger" onClick={() => removeItem(item)}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button
                        color="danger"
                        className="btn-block btn-lg"
                        style={{ maxWidth: '300px', margin: '0 auto' }}
                        onClick={clearCart} // Esto llama a la función clearCart cuando se hace clic en el botón
                    >
                        Vaciar Carrito
                    </Button>
                </Col>
                <Col xs="12" lg="4">
                    <ListGroup className="mb-3">
                        <ListGroupItem>
                            <h3>Resumen del Pedido</h3>
                            <Row>
                                <Col>Subtotal:</Col>
                                <Col>{formatPrice(total)}</Col>
                            </Row>
                            <Row>
                                <Col>Costo de envío:</Col>
                                <Col>{formatPrice(costoEnvio)}</Col>
                            </Row>
                            <Row>
                                <Col>Total:</Col>
                                <Col>{formatPrice(totalConEnvio)}</Col>
                            </Row>
                        </ListGroupItem>
                    </ListGroup>
                    {!showShippingInfo && (
                        <Button
                            color="primary"
                            className="btn-block mt-3"
                            onClick={handleContinue}
                        >
                            Continuar compra
                        </Button>
                    )}
                    {showShippingInfo && (
                        <>
                            <h3>Información de Envío</h3>
                            <Form>
                                {/* Formulario de datos de envío */}
                                <FormGroup>
                                    <Label>Dirección de Envío</Label>
                                    <Input
                                        type="text"
                                        value={direccionEnvio}
                                        onChange={(e) => setDireccionEnvio(e.target.value)}
                                        invalid={!!errores.direccionEnvio}
                                    />
                                    {errores.direccionEnvio && <Alert color="danger">{errores.direccionEnvio}</Alert>}
                                </FormGroup>
                                {/* Agregar nuevos campos */}
                                <FormGroup>
                                    <Label for="comunaSelect">Comuna</Label>
                                    <Input
                                        type="select"
                                        name="comuna"
                                        id="comunaSelect"
                                        value={comuna}
                                        onChange={(e) => setComuna(e.target.value)}
                                        invalid={!!errores.comuna}
                                    >
                                        <option value="">-- Selecciona una Comuna --</option>
                                        <option value="Cerrillos">Cerrillos</option>
                                        <option value="Cerro Navia">Cerro Navia</option>
                                        <option value="Conchali">Conchali</option>
                                        <option value="El Bosque">El Bosque</option>
                                        <option value="Estación Central">Estación Central</option>
                                        <option value="Huechuraba">Huechuraba</option>
                                        <option value="Independencia">Independencia</option>
                                        <option value="La Cisterna">La Cisterna</option>
                                        <option value="La Florida">La Florida</option>
                                        <option value="La Granja">La Granja</option>
                                        <option value="La Pintana">La Pintana</option>
                                        <option value="La Reina">La Reina</option>
                                        <option value="Las Condes">Las Condes</option>
                                        <option value="Lo Barnechea">Lo Barnechea</option>
                                        <option value="Lo Espejo">Lo Espejo</option>
                                        <option value="Lo Prado">Lo Prado</option>
                                        <option value="Macul">Macul</option>
                                        <option value="Maipu">Maipu</option>
                                        <option value="Ñuñoa">Ñuñoa</option>
                                        <option value="Pedro Aguirre Cerda">Pedro Aguirre Cerda</option>
                                        <option value="Peñalolen">Peñalolen</option>
                                        <option value="Providencia">Providencia</option>
                                        <option value="Pudahuel">Pudahuel</option>
                                        <option value="Quilicura">Quilicura</option>
                                        <option value="Quinta Normal">Quinta Normal</option>
                                        <option value="Recoleta">Recoleta</option>
                                        <option value="Renca">Renca</option>
                                        <option value="San Joaquin">San Joaquín</option>
                                        <option value="San Miguel">San Miguel</option>
                                        <option value="San Ramón">San Ramón</option>
                                        <option value="Santiago">Santiago</option>

                                        <option value="Vitacura">Vitacura</option>
                                    </Input>
                                    {errores.comuna && <div className="text-danger">{errores.comuna}</div>}
                                </FormGroup>
                                <FormGroup>
                                    <Label>Teléfono</Label>
                                    <Input
                                        type="tel"
                                        pattern="\d{9}"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        invalid={!!errores.telefono}
                                    />
                                    {errores.telefono && <Alert color="danger">{errores.telefono}</Alert>}
                                </FormGroup>
                                <FormGroup>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        invalid={!!errores.email}
                                    />
                                    {errores.email && <Alert color="danger">{errores.email}</Alert>}
                                </FormGroup>
                                <FormGroup>
                                    <Label>Nombre</Label>
                                    <Input
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        invalid={!!errores.nombre}
                                    />
                                    {errores.nombre && <div className="text-danger">{errores.nombre}</div>}
                                </FormGroup>
                            </Form>
                            <Button color="primary" className="btn-block mt-3" onClick={procesarPago}>
                                Pagar
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}


export default ShoppingCart;

