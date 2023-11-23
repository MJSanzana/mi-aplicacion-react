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

                console.log('Mensajes Enviados:', enviados.data);
                console.log('Mensajes Recibidos:', recibidos.data);

                if (Array.isArray(enviados.data) && Array.isArray(recibidos.data)) {
                    setMensajesEnviados(enviados.data);
                    setMensajesRecibidos(recibidos.data);
                } else {
                    console.error('Los datos recibidos no son una lista');
                }
            } catch (error) {
                console.error('Error al obtener mensajes', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        console.log('Mensajes cargados:', mensajesRecibidos, mensajesEnviados);
        cargarMensajes();
        const interval = usuario?.userId ? setInterval(cargarMensajes, 60000) : null;

        return () => {
            clearInterval(interval);
            isMounted.current = false;
        };
    }, [usuario]);

    useEffect(() => {
        console.log('Mensaje a responder:', mensajeAResponder);
    }, [mensajeAResponder]);


    const responderMensaje = async (mensajeParaResponder) => {
        if (nuevoMensaje.trim()) {
            try {
                const response = await axios.post('http://localhost:5000/api/mensajes/crear', {
                    emisorId: usuario.userId,
                    receptorId: mensajeParaResponder.Emisor_Id,
                    mensaje: nuevoMensaje,
                    productoId: mensajeParaResponder.Producto_Id
                });
                console.log(response.data);
                setNuevoMensaje('');
                setMensajeAResponder(null);
                await cargarMensajes();
            } catch (error) {
                console.error('Error al responder mensaje', error);
            }
        }
    };

    const marcarComoLeido = async (mensajeId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/mensajes/marcar-leido/${mensajeId}`);
            alert(response.data.message);
            await cargarMensajes();
        } catch (error) {
            console.error('Error al marcar mensaje como leído', error);
            alert('Error al marcar mensaje como leído');
        }
    };

    const seleccionarMensajeParaResponder = (mensaje) => {
        console.log('Mensaje seleccionado para responder:', mensaje);
        setMensajeAResponder(mensaje);
    };

    return (
        <div className="container">
            <h2 className="my-3">Mensajes</h2>
            {isLoading && <p>Cargando mensajes...</p>}

            {/* Mensajes recibidos */}
            <div>
                <h3>Mensajes Recibidos</h3>
                {!isLoading && mensajesRecibidos.length === 0 && <p>No has recibido mensajes.</p>}
                {!isLoading && mensajesRecibidos.map((mensaje) => (
                    <div key={mensaje.Id} className="card mb-2">
                        <div className="card-body">
                            <p className="card-text"><strong>De:</strong> {mensaje.Emisor_Id}</p>
                            <p className="card-text"><strong>Mensaje:</strong> {mensaje.Mensaje}</p>
                            <button className="btn btn-secondary" onClick={() => marcarComoLeido(mensaje.Id)}>Marcar como Leído</button>
                            <button className="btn btn-primary" onClick={() => setMensajeAResponder(mensaje)}>Responder</button>
                            {mensajeAResponder && mensajeAResponder.Id === mensaje.Id && (
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        value={nuevoMensaje}
                                        onChange={(e) => setNuevoMensaje(e.target.value)}
                                        placeholder="Escribe tu respuesta aquí..."
                                    />
                                    <button
                                        className="btn btn-primary mt-2"
                                        onClick={() => responderMensaje(mensaje)}
                                    >
                                        Enviar Respuesta
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mensajes enviados */}
            <div>
                <h3>Mensajes Enviados</h3>
                {!isLoading && mensajesEnviados.length === 0 && <p>No has enviado mensajes.</p>}
                {!isLoading && mensajesEnviados.map((mensaje) => (
                    <div key={mensaje.Id} className="card mb-2">
                        <div className="card-body">
                            <p className="card-text"><strong>Para:</strong> {mensaje.Receptor_Id}</p>
                            <p className="card-text"><strong>Mensaje:</strong> {mensaje.Mensaje}</p>
                            {mensaje.Respuesta && (
                                <button className="btn btn-primary" onClick={() => seleccionarMensajeParaResponder(mensaje)}>Ver Respuesta</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Mensajes;
//respaldo