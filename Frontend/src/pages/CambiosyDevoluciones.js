import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function CambiosYDevoluciones() {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        // Aquí podrías hacer una llamada a una API o algún otro método para obtener la información de cambios y devoluciones del usuario
        // Por ahora, dejaré esta sección en blanco.
    }, []);

    return (
        <div className="container mt-5">
            <header>
                {/* Aquí puedes agregar el header que se muestra en la imagen, o usar un componente separado si ya lo tienes */}
            </header>

            <main>
                <h2 className="mb-4">Cambios y Devoluciones</h2>

                {pedidos.length === 0 ? (
                    <div className="alert alert-light d-flex flex-column align-items-center">
                        <p className="mb-0">No hay solicitudes de cambios o devoluciones</p>
                        <a href="/Home" className="mt-2 text-muted"><i>Seguir navegando</i></a>
                    </div>
                ) : (
                    <div className="row">
                        {pedidos.map(pedido => (
                            <div key={pedido.id} className="col-md-6">
                                {/* Aquí mostrarías la información de la solicitud de cambio o devolución */}
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title">Solicitud #{pedido.id}</h5>
                                        {/* Otra información de la solicitud */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default CambiosYDevoluciones;
