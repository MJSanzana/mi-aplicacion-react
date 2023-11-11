import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap'; // Asegúrate de que tienes 'react-bootstrap' instalado en tu proyecto

function AdminHome() {
  return (
    <div className="container mt-5">
      <h1>Bienvenido al Panel de Administración</h1>
      <p>Aquí puedes gestionar los productos, revisar las ventas, y más.</p>
      
      <div className="row mt-4">
        
        {/* Card para Productos */}
        <div className="col-md-4">
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Gestión de Productos</Card.Title>
              <Card.Text>
                Aquí puedes añadir, editar o eliminar los productos disponibles.
              </Card.Text>
              <Link to="/admin/productos">
                <Button variant="primary">Ir a Productos</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
        
        {/* Card para Usuarios */}
        <div className="col-md-4">
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Gestión de Usuarios</Card.Title>
              <Card.Text>
                Administra las cuentas de usuario, incluyendo roles y permisos.
              </Card.Text>
              <Link to="/admin/usuarios">
                <Button variant="primary">Ir a Usuarios</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
        
        {/* Card para Otra Sección */}
        <div className="col-md-4">
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Otra Sección</Card.Title>
              <Card.Text>
                Descripción de otra sección de administración.
              </Card.Text>
              <Link to="/admin/otra-seccion">
                <Button variant="primary">Ir a Otra Sección</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
