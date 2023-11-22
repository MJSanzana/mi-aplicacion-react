// ProviderPage.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';
import CargaProducto from '../pages/CargaProducto';
import GestionProductos from '../pages/GestionProductos';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProviderPage() {
    const [currentView, setCurrentView] = useState('CargaProducto');
    const { usuario } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Si no hay usuario autenticado o si el tipo de usuario no es Proveedor, redirigir
        if (!usuario || usuario.tipoUsuario !== 'Proveedor') {
            navigate('/pagina-usuario'); // o redirige a la ruta de inicio de sesión si es necesario
        }
    }, [usuario, navigate]);

    const changeView = (view) => {
        setCurrentView(view);
    };

    const logoStyle = {
        display: 'inline-block',
        marginRight: '250px',
        verticalAlign: 'middle'
    };

    return (
        <div>
            <img src="VIASMAE.png" alt="Logo VIASMAE" width="150" style={logoStyle} />
            <h2 className="my-6 text-center" style={{ backgroundColor: 'light', color: 'green', display: 'inline-block' }}>
                Bienvenido Proveedor
            </h2>
            <Nav tabs className="justify-content-center mb-6">
                <NavItem>
                    <NavLink
                        active={currentView === 'CargaProducto'}
                        onClick={() => setCurrentView('CargaProducto')}
                        style={{ cursor: 'pointer' }}
                    >
                        Subir Producto
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={currentView === 'GestionProductos'}
                        onClick={() => setCurrentView('GestionProductos')}
                        style={{ cursor: 'pointer' }}
                    >
                        Editar Mis Productos
                    </NavLink>
                </NavItem>
            </Nav>

            {/* Renderizado condicional de componentes */}
            {currentView === 'CargaProducto' && <CargaProducto />}
            {currentView === 'GestionProductos' && <GestionProductos />}
            {/* ... más vistas/componentes según sea necesario */}
        </div>
    );
}

export default ProviderPage;
