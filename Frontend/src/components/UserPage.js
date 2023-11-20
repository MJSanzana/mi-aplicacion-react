import React, { useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import Producto from '../pages/Productos';
import Colegios from '../pages/Colegios';
import ShoppingCart from '../pages/ShoppingCart';
import Home from './Home'
import Login from './Login';
import Registro from './Registro';
import Nosotros from '../pages/Nosotros';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserPage() {
    const [currentView, setCurrentView] = useState('Home');

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
                        active={currentView === 'Home'}
                        onClick={() => setCurrentView('Home')}
                        style={{ cursor: 'pointer' }}
                    >
                        Home
                    </NavLink>
                </NavItem>
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
            <NavItem>
                    <NavLink
                        active={currentView === 'Login'}
                        onClick={() => setCurrentView('Login')}
                        style={{ cursor: 'pointer' }}
                    >
                        Mi cuenta
                    </NavLink>
                </NavItem>
                </Nav>

            {/* Renderizado condicional de componentes */}
            {currentView === 'Home' && <Home changeView={changeView} />}
            {currentView === 'Producto' && <Producto />}
            {currentView === 'Colegios' && <Colegios />}
            {currentView === 'ShoppingCart' && <ShoppingCart />}
            {currentView === 'Login' && <Login changeView={changeView} />}
            {currentView === 'Registro' && <Registro />}
            {currentView === 'Nosotros' && <Nosotros />}
        </div>
    );
}

export default UserPage;



