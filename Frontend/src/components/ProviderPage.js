// ProviderPage.js
// ProviderPage.js
import React, { useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import CargaProducto from '../pages/CargaProducto';
import GestionProductos from '../pages/GestionProductos';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProviderPage() {
    const [currentView, setCurrentView] = useState('CargaProducto');

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
                <h2 className="my-6 text-center" style={{ backgroundColor: 'light', color: 'green',display: 'inline-block' }}>Bienvenido Proveedor</h2>
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
            {currentView === 'CargaProducto' && <CargaProducto   />}
            {currentView === 'GestionProductos' && <GestionProductos />}
            {/* ... más vistas/componentes según sea necesario */}
        </div>
        
    );
}
export default ProviderPage;