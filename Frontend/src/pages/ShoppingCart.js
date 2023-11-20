import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ListGroup, ListGroupItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ShoppingCart() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        loadCartFromLocalStorage();
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

    const increaseQuantity = (name) => {
        const newItems = items.map(item =>
            item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
        saveCartToLocalStorage(newItems);
    };

    const decreaseQuantity = (name) => {
        const newItems = items.map(item =>
            item.name === name ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
        );
        saveCartToLocalStorage(newItems);
    };

    const removeItem = (name) => {
        const newItems = items.filter(item => item.name !== name);
        saveCartToLocalStorage(newItems);
    };

    const total = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <Container>
            <Row>
                <Col md="8">
                    <h2>Carro ({items.length} productos)</h2>
                    <ListGroup>
                        {items.map(item => (
                            <ListGroupItem key={item.name}>
                                <Row>
                                    <Col md="6">
                                        <strong>{item.name}</strong>
                                    </Col>
                                    <Col md="2">
                                        {formatPrice(item.price)}
                                    </Col>
                                    <Col md="2">
                                        <Button onClick={() => decreaseQuantity(item.name)}>-</Button>
                                        {` ${item.quantity} `}
                                        <Button onClick={() => increaseQuantity(item.name)}>+</Button>
                                    </Col>
                                    <Col md="2">
                                        <Button color="warning" onClick={() => removeItem(item.name)}>Eliminar</Button>
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

