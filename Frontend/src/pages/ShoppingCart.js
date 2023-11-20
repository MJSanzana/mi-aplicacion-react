import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ListGroup, ListGroupItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ShoppingCart() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        loadCartFromLocalStorage();
        // Agregar un escuchador para los cambios en localStorage
        const handleStorageChange = () => {
            loadCartFromLocalStorage();
        };

        window.addEventListener('storage', handleStorageChange);

        // Limpiar el escuchador
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const loadCartFromLocalStorage = () => {
        const storedCartItems = localStorage.getItem('cartItems');
        const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
        setItems(cartItems);
    };

    const formatPrice = (price) => `$${price.toLocaleString('es-CL')}`;

    const clearCart = () => {
        localStorage.removeItem('cartItems');
        setItems([]);
        alert('El carrito se ha vaciado correctamente.');
    };

    const saveCartToLocalStorage = (newItems) => {
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        setItems(newItems); // Actualiza el estado para reflejar los cambios en la UI
    };

    const increaseQuantity = (Nombre) => {
        const newItems = items.map(item =>
            item.Nombre === Nombre ? { ...item, cantidad: item.cantidad + 1 } : item
        );
        saveCartToLocalStorage(newItems);
    };
    
    const decreaseQuantity = (Nombre) => {
        const newItems = items.map(item =>
            item.Nombre === Nombre ? { ...item, cantidad: Math.max(1, item.cantidad - 1) } : item
        );
        saveCartToLocalStorage(newItems);
    };
    
    

    const removeItem = (Nombre) => {
        const newItems = items.filter(item => item.Nombre !== Nombre);
        saveCartToLocalStorage(newItems);
    };

    const total = items.reduce((acc, item) => acc + (item.Precio * item.cantidad), 0);

    return (
        <Container>
            <Row>
                <Col md="8">
                    <h2>Carro ({items.length} productos)</h2>
                    <ListGroup>
                        {items.map(item => (
                            <ListGroupItem key={item.Nombre}>
                                <Row>
                                    <Col md="6">
                                        <strong>{item.Nombre}</strong>
                                    </Col>
                                    <Col md="2">
                                        {formatPrice(item.Precio)}
                                    </Col>
                                    <Col md="2">
                                        <Button onClick={() => decreaseQuantity(item.Nombre)}>-</Button>
                                        {` ${item.cantidad} `}
                                        <Button onClick={() => increaseQuantity(item.Nombre)}>+</Button>
                                    </Col>
                                    <Col md="2">
                                        <Button color="warning" onClick={() => removeItem(item.Nombre)}>Eliminar</Button>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Col>
                <Col md="4">
                    <h2>Resumen de la compra</h2>
                    <ListGroup>
                        <ListGroupItem>
                            <Row>
                                <Col>Total</Col>
                                <Col>{formatPrice(total)}</Col>
                            </Row>
                        </ListGroupItem>
                    </ListGroup>
                    <Button color="danger" block onClick={clearCart}>Vaciar Carrito</Button>
                    <Button color="success" block>Pagar</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default ShoppingCart;

