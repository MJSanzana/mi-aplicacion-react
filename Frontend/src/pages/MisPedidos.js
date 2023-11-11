import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de haber instalado Bootstrap

function MisPedidos() {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        // Aquí podrías hacer una llamada a una API o algún otro método para obtener los pedidos del usuario
        // Por ahora, dejaré esta sección en blanco.
    }, []);

    return (
        <div className="container mt-5">
            <header>
                {/* Aquí se puede agregar el header que se muestra en la imagen, o usar un componente separado si se tiene */}
            </header>

            <main>
                <h2 className="mb-4">Mis pedidos</h2>

                {pedidos.length === 0 ? (
                    <div className="alert alert-light d-flex flex-column align-items-center">
                        <p className="mb-0">No hay pedidos realizados</p>
                        <a href="/Home" className="mt-2 text-muted"><i>Seguir navegando</i></a>
                    </div>
                ) : (
                    <div className="row">
                        {pedidos.map(pedido => (
                            <div key={pedido.id} className="col-md-6">
                                {/* Aquí mostrarías la información del pedido */}
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title">Pedido #{pedido.id}</h5>
                                        {/* Otra información del pedido */}
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

export default MisPedidos;

