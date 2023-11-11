import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';

function AdminPanel() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Producto 1', description: 'Descripción 1', approved: false },
        //... otros productos
    ]);

    const toggleApproval = (productId) => {
        setProducts(products.map(product => 
            product.id === productId 
            ? { ...product, approved: !product.approved } 
            : product
        ));
    };

    const handleEdit = (productId, field, value) => {
        setProducts(products.map(product => 
            product.id === productId 
            ? { ...product, [field]: value } 
            : product
        ));
    };

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Aprobado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>
                                <Form.Control 
                                    type="text" 
                                    value={product.name} 
                                    onChange={(e) => handleEdit(product.id, 'name', e.target.value)}
                                />
                            </td>
                            <td>
                                <Form.Control 
                                    type="text" 
                                    value={product.description} 
                                    onChange={(e) => handleEdit(product.id, 'description', e.target.value)}
                                />
                            </td>
                            <td>{product.approved ? 'Sí' : 'No'}</td>
                            <td>
                                <Button onClick={() => toggleApproval(product.id)}>
                                    {product.approved ? 'Desaprobar' : 'Aprobar'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default AdminPanel;
