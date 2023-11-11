import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import './Seguimiento.css'; // Asegúrate de tener la ruta correcta

function Seguimiento() {
  const [orderNumber, setOrderNumber] = useState("");
  const [showTracking, setShowTracking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(orderNumber.trim() === "") {
      alert('Por favor, ingrese un número de pedido.');
      return;
    }
    setShowTracking(true);
  };

  return (
    <Container className="seguimiento-container">
      <div className="text-center">
        <h1>Seguimiento de Pedido</h1>
        <p className="lead">Ingrese el número de pedido</p>
      </div>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Número de Pedido:</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Ingrese el número de pedido" 
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">Buscar</Button>
      </Form>
      
      {showTracking && (
        <div id="tracking-section">
          <div className="text-center">
            <h1>Seguimiento de Pedido</h1>
            <p className="lead">Estado actual: En proceso</p>
          </div>

          <Row>
            <Col md={4}>
              <div className="step-item active">
                <div className="step-icon">1</div>
                <div className="step-text">Pendiente</div>
                <div className="step-description">Su pedido está siendo procesado</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="step-item">
                <div className="step-icon">2</div>
                <div className="step-text">En tránsito</div>
                <div className="step-description">Su pedido está en camino</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="step-item">
                <div className="step-icon">3</div>
                <div className="step-text">Entregado</div>
                <div className="step-description">Su pedido ha sido entregado</div>
              </div>
            </Col>
          </Row>
          
          <div className="step-line"></div>
          
          <div className="step-content">
            <h4>Detalles del Pedido</h4>
            <ul>
              <li>Fecha de pedido: 10 de julio de 2023</li>
              <li>Número de pedido: {orderNumber}</li>
              <li>Artículos: 3</li>
              <li>Total: $150.000</li>
            </ul>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Seguimiento;

