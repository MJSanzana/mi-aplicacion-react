//UserPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { AuthContext } from './AuthContext';
import Productos from '../pages/Productos';
import Colegios from '../pages/Colegios';
import ShoppingCart from '../pages/ShoppingCart';
import Home from './Home'
import Login from './Login';
import Registro from './Registro';
import Nosotros from '../pages/Nosotros';
import Soporte from '../pages/Soporte';
import DetallesProducto from '../pages/DetallesProducto';
//import EditUserForm from './EditUserForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserPage() {
    const [currentView, setCurrentView] = useState('Home');
    const navigate = useNavigate();
    const { usuario, setUsuario } = useContext(AuthContext);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    // Supongamos que este estado representa si el usuario está logueado
    const isUserLoggedIn = usuario && usuario.userId;

    const changeView = (view) => {
        setCurrentView(view);
    };
    const logoStyle = {
        display: 'inline-block', // Muestra la imagen en línea con el texto
        marginRight: '250px', // Espacio entre la imagen y el texto
        verticalAlign: 'middle' // Alinea verticalmente la imagen y el texto
    };
    const goToEditProfile = () => {
        if (usuario && usuario.userId) {
            navigate(`/edit-user/${usuario.userId}`);
        } else {
            // Manejar el caso en que el usuario no esté logueado o no tenga un ID
        }
    };
    // Función para cerrar sesión
    const handleLogout = () => {
        // Realiza cualquier limpieza necesaria (por ejemplo, eliminar tokens de autenticación, etc.)
        // Luego, actualiza el estado de autenticación a null o un valor vacío en tu contexto
        setUsuario(null);

        // Redirige al usuario a la página de inicio de sesión o a donde desees
        navigate('/pagina-usuario'); // Ajusta la ruta según tus necesidades
    };
    console.log("Producto seleccionado en UserPage:", productoSeleccionado);



    return (
        <div>
            <img src="VIASMAE.png" alt="Logo VIASMAE" width="150" style={logoStyle} />
            <h2 className="my-4 text-center" style={{ backgroundColor: 'light', color: 'black', display: 'inline-block' }}>La Mayor Selección de Uniformes Escolares en Santiago</h2>
            <Nav tabs className="justify-content-center mb-4">
                {/* Tus NavItems aquí */}
                {isUserLoggedIn && (
                    <NavItem>
                        <NavLink
                            style={{ cursor: 'pointer' }}
                            onClick={goToEditProfile}
                        >
                            <FontAwesomeIcon icon={faUserEdit} /> Editar Perfil
                        </NavLink>
                    </NavItem>
                )}
                {isUserLoggedIn && (
                    <NavItem>
                        <NavLink
                            style={{ cursor: 'pointer' }}
                            onClick={handleLogout} // Llama a la función de cierre de sesión
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
                        </NavLink>
                    </NavItem>
                )}
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
                        active={currentView === 'Productos'}
                        onClick={() => setCurrentView('Productos')}
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
                        Cuenta
                    </NavLink>
                </NavItem>
            </Nav>

            {/* Renderizado condicional de componentes */}
            {currentView === 'Home' && <Home changeView={changeView} />}
            {currentView === 'Productos' && <Productos changeView={changeView} setProductoSeleccionado={setProductoSeleccionado} />}
            {currentView === 'Colegios' && <Colegios />}
            {currentView === 'ShoppingCart' && <ShoppingCart />}
            {currentView === 'Login' && <Login changeView={changeView} navigate={navigate} />}
            {currentView === 'Registro' && <Registro changeView={changeView} />}
            {currentView === 'Nosotros' && <Nosotros />}
            {currentView === 'Soporte' && <Soporte />}
            {currentView === 'DetallesProducto' && productoSeleccionado && (
                <DetallesProducto productoId={productoSeleccionado} />
            )}
        </div>
    );
}

export default UserPage;