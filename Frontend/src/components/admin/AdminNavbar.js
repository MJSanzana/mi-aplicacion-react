import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToolbox } from '@fortawesome/free-solid-svg-icons';

function AdminNavbar() {
    const [expanded, setExpanded] = useState(false);
    const { isAuthenticated, logout } = useAuth(); // Asegúrate de que useAuth proporciona 'isAuthenticated'
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        await logout();
        navigate('/admin/login'); // Redirige a la página de login
        setExpanded(false); // Colapsa el menú de navegación móvil si está expandido
    }, [logout, navigate]);

    // Asumiendo que quieres que algo suceda automáticamente cuando se cierra la sesión,
    // puedes agregar esa lógica aquí en este useEffect.
    useEffect(() => {
        // Acciones cuando el estado de autenticación cambie, si es necesario
        if (!isAuthenticated) {
            setExpanded(false);
            navigate('/admin/login'); // Opcional: Redirige a la página de login si el usuario no está autenticado
        }
    }, [isAuthenticated, navigate]);

    return (
        <Navbar expanded={expanded} bg="light" variant="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/admin">Panel de Administrador</Navbar.Brand>
                <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="admin-navbar-nav" />
                <Navbar.Collapse id="admin-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/admin" onClick={() => setExpanded(false)}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/admin/AprobarProductos" onClick={() => setExpanded(false)}>Aprobar Productos</Nav.Link>
                        <Nav.Link as={Link} to="/admin/Cargadeestablecimiento" onClick={() => setExpanded(false)}>Cargar Establecimiento</Nav.Link>
                        <NavDropdown title={<><FontAwesomeIcon icon={faToolbox} /> Herramientas</>} id="admin-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/admin/Pedidos" onClick={() => setExpanded(false)}>Ver Pedidos</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin/Usuarios" onClick={() => setExpanded(false)}>Gestionar Usuarios</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Mi Cuenta" id="account-nav-dropdown">
                            {isAuthenticated ? (
                                <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                            ) : (
                                <NavDropdown.Item as={Link} to="/admin/login" onClick={() => setExpanded(false)}>Iniciar Sesión</NavDropdown.Item>
                            )}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AdminNavbar;