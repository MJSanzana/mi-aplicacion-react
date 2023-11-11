//frontend/src/components/user/navbar.js
import '../user/Navbar.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function CustomNavbar() {
  const [expanded, setExpanded] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0); 

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <Navbar expanded={expanded} bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">VIASMAE</Navbar.Brand>
        <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/Establecimientos">Colegios</Nav.Link>
            <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/Soporte">Contacto</Nav.Link>
            <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/Nosotros">Acerca de</Nav.Link>
            <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/Seguimiento">Sigue tu Pedido</Nav.Link>

            <NavDropdown title={<><i className="fas fa-user-circle"></i> Mi Cuenta</>} id="basic-nav-dropdown">
              {isLoggedIn ? (
                <>
                  <NavDropdown.Item onClick={() => setExpanded(false)} as={Link} to="/MiCuenta">Mi Cuenta</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setExpanded(false)} as={Link} to="/MisPedidos">Mis Pedidos</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setExpanded(false)} as={Link} to="/Cambios&devoluciones">Cambios y devoluciones</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item onClick={() => setExpanded(false)} as={Link} to="/Registro">Registrarse</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setExpanded(false)} as={Link} to="/Login">Iniciar Sesión</NavDropdown.Item>
                </>
              )}
            </NavDropdown>
            <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/Carrito" >
              <FontAwesomeIcon icon={faShoppingCart} /> Carrito <span id="cart-counter" className="cart-counter">{cartCount}</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;





