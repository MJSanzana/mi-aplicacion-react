import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Mensajes() {
    const [mensajes, setMensajes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Aquí debes realizar una llamada a tu API para obtener los mensajes del usuario actual
        // Puedes usar axios u otra librería para hacer la solicitud GET a tu endpoint de mensajes

        // Ejemplo de solicitud GET (debes ajustarlo según tu API)
        axios.get('/api/mensajes')
            .then(response => {
                setMensajes(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener los mensajes', error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div>
            <h2>Mensajes</h2>
            {isLoading && <p>Cargando mensajes...</p>}
            {!isLoading && mensajes.length === 0 && <p>No tienes mensajes.</p>}
            {!isLoading && mensajes.length > 0 && (
                <ul>
                    {mensajes.map(mensaje => (
                        <li key={mensaje.id}>
                            <strong>De:</strong> {mensaje.emisor}<br />
                            <strong>Para:</strong> {mensaje.destinatario}<br />
                            <strong>Mensaje:</strong> {mensaje.contenido}<br />
                            <strong>Leído:</strong> {mensaje.leido ? 'Sí' : 'No'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Mensajes;
