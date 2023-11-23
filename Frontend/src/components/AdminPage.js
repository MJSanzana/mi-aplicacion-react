// AdminPage.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import CargaColegio from '../pages/CargaColegio';
import UpProducto from '../pages/UpProducto';
import Mensajes from './Mensajes';
import { Nav, NavItem, NavLink } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminPage() {
    const [currentView, setCurrentView] = useState('UpProducto');
    const { usuario, setUsuario } = useContext(AuthContext);
    const navigate = useNavigate();
    

    useEffect(() => {
        // Este bloque es para la redirección si el usuario no está autenticado o no es un administrador
        if (!usuario || usuario.tipoUsuario !== 'Administrador') {
            navigate('/pagina-usuario'); // o a la ruta de inicio de sesión o página principal
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

    return (
        <div>
            <h3 className="my-4 text-center">
                Bienvenido {usuario && usuario.NombreUsuario ? usuario.NombreUsuario : 'administrador'}
            </h3>
            <Nav tabs className="justify-content-center mb-4">
                <NavItem>
                    <NavLink
                        active={currentView === 'CargaColegio'}
                        onClick={() => setCurrentView('CargaColegio')}
                        style={{ cursor: 'pointer' }}
                    >
                        Cargar Colegios
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={currentView === 'UpProducto'}
                        onClick={() => setCurrentView('UpProducto')}
                        style={{ cursor: 'pointer' }}
                    >
                        Aprobar Producto
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
            {currentView === 'UpProducto' && <UpProducto />}
            {currentView === 'CargaColegio' && <CargaColegio />}
            {currentView === 'Mensajes' && <Mensajes />} 
        </div>
    );
}

export default AdminPage;
