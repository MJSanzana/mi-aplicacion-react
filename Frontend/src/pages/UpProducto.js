import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';

function UpProducto() {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [error, setError] = useState('');
    const [isApproving, setIsApproving] = useState(false);
    const [tooltipImage, setTooltipImage] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);

    // Maneja el evento onMouseEnter
    const handleMouseEnter = (imageName) => {
        // Reemplaza las barras invertidas por barras normales si estás en Windows
        const formattedImageName = imageName.replace(/\\/g, '/');
        const imageUrl = `http://localhost:5000/${formattedImageName}`;
        setTooltipImage(imageUrl);
        setShowTooltip(true);
    };


    // Maneja el evento onMouseLeave
    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('http://localhost:5000/api/productos/pendientes')
            .then(response => {
                setProducts(response.data);
            })
            .catch(err => {
                console.error("Hubo un error al obtener los productos pendientes:", err);
                setError('Hubo un error al cargar los productos pendientes.');
            });
    };

    const handleApproval = (productoId) => {
        setIsApproving(true);
        axios.patch(`http://localhost:5000/api/aprobado/${productoId}`, { aprobado: 1 })
            .then(response => {
                console.log(response.data.message);
                fetchProducts();
            })
            .catch(err => {
                console.error("Error durante la aprobación:", err);
                setError('Error durante la aprobación del producto.');
            })
            .finally(() => {
                setIsApproving(false);
            });
    };

    const handleSelectProduct = (productoId, isSelected) => {
        setSelectedProducts(prev => ({
            ...prev,
            [productoId]: isSelected
        }));
    };

    const handleSelectAllProducts = (isSelected) => {
        const newSelectedProducts = {};
        products.forEach((producto) => {
            newSelectedProducts[producto.id] = isSelected;
        });
        setSelectedProducts(newSelectedProducts);
    };



    const handleBulkApproval = () => {
        setIsApproving(true);

        // Crea un array de todos los IDs de productos seleccionados
        const productsToApprove = Object.keys(selectedProducts).filter(key => selectedProducts[key]);

        // Asegúrate de manejar correctamente la aprobación múltiple en tu backend
        axios.patch(`http://localhost:5000/api/aprobado/multiple`, { productsToApprove })
            .then(response => {
                console.log(response.data.message);
                fetchProducts();
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
                        <th>Precio</th>
                        <th>Imagen</th>
                        <th>
                            <Button
                                variant="success"
                                onClick={handleBulkApproval}
                                disabled={isApproving || !Object.values(selectedProducts).some(Boolean)}
                            >
                                Aprobar Seleccionados
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((producto, index) => (
                        <tr key={producto.id}>
                            <td>{index + 1}</td>
                            <td>{producto.Nombre}</td>
                            <td>{producto.Descripcion}</td>
                            <td>{producto.Precio}</td>
                            <td>
                                <a
                                    href="#"
                                    onMouseEnter={() => handleMouseEnter(producto.Imagen)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    Ver Imagen
                                </a>
                                {showTooltip && producto.Imagen === tooltipImage && (
                                    <div className="image-tooltip active">
                                        <img src={tooltipImage} alt="Imagen del Producto" />
                                    </div>
                                )}
                            </td>
                            <td>
                                <Button
                                    variant="success"
                                    onClick={() => handleApproval(producto.id)}
                                    disabled={isApproving || selectedProducts[producto.id]}
                                >
                                    {isApproving && selectedProducts[producto.id] ? 'Aprobando...' : 'Aprobar'}
                                </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
                {showTooltip && (
                    <div
                        className="image-tooltip active"
                        style={{
                            left: '50%',
                            top: '50%'
                        }}
                    >
                        <img src={tooltipImage} alt="Imagen del Producto" />
                    </div>
                )}
            </Table>
            <Button
                variant="secondary"
                onClick={() => handleSelectAllProducts(true)}
                disabled={isApproving}
            >
                Seleccionar Todos
            </Button>
            <Button
                variant="secondary"
                onClick={() => handleSelectAllProducts(false)}
                disabled={isApproving}
                style={{ marginLeft: '10px' }}
            >
                Deseleccionar Todos
            </Button>
        </div>
    );
}

export default UpProducto;

