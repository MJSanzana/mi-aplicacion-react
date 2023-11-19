// frontend/src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../src/components/AuthContext';

// Importar tus páginas o componentes aquí
import Home from './components/Home';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';
import ProviderPage from './components/ProviderPage';
import SupportPage from './components/SupportPage';
import Login from './components/Login';
import SomeProviderSubPage from './pages/CargaProducto';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pagina-usuario" element={<UserPage />} />
        <Route path="/pagina-administrador" element={<AdminPage />} />
        <Route path="/pagina-proveedor" element={<ProviderPage />} />
          <Route path="subpagina1" element={<SomeProviderSubPage />} />
        <Route path="/pagina-soporte" element={<SupportPage />} />
        {/* Puedes agregar más rutas según sea necesario */}
      </Routes>
    </Router>
    </AuthProvider>
  );
}
export default App;