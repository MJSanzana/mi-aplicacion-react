import React, { useState } from 'react';

function EditarStock() {
    // Supongamos que los productos se obtienen de la API o de algún estado global.
    // Por ahora, utilizaremos un estado local para simular esto.
    const [productos, setProductos] = useState([
        { id: 1, nombre: 'Producto 1', stock: 10 },
        { id: 2, nombre: 'Producto 2', stock: 5 },
    ]);

    const handleStockChange = (id, newStock) => {
        const updatedProducts = productos.map(p => 
            p.id === id ? { ...p, stock: newStock } : p
        );
        setProductos(updatedProducts);
    };

    return (
        <div className="container my-5">
            <h1>Editar Stock de Productos</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre del Producto</th>
                        <th>Stock Actual</th>
                        <th>Editar Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(producto => (
                        <tr key={producto.id}>
                            <td>{producto.nombre}</td>
                            <td>{producto.stock}</td>
                            <td>
                                <input 
                                    type="number"
                                    value={producto.stock}
                                    onChange={e => handleStockChange(producto.id, parseInt(e.target.value))}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EditarStock;
