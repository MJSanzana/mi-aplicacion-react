// AdminPage.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import CargaColegio from '../pages/CargaColegio';
import UpProducto from '../pages/UpProducto';
import { Nav, NavItem, NavLink } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminPage() {
    const [currentView, setCurrentView] = useState('UpProducto');
    const { usuario } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Si no hay usuario autenticado o si el tipo de usuario no es Administrador, redirigir
        if (!usuario || usuario.tipoUsuario !== 'Administrador') {
            navigate('/pagina-usuario'); // o a la ruta de inicio de sesión o página principal
        }
    }, [usuario, navigate]);

    const changeView = (view) => {
        setCurrentView(view);
    };

    return (
        <div>
            <h1 className="my-4 text-center">Bienvenido administrador</h1>
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
            </Nav>

            {/* Renderizado condicional de componentes */}
            {currentView === 'UpProducto' && <UpProducto />}
            {currentView === 'CargaColegio' && <CargaColegio />}
        </div>
    );
}

export default AdminPage;
