// AdminPage.js
import React, { useState } from 'react';
//import CargaColegio from '../pages/CargaColegio';
import UpProducto from '../pages/UpProducto';

function AdminPage() {
    const [currentView, setCurrentView] = useState('UpProducto');

    return (
        <div>Administrador
            <h1>Bienvenido Administrador</h1>
            {/* Aquí puedes tener una barra de navegación o botones para cambiar la vista */}
            <nav>
                <button onClick={() => setCurrentView('CargaColegio')}>Cargar Colegios</button>
                <button onClick={() => setCurrentView('UpProducto')}>Aprobar Productos</button>
                {/* Más botones o enlaces según sea necesario */}
            </nav>

            {/* Renderizado condicional de componentes */}
            {currentView === 'CargaColegio' && <CargaColegio   />}
            {currentView === 'UpProducto' && <UpProducto />}
            {/* ... más vistas/componentes según sea necesario */}
        </div>
    );
}
export default AdminPage;