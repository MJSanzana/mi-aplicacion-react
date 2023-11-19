import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function Producto() {
    const [formData, setFormData] = useState({
        Nombre: '',
        Descripcion: '',
        Genero: '',
        Precio: '',
        Imagen: null,
        Aprobado: '0',
        Estado: 'activo',
        tallasCantidades: [{ Talla: '', Cantidad: 0 }],
    });
    const [productoID, setProductoID] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');
    const { usuario } = useContext(AuthContext);
    const IdProveedor = usuario ? usuario.Id : null;

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, imagen: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Funciones para manejar las tallas y cantidades
    const handleTallaChange = (index, field, value) => {
        const updatedTallas = formData.tallasCantidades.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setFormData({ ...formData, tallasCantidades: updatedTallas });
    };

    const agregarTalla = () => {
        setFormData({
            ...formData,
            tallasCantidades: [...formData.tallasCantidades, { talla: '', cantidad: 0 }]
        });
    };

    const eliminarTalla = (index) => {
        setFormData({
            ...formData,
            tallasCantidades: formData.tallasCantidades.filter((_, i) => i !== index)
        });
    };

    // Validación de campos
    const validateFields = () => {
        if (!formData.Nombre || !formData.Descripcion || !formData.Precio || !formData.Imagen || !formData.Genero) {
            setShowModal(true);
            setModalText('Por favor, completa todos los campos requeridos.');
            return false;
        }
        if (formData.tallasCantidades.some(tc => !tc.talla || tc.cantidad === 0)) {
            setShowModal(true);
            setModalText('Por favor, completa todos los campos de tallas y cantidades.');
            return false;
        }
        return true;
    };

    // Función para enviar el producto
    const handleSendProducto = async () => {
        if (!validateFields()) return;

        const postFormData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'tallasCantidades') {
                postFormData.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post('http://localhost:5000/api/Createproducts', postFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data && response.data.Id) {
                setProductoID(response.data.Id);
                setShowModal(true);
                setModalText('Producto guardado exitosamente.');
                await asociarProductoConProveedor(response.data.Id, IdProveedor);
            } else {
                throw new Error('ID del producto no recibido');
            }
        } catch (error) {
            setShowModal(true);
            setModalText(error.message || 'Error al enviar el producto. Por favor, intenta de nuevo.');
        }
    };

    const asociarProductoConProveedor = async (productoId, proveedorId) => {
        const data = {
            producto_id: productoId,
            proveedor_id: proveedorId
        };
        try {
            await axios.post('http://localhost:5000/api/proveedoresproductos', data);
            // Manejo de la respuesta exitosa
        } catch (error) {
            // Manejo de errores
        }
    };
    // Esta función ahora solo enviará las tallas y cantidades, asumiendo que el productoID ya está establecido.
    const handleSendTallasYCantidades = async (event) => {
        event.preventDefault();
        if (!productoID || formData.tallasCantidades.length === 0) {
            setShowModal(true);
            setModalText('Primero debes guardar un producto y luego agregar tallas y cantidades.');
            return;
        }
        try {
            const tallasCantidadesData = { tallas_cantidades: formData.tallasCantidades };
            const response = await axios.post(`http://localhost:5000/api/productosvariantes/${productoID}`, tallasCantidadesData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                setShowModal(true);
                setModalText('Tallas y cantidades agregadas con éxito.');
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
                            <input type="text" className="form-control" name="Nombre" onChange={handleInputChange} />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="Descripcion">Descripción:</label>
                            <textarea className="form-control" name="descripcion" onChange={handleInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="genero">Género:</label>
                            <select className="form-control" name="genero" value={formData.Genero} onChange={handleInputChange} required >
                                <option value="">Seleccione un género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="Precio">Precio:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Precio"
                                    name="Precio"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group col-md-8">
                                <label htmlFor="Imagen">Imagen:</label>
                                <input type="file" className="form-control" name="Imagen" onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col text-center">
                            <button type="submit" className="btn btn-primary btn-lg4">Guardar Producto</button>
                            </div>
                        </div>
                    </form>
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
export default Producto;