// AdminPage.js
import React, { useState } from 'react';
import CargaColegio from '../pages/CargaColegio';
import { Nav, NavItem, NavLink } from 'reactstrap';
import UpProducto from '../pages/UpProducto';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminPage() {
    const [currentView, setCurrentView] = useState('UpProducto');
    const changeView = (view) => {
        setCurrentView(view);
    };

    return (
        <div>
            <h1 className="my-4 text-center">Bienvenido administrador</h1>
            {/* Utilizar Nav de Reactstrap para una mejor apariencia */}
            <Nav tabs className="justify-content-center mb-4">
                <NavItem>
                    <NavLink
                    active={currentView ==='CargaColegio'}
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
            {currentView === 'UpProducto' && <UpProducto changeView={changeView} />}
            {currentView === 'CargaColegio' && <CargaColegio />}

        </div>
    );
}

export default AdminPage;