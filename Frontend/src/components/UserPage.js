// frontend/src/components/UserPage.js
import React, { useState } from 'react';
import Producto from '../pages/Productos';
import Colegios from '../pages/Colegios';

function UserPage() {
    const [currentView, setCurrentView] = useState('Productos');

    return (
        <div>
            <h1>Productos Disponibles</h1>
            {/* Aquí puedes tener una barra de navegación o botones para cambiar la vista */}
            <nav>
                <button onClick={() => setCurrentView('Producto')}>Producto</button>
                <button onClick={() => setCurrentView('Colegios')}>Buscar por Colegio</button>
                {/* Más botones o enlaces según sea necesario */}
            </nav>

            {/* Renderizado condicional de componentes */}
            {currentView === 'Productos' && <Producto   />}
            {currentView === 'Colegios' && <Colegios />}
            {/* ... más vistas/componentes según sea necesario */}
        </div>
    );
}
export default UserPage;


