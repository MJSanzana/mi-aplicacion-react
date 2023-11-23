// ProviderPage.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';
import CargaProducto from '../pages/CargaProducto';
import GestionProductos from '../pages/GestionProductos';
import Mensajes from './Mensajes';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProviderPage() {
    const [currentView, setCurrentView] = useState('CargaProducto');
    const { usuario, setUsuario } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Si no hay usuario autenticado o si el tipo de usuario no es Proveedor, redirigir
        if (!usuario || usuario.tipoUsuario !== 'Proveedor') {
            navigate('/pagina-usuario'); // o redirige a la ruta de inicio de sesión si es necesario
        } else if (usuario && !usuario.NombreUsuario) {
            // Este bloque es para obtener el nombre del usuario
            const obtenerNombreUsuario = async () => {
                try {
                    const response = await fetch('/api/usuario/' + usuario.userId);
                    const datosUsuario = await response.json();
                    localStorage.setItem('NombreUsuario', datosUsuario.NombreUsuario);
                    setUsuario(prev => ({ ...prev, NombreUsuario: datosUsuario.NombreUsuario }));
                } catch (error) {
                    console.error('Hubo un error al obtener el nombre del usuario:', error);
                }
            };

            obtenerNombreUsuario();
        }
    }, [usuario, navigate, setUsuario]);


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
            <h3 className="my-4 text-center">
                Hola {usuario && usuario.NombreUsuario ? usuario.NombreUsuario : 'administrador'}
            </h3>
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
                <NavItem>
                    <NavLink
                        active={currentView === 'Mensajes'}
                        onClick={() => setCurrentView('Mensajes')}
                        style={{ cursor: 'pointer' }}
                    >
                        Mensajes
                    </NavLink>
                </NavItem>
            </Nav>

            {/* Renderizado condicional de componentes */}
            {currentView === 'CargaProducto' && <CargaProducto />}
            {currentView === 'GestionProductos' && <GestionProductos />}
            {currentView === 'Mensajes' && <Mensajes />} 
            {/* ... más vistas/componentes según sea necesario */}
        </div>
    );
}

export default ProviderPage;
