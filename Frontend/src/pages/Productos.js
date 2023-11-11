// Producto.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function Producto({ match }) {
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    // Aquí deberías cargar el producto específico basado en match.params.id
    // desde una API o fuente de datos
  }, [match.params.id]);

  if (!producto) return <div>Cargando...</div>;

  return (
    <div className="container mt-5">
      <img src={producto.imagen} alt={producto.descripcion} className="img-fluid" />
      <h1>{producto.nombre}</h1>
      <p>{producto.descripcion}</p>
      <p>Talla: {producto.talla}</p>
      <p>Precio: ${producto.precio}</p>
      <p>Comuna: {producto.comuna}</p>
      <p>Establecimiento: {producto.establecimiento}</p>
      {/* Aquí puedes agregar más detalles como el material, instrucciones de lavado, etc. */}
    </div>
  );
}

export default Producto;
