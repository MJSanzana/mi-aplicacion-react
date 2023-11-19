// ProviderPage.js
import React, { useState } from 'react';
import CargaProducto from '../pages/CargaProducto';
//import GestionProductos from '../pages/GestionProductos';

function ProviderPage() {
    const [currentView, setCurrentView] = useState('cargaProducto');

    return (
        <div>
            <h1>Bienvenido Proveedor</h1>
            {/* Aquí puedes tener una barra de navegación o botones para cambiar la vista */}
            <nav>
                <button onClick={() => setCurrentView('cargaProducto')}>Cargar Producto</button>
                <button onClick={() => setCurrentView('gestionProductos')}>Gestionar Productos</button>
                {/* Más botones o enlaces según sea necesario */}
            </nav>

            {/* Renderizado condicional de componentes */}
            {currentView === 'cargaProducto' && <CargaProducto />}
            {currentView === 'gestionProductos' && <GestionProductos />}
            {/* ... más vistas/componentes según sea necesario */}
        </div>
    );
}

export default ProviderPage;

