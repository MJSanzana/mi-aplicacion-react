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
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 }); // Estado para la posición del tooltip

    // Maneja el evento onMouseEnter
    const handleMouseEnter = (imageName, event) => {
        // Reemplaza los slashes normales con slashes invertidos solo para mostrar
        const invertedImageName = imageName.replace(/\//g, '\\');

        console.log("Imagen invertida:", invertedImageName);

        const imageUrl = `http://localhost:5000/${imageName}`;

        // Obtén la posición del enlace
        const linkPosition = event.target.getBoundingClientRect();

        // Calcula la posición del tooltip
        const tooltipPosition = {
            top: linkPosition.top + window.scrollY,
            left: linkPosition.left + window.scrollX + linkPosition.width / 2,
        };

        setTooltipPosition(tooltipPosition);
        setTooltipImage(imageUrl);
        setShowTooltip(true);
        console.log("Imagen recibida:", imageName);
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
        axios.put(`http://localhost:5000/api/aprobado/${productoId}`, { aprobado: 1 })
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
            newSelectedProducts[producto.Id] = isSelected;
        });
        setSelectedProducts(newSelectedProducts);
    };

    const handleBulkApproval = () => {
        setIsApproving(true);

        const productsToApprove = Object.keys(selectedProducts).filter(key => selectedProducts[key]);

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
                        <tr key={producto.Id}>
                            <td>{index + 1}</td>
                            <td>{producto.Nombre}</td>
                            <td>{producto.Descripcion}</td>
                            <td>{producto.Precio}</td>
                            <td>
                                <a
                                    href="#"
                                    onMouseEnter={(event) => handleMouseEnter(producto.Imagen, event)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    Ver Imagen
                                </a>
                                {showTooltip && (
                                    <div
                                        className="image-tooltip active"
                                        style={{
                                            position: 'absolute',
                                            top: tooltipPosition.top + 'px',
                                            left: tooltipPosition.left + 'px',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 1000
                                        }}
                                    >
                                        <img src={tooltipImage} alt="Imagen del Producto" />
                                    </div>
                                )}
                            </td>
                            <td>
                                <Button
                                    variant="success"
                                    onClick={() => handleApproval(producto.Id)}
                                    disabled={isApproving || selectedProducts[producto.Id]}
                                >
                                    {isApproving && selectedProducts[producto.Id] ? 'Aprobando...' : 'Aprobar'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
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