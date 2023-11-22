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
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [tooltipTimeout, setTooltipTimeout] = useState(null);

    const handleMouseEnter = (imageName, event) => {
        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
            setTooltipTimeout(null);
        }

        //const invertedImageName = imageName.replace(/\//g, '\\');
        //console.log("Imagen invertida:", invertedImageName);

        const imageUrl = `http://localhost:5000/${imageName}`;
        const linkPosition = event.target.getBoundingClientRect();
        const newTooltipPosition = {
            top: linkPosition.top + window.scrollY,
            left: linkPosition.left + window.scrollX + linkPosition.width / 2,
        };

        setTooltipPosition(newTooltipPosition);
        setTooltipImage(imageUrl);
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setShowTooltip(false);
        }, 300);
        setTooltipTimeout(timeout);
    };

    useEffect(() => {
        fetchProducts();
        return () => {
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
            }
        };
    }, [tooltipTimeout]);

    const fetchProducts = () => {
        axios.get('http://localhost:5000/api/productos/pendientes')
            .then(response => {
                setProducts(response.data);
            })
            .catch(err => {
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
        setSelectedProducts(prevSelectedProducts => ({
            ...prevSelectedProducts,
            [productoId]: isSelected
        }));
    };

    const handleSelectAllProducts = (isSelected) => {
        const newSelectedProducts = {};
        products.forEach((product) => {
            newSelectedProducts[product.Id] = isSelected;
        });
        setSelectedProducts(newSelectedProducts);
    };

    const handleBulkApproval = async () => {
        setIsApproving(true);
        const productsToApprove = Object.keys(selectedProducts)
            .filter(key => selectedProducts[key])
            .map(Number); // Asegúrate de que los IDs sean números si así lo requiere tu backend.

        if (productsToApprove.length === 0) {
            setError('No hay productos seleccionados para aprobar.');
            setIsApproving(false);
            return;
        }

        try {
            const response = await axios.patch('http://localhost:5000/api/aprobado/multiple', {
                productosIds: productsToApprove
            });
            console.log(response.data.message);
            fetchProducts();
        } catch (err) {
            console.error("Error durante la aprobación:", err);
            setError('Error durante la aprobación de los productos.');
        } finally {
            setIsApproving(false);
        }
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
                onClick={() => handleSelectAllProducts(true)} // Esto marcará todos los productos como seleccionados
                disabled={isApproving}
            >
                Seleccionar Todos
            </Button>
            <Button
                variant="secondary"
                onClick={() => handleSelectAllProducts(false)} // Esto desmarcará todos los productos
                disabled={isApproving}
                style={{ marginLeft: '10px' }}
            >
                Deseleccionar Todos
            </Button>
        </div>
    );
}

export default UpProducto;
//para no perder cambios