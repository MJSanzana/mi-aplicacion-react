import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, FormCheck, Alert } from 'react-bootstrap';

function AdminApproveProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [error, setError] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/Aprobar/getPendingProducts')
      .then(response => setProducts(response.data))
      .catch(err => {
        console.error("Hubo un error al obtener los productos pendientes:", err);
        setError('Hubo un error al cargar los productos pendientes.');
      });
  }, []);

  const handleApproval = () => {
    setIsApproving(true);
    const productsToApprove = Object.keys(selectedProducts).filter(key => selectedProducts[key]);
    
    axios.post('http://localhost:5000/api/clients/approveProducts', { products: productsToApprove })
      .then(response => {
        console.log(response.data.message);
        // En lugar de recargar, filtra los productos aprobados
        setProducts(products.filter(product => !productsToApprove.includes(product.id.toString())));
        setSelectedProducts({});
      })
      .catch(err => {
        console.error("Error durante la aprobación:", err);
        setError('Error durante la aprobación de los productos.');
      })
      .finally(() => {
        setIsApproving(false);
      });
  };

  return (
    <div className="container my-5">
      <h2>Productos pendientes de aprobación</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Aprobar</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const { id, nombre, descripcion } = product;
            return (
              <tr key={id}>
                <td>{index + 1}</td>
                <td>{nombre}</td>
                <td>{descripcion}</td>
                <td>
                  <FormCheck
                    type="checkbox"
                    checked={selectedProducts[id] || false}
                    onChange={e => setSelectedProducts({ ...selectedProducts, [id]: e.target.checked })}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Button 
        variant="primary" 
        onClick={handleApproval}
        disabled={isApproving}
      >
        {isApproving ? 'Aprobando...' : 'Aprobar seleccionados'}
      </Button>
    </div>
  );
}

export default AdminApproveProducts;

