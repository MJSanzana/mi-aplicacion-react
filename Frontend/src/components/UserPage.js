import React, { useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import Producto from '../pages/Productos';
import Colegios from '../pages/Colegios';
import ShoppingCart from '../pages/ShoppingCart';
import Home from './Home'
import Login from './Login';
import Registro from './Registro';
import Nosotros from '../pages/Nosotros';
import Soporte from '../pages/Soporte';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserPage() {
    const [currentView, setCurrentView] = useState('Home');

    const changeView = (view) => {
        setCurrentView(view);
    };
    const logoStyle = {
        display: 'inline-block', // Muestra la imagen en línea con el texto
        marginRight: '250px', // Espacio entre la imagen y el texto
        verticalAlign: 'middle' // Alinea verticalmente la imagen y el texto
    };

    return (
        <div>
             <img src="VIASMAE.png" alt="Logo VIASMAE" width="150" style={logoStyle} />
                <h2 className="my-4 text-center" style={{ backgroundColor: 'light', color: 'black',display: 'inline-block' }}>La Mayor Selección de Uniformes Escolares en Santiago</h2>
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
                        active={currentView === 'Soporte'}
                        onClick={() => setCurrentView('Soporte')}
                        style={{ cursor: 'pointer' }}
                    >
                        Contactanos
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
            {currentView === 'Registro' && <Registro changeView={changeView} />}
            {currentView === 'Nosotros' && <Nosotros />}
            {currentView === 'Soporte' && <Soporte />}
        </div>
    );
}

export default UserPage;



