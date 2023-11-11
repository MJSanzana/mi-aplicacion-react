import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages/Carrito.css';

function Carrito() {
    const [cart, setCart] = useState([]);
  
    useEffect(() => {
        loadCartFromLocalStorage();
    }, []);

    const loadCartFromLocalStorage = () => {
        const storedCartItems = localStorage.getItem('cartItems');
        const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
        setCart(cartItems);
    }

    const formatPrice = (price) => `$${price.toLocaleString('es-CL')}`;

    const clearCart = () => {
        localStorage.removeItem('cartItems');
        setCart([]);
        alert('El carrito se ha vaciado correctamente.');
    }

    const increaseQuantity = (name) => {
        const newCart = cart.map(item => 
            item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCart(newCart);
        localStorage.setItem('cartItems', JSON.stringify(newCart));
    }

    const decreaseQuantity = (name) => {
        const newCart = cart.map(item => 
            item.name === name ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
        );
        setCart(newCart);
        localStorage.setItem('cartItems', JSON.stringify(newCart));
    }

    const removeItem = (name) => {
        const newCart = cart.filter(item => item.name !== name);
        setCart(newCart);
        localStorage.setItem('cartItems', JSON.stringify(newCart));
    }

    return (
        <div className="container">
            <center><h1>Resumen de la compra</h1></center>

            <main>
                <section id="cart-items">
                    <h2>Carro</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio Unitario</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.name}>
                                    <td>{item.name}</td>
                                    <td>{formatPrice(item.price)}</td>
                                    <td>
                                        <button onClick={() => decreaseQuantity(item.name)}>-</button>
                                        {item.quantity}
                                        <button onClick={() => increaseQuantity(item.name)}>+</button>
                                    </td>
                                    <td>{formatPrice(item.price * item.quantity)}</td>
                                    <td><button className="btn btn-warning" onClick={() => removeItem(item.name)}>Eliminar</button></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4"><strong>Total:</strong></td>
                                <td>{formatPrice(cart.reduce((total, item) => total + (item.price * item.quantity), 0))}</td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <button className="btn btn-danger" onClick={clearCart}>Vaciar Carrito</button>
                                </td>
                                <td colSpan="3">
                                    <button className="btn btn-success">Pagar</button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Carrito;

