// Catalogo.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Catalogo() {
    const [productos, setProductos] = useState([]);
    const [filtro, setFiltro] = useState({
        precio: '',
        comuna: '',
        establecimiento: ''
    });

    // Aquí deberías cargar tus productos desde una API o fuente de datos
    useEffect(() => {
        // fetch o axios para obtener los productos...
    }, []);

    const productosFiltrados = productos.filter(producto => {
        return (
            (filtro.precio ? producto.precio <= filtro.precio : true) &&
            (filtro.comuna ? producto.comuna === filtro.comuna : true) &&
            (filtro.establecimiento ? producto.establecimiento === filtro.establecimiento : true)
        );
    });

    return (
        <div className="container mt-5">
            <div className="mb-3">
                <input type="number" placeholder="Precio máximo" onChange={(e) => setFiltro({ ...filtro, precio: e.target.value })} />
                <input type="text" placeholder="Comuna" onChange={(e) => setFiltro({ ...filtro, comuna: e.target.value })} />
                <input type="text" placeholder="Establecimiento" onChange={(e) => setFiltro({ ...filtro, establecimiento: e.target.value })} />
            </div>

            <div className="row">
                {productosFiltrados.map(producto => (
                    <div className="col-md-4 mb-3" key={producto.id}>
                        <Link to={`./imagenes/${producto.id}`}>
                            <img src={`/imagenes/${producto.imagen}`} alt={producto.descripcion} className="img-fluid" />
                            <p>{producto.nombre}</p>
                        </Link>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default Catalogo;
