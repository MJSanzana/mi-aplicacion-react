import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function Mensajes() {
    const { usuario } = useContext(AuthContext);
    const [mensajesEnviados, setMensajesEnviados] = useState([]);
    const [mensajesRecibidos, setMensajesRecibidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [mensajeAResponder, setMensajeAResponder] = useState(null);
    const isMounted = useRef(true);

    const cargarMensajes = async () => {
        if (isMounted.current && usuario?.userId) {
            setIsLoading(true);
            try {
                const enviados = await axios.get(`http://localhost:5000/api/mensajes/enviados/${usuario.userId}`);
                const recibidos = await axios.get(`http://localhost:5000/api/mensajes/usuario/${usuario.userId}`);
                setMensajesEnviados(enviados.data);
                setMensajesRecibidos(recibidos.data);
            } catch (error) {
                console.error('Error al obtener mensajes', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        cargarMensajes();
        const interval = usuario?.userId ? setInterval(cargarMensajes, 60000) : null;

        return () => {
            clearInterval(interval);
            isMounted.current = false;
        };
    }, [usuario]);

    const responderMensaje = async (mensajeId, receptorId) => {
        if (nuevoMensaje.trim() && mensajeId && receptorId) {
            try {
                await axios.post('http://localhost:5000/api/mensajes/crear', {
                    emisorId: usuario.userId,
                    receptorId,
                    mensaje: nuevoMensaje,
                    productoId: mensajeAResponder?.Producto_Id
                });
                setNuevoMensaje('');
                setMensajeAResponder(null);
                await cargarMensajes();
            } catch (error) {
                console.error('Error al responder mensaje', error);
            }
        }
    };

    const marcarComoLeido = async (idMensaje) => {
        try {
            await axios.put(`http://localhost:5000/api/mensajes/marcar-leido/${idMensaje}`);
            await cargarMensajes();
        } catch (error) {
            console.error('Error al marcar mensaje como leído', error);
        }
    };

    const seleccionarMensajeParaResponder = (mensaje) => {
        setMensajeAResponder(mensaje);
    };

    return (
        <div className="container">
            <h2 className="my-3">Mensajes</h2>
            {isLoading && <p>Cargando mensajes...</p>}

            {mensajeAResponder && (
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        placeholder="Escribe tu respuesta aquí..."
                    />
                    <button
                        className="btn btn-primary mt-2"
                        onClick={() => responderMensaje(mensajeAResponder.Id, mensajeAResponder.Receptor_Id)}
                    >
                        Responder Mensaje
                    </button>
                </div>
            )}

            {!isLoading && mensajesRecibidos.length === 0 && <p>No has recibido mensajes.</p>}
            {!isLoading && mensajesRecibidos.map((mensaje) => (
                <div key={mensaje.Id} className="card mb-2">
                    <div className="card-body">
                        <p className="card-text"><strong>De:</strong> {mensaje.Emisor_Id}</p>
                        <p className="card-text"><strong>Mensaje:</strong> {mensaje.Mensaje}</p>
                        <button className="btn btn-secondary" onClick={() => marcarComoLeido(mensaje.Id)}>Marcar como Leído</button>
                        <button className="btn btn-primary" onClick={() => seleccionarMensajeParaResponder(mensaje)}>Responder</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Mensajes;
