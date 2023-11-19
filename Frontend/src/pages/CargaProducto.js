import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function formatCurrencyToCLP(numberValue) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(numberValue);
}

const asociarProductoConProveedor = async (productoId, idProveedor, setShowModal, setModalText) => {
    if (!productoId || !idProveedor) {
        console.error('Faltan el ID del producto o el ID del proveedor.');
        setShowModal(true);
        setModalText('Falta el ID del producto o del proveedor. Por favor, intenta de nuevo.');
        return;
    }

    const data = {
        producto_id: productoId,
        proveedor_id: idProveedor
    };

    try {
        const response = await axios.post('http://localhost:5000/api/proveedoresproductos', data);
        if (response.status === 200) {
            console.log('Producto asociado con éxito al proveedor.');
        } else {
            console.error('Respuesta inesperada del servidor al asociar producto con proveedor.');
            setShowModal(true);
            setModalText('Hubo un problema al asociar el producto con el proveedor. Por favor, intenta de nuevo.');
        }
    } catch (error) {
        console.error('Error al asociar el producto con el proveedor:', error);
        setShowModal(true);
        setModalText('Error al intentar asociar el producto con el proveedor. Por favor, verifica tu conexión y vuelve a intentarlo.');
    }
};

function CargaProducto() {
    const { usuario } = useContext(AuthContext);
    const idProveedor = usuario ? usuario.userId : null;

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        genero: '',
        precio: '',
        imagen: null,
        aprobado: 0,
        estado: 'activo',
        tallasCantidades: [{ talla: '', cantidad: 0 }],
    });

    const [productoID, setProductoID] = useState(null);
    const [productoEnviado, setProductoEnviado] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');
    const [displayPrecio, setDisplayPrecio] = useState('');
    const [isProductFormDisabled, setIsProductFormDisabled] = useState(false);

    const handlePrecioBlur = (e) => {
        const { value } = e.target;
        const numericValue = parseFloat(value.replace(/\./g, '').replace('$', '')) || 0;
        const formattedValue = formatCurrencyToCLP(numericValue);

        setDisplayPrecio(formattedValue);
        setFormData((prevState) => ({
            ...prevState,
            precio: numericValue
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "precio") {
            setDisplayPrecio(value.replace(/[^\d]/g, ''));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    const handlePrecioFocus = (e) => {
        const numericValue = parseFloat(displayPrecio.replace(/\./g, '').replace('$', '')) || '';
        setDisplayPrecio(numericValue.toString());
    };

    const handleTallaChange = useCallback((index, field, value) => {
        let newValue = field === 'cantidad' ? parseInt(value) || 0 : value;
        setFormData(prevState => ({
            ...prevState,
            tallasCantidades: prevState.tallasCantidades.map((item, i) =>
                i === index ? { ...item, [field]: newValue } : item
            )
        }));
    }, []);

    const agregarTalla = useCallback(() => {
        setFormData(prevState => ({
            ...prevState,
            tallasCantidades: [...prevState.tallasCantidades, { talla: '', cantidad: 0 }]
        }));
    }, []);


    const eliminarTalla = useCallback((index) => {
        setFormData(prevState => ({
            ...prevState,
            tallasCantidades: prevState.tallasCantidades.filter((_, i) => i !== index)
        }));
    }, []);

    // Validación de campos
    const validateFields = () => {
        const requiredFields = ['nombre', 'descripcion', 'precio', 'imagen', 'genero'];
        const isValid = requiredFields.reduce((valid, field) => {
            if (!formData[field]) {
                setShowModal(true);
                setModalText(`Por favor, llena el campo de ${field}.`);
                return false;
            }
            return valid;
        }, true);
        if (isValid) {
            formData.tallasCantidades.forEach((tc) => {
                if (!tc.talla || tc.cantidad === '') {
                    setShowModal(true);
                    setModalText('Por favor, llena todos los campos de tallas y cantidades.');
                    return false;
                }
            });
        }
        return isValid;
    };
    // Función para enviar el producto
    const handleSendProducto = async (event) => {
        event.preventDefault();
        if (validateFields()) {
            const { nombre, descripcion, precio, imagen, genero, estado } = formData;
            const jsonToSend = {
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                imagen: imagen,
                genero: genero,
                estado: estado,
                aprobado: aprobado
            };

            try {
                const response = await axios.post('http://localhost:5000/api/Createproducts', jsonToSend, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const productoId = response.data.id; // Asumiendo que la respuesta del servidor incluye el ID
                if (productoId) {
                    setProductoID(productoId);
                    setProductoEnviado(true);
                    setShowModal(true);
                    setModalText('Producto guardado exitosamente. Ahora puedes agregar tallas y cantidades.');
                    setIsProductFormDisabled(true);

                    await asociarProductoConProveedor(productoId, idProveedor, setShowModal, setModalText);
                } else {
                    throw new Error('ID del producto no recibido');
                }
            } catch (error) {
                setShowModal(true);
                setModalText(error.message || 'Error al enviar el producto. Por favor, intenta de nuevo.');
            }
        }
    };
    const handleSendTallasYCantidades = async (event) => {
        event.preventDefault();
        if (!productoID || formData.tallasCantidades.length === 0) {
            setShowModal(true);
            setModalText('Primero debes guardar un producto y luego agregar tallas y cantidades.');
            return;
        }
        try {
            // Asegúrate de que las claves en el objeto que envías coincidan con las expectativas del backend.
            const tallasCantidadesData = {
                producto_id: productoID, // Asumiendo que productoID es un número y no una cadena.
                variantes: formData.tallasCantidades.map(tc => ({
                    Talla: tc.talla,
                    Cantidad: tc.cantidad
                }))
            };
    
            const response = await axios.post('http://localhost:5000/api/productosvariantes', tallasCantidadesData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                setShowModal(true);
                setModalText('Tallas y cantidades agregadas con éxito.');
                
                // Reinicia el formulario a su estado inicial aquí
                setFormData({
                    nombre: '',
                    descripcion: '',
                    genero: '',
                    precio: '',
                    imagen: null,
                    aprobado: 0,
                    estado: 'activo',
                    tallasCantidades: [{ talla: '', cantidad: 0 }],
                });
                setDisplayPrecio('');
                setProductoEnviado(false); // Si también deseas resetear esta parte del estado.
    
            } else {
                setShowModal(true);
                setModalText('Respuesta inesperada del servidor.');
            }
        } catch (error) {
            console.error("Error al enviar tallas y cantidades:", error);
            setShowModal(true);
            setModalText('Error al enviar tallas y cantidades. Por favor, intenta de nuevo.');
        }
    };
    

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="mb-4 text-center">Formulario de Carga de Producto</h1>
                    <form onSubmit={handleSendProducto} encType="multipart/form-data" className="shadow p-4 rounded bg-white">
                        <div className="form-group mb-3">
                            <label htmlFor="Nombre">Nombre:</label>
                            <input type="text" className="form-control" name="nombre" onChange={handleInputChange} />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="Descripcion">Descripción:</label>
                            <textarea className="form-control" name="descripcion" onChange={handleInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="genero">Género:</label>
                            <select className="form-control" name="genero" value={formData.genero} onChange={handleInputChange} required >
                                <option value="">Seleccione un género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="precio">Precio:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="precio"
                                    name="precio"
                                    value={displayPrecio}
                                    onChange={handleInputChange}
                                    onBlur={handlePrecioBlur}
                                    onFocus={handlePrecioFocus}
                                />
                            </div>

                            <div className="form-group col-md-8">
                                <label htmlFor="Imagen">Imagen:</label>
                                <input type="file" className="form-control" name="imagen" onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col text-center">
                            <button type="submit" className="btn btn-primary btn-lg4" disabled={isProductFormDisabled}>Guardar Producto</button>
                            </div>
                        </div>
                    </form> {/* Aquí se cierra el form */}
                    {/* Modal aquí */}
                    {showModal && (
                        <div className="modal d-block" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Notificación</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>{modalText}</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <hr />
                        <h3 className="mt-3 mb-4">Tallas y Cantidades</h3>
                        <form onSubmit={handleSendTallasYCantidades}>
                            {formData.tallasCantidades.map((item, index) => (
                                <div key={index} className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor={`id_talla_${index}`}>Talla:</label>
                                            <select
                                                className="form-control"
                                                id={`id_talla_${index}`}
                                                value={item.talla}
                                                onChange={e => handleTallaChange(index, 'talla', e.target.value)}
                                                required>
                                                <option value="" disabled>Seleccione una talla</option>
                                                <option value="4">4</option>
                                                <option value="6">6</option>
                                                <option value="8">8</option>
                                                <option value="10">10</option>
                                                <option value="12">12</option>
                                                <option value="14">14</option>
                                                <option value="16">16</option>
                                                <option value="xs">XS</option>
                                                <option value="s">S</option>
                                                <option value="m">M</option>
                                                <option value="l">L</option>
                                                <option value="xl">XL</option>
                                                <option value="xxl">XXL</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor={`nueva_cantidad_${index}`}>Nueva Cantidad:</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`nueva_cantidad_${index}`}
                                                value={item.cantidad}
                                                onChange={e => handleTallaChange(index, 'cantidad', parseInt(e.target.value))}
                                                placeholder="Nueva cantidad"
                                                min="1"
                                                required />
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-center">
                                        {formData.tallasCantidades.length > 1 && (
                                            <button type="button" className="btn btn-danger mb-3" onClick={() => eliminarTalla(index)}>Eliminar Talla</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <button type="button" className="btn btn-secondary mb-3" onClick={agregarTalla}>Agregar Otra Talla</button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <button type="button" className="btn btn-primary btn-lg4" onClick={handleSendTallasYCantidades} disabled={!productoEnviado}>Agregar Tallas y Cantidades</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CargaProducto;