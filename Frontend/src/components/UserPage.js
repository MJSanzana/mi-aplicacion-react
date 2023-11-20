import React, { useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import Producto from '../pages/Productos';
import Colegios from '../pages/Colegios';
import ShoppingCart from '../pages/ShoppingCart';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserPage() {
    const [currentView, setCurrentView] = useState('Producto');

    const changeView = (view) => {
        setCurrentView(view);
    };

    return (
        <div>
            <h1 className="my-4 text-center">Bienvenido a VIASMAE</h1>
            {/* Utilizar Nav de Reactstrap para una mejor apariencia */}
            <Nav tabs className="justify-content-center mb-4">
                <NavItem>
                    <NavLink
                        active={currentView === 'Producto'}
                        onClick={() => setCurrentView('Producto')}
                        style={{ cursor: 'pointer' }}
                    >
                        Productos
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={currentView === 'Colegios'}
                        onClick={() => setCurrentView('Colegios')}
                        style={{ cursor: 'pointer' }}
                    >
                        Buscar por Colegio
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={currentView === 'ShoppingCart'}
                        onClick={() => setCurrentView('ShoppingCart')}
                        style={{ cursor: 'pointer' }}
                    >
                        Carro
                    </NavLink>
                </NavItem>
            </Nav>

            {/* Renderizado condicional de componentes */}
            {currentView === 'Producto' && <Producto changeView={changeView} />}
            {currentView === 'Colegios' && <Colegios />}
            {currentView === 'ShoppingCart' && <ShoppingCart />}
        </div>
    );
}

export default UserPage;



