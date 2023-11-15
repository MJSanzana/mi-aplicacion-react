//frontend/src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Carrito from './pages/Carrito';
import Navbar from './components/user/Navbar';
import Soporte from './pages/Soporte';
import Nosotros from './pages/Nosotros';
import Registro from './pages/Registro';
import Seguimiento from './pages/Seguimiento';
import MiCuenta from './pages/MiCuenta';
import Catalogo from './pages/Catalogo';
import Producto from './pages/Productos';
import Establecimiento from './pages/Establecimientos';
import MisPedidos from './pages/MisPedidos';
import CambiosyDevoluciones from './pages/CambiosyDevoluciones';
import FAQ from './pages/FAQ';
import UserEnsureAuth from './components/user/ProtectedRoute';

//administrador
import AdminNavbar from './components/admin/AdminNavbar';
import AdminLogin from './components/admin/AdminLogin';
import CargaDeEstablecimiento from './components/admin/CargadeEstablecimiento';
import AdminHome from './components/admin/AdminHome';
import AdminApproveProducts from './components/admin/AdminApproveProducts';
import AdminEnsureAuth from './components/admin/EnsureAuth'; // 
import { AuthProvider } from './contexts/AuthContext';

//cliente
import ClienteNavbar from './components/cliente/ClienteNavbar';
import ClientsLogin from './components/cliente/ClientsLogin';
import AnalisisVentas from './components/cliente/AnalisisVentas';
import ClienteHome from './components/cliente/ClienteHome';
import EditarStock from './components/cliente/EditarStock';
import CargaProducto from './components/cliente/CargaProducto';
import ClientsEnsureAuth from './components/cliente/ClientsEnsureAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationComponent />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Carrito" element={<Carrito />} />
          <Route path="/Soporte" element={<Soporte />} />
          <Route path="/Nosotros" element={<Nosotros />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Seguimiento" element={<Seguimiento />} />
          <Route path="/Productos" element={<Producto />} />
          <Route path="/Catalogo" element={<Catalogo />} />
          <Route path="/PreguntasFrecuentes" element={<FAQ />} />
          <Route path="/Establecimientos" element={<Establecimiento />} />
          <Route path="/Mispedidos" element={<MisPedidos />} />
          <Route path="/Cambios&devoluciones" element={<CambiosyDevoluciones />} />
          <Route path="/MiCuenta" element={<UserEnsureAuth><MiCuenta /></UserEnsureAuth>} />
          <Route path="/Cliente" element={<ClientsEnsureAuth><ClienteHome /></ClientsEnsureAuth>} />
          <Route path="/Cliente/Analisisventas" element={<ClientsEnsureAuth><AnalisisVentas /></ClientsEnsureAuth>} />
          <Route path="/Cliente/login" element={<ClientsLogin />} />
          <Route path="/Cliente/EditarStock" element={<ClientsEnsureAuth><EditarStock /></ClientsEnsureAuth>} />
          <Route path="/Cliente/Formularioproducto" element={<ClientsEnsureAuth><CargaProducto /></ClientsEnsureAuth>} />
          <Route path="/admin" element={<AdminEnsureAuth><AdminHome /></AdminEnsureAuth>} />
          <Route path="/admin/Cargadeestablecimiento" element={<AdminEnsureAuth><CargaDeEstablecimiento /></AdminEnsureAuth>} />
          <Route path="/admin/AprobarProductos" element={<AdminEnsureAuth><AdminApproveProducts /></AdminEnsureAuth>} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
function NavigationComponent() {
  const location = useLocation();

  let CurrentNavbar;
  if (location.pathname.startsWith('/admin')) {
    CurrentNavbar = AdminNavbar;
  } else if (location.pathname.startsWith('/Cliente')) {
    CurrentNavbar = ClienteNavbar;
  } else {
    CurrentNavbar = Navbar;
  }

  return <CurrentNavbar />;
}

export default App;