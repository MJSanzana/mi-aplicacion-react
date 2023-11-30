//import Producto from '../components/Producto';
import React from 'react';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Home({ changeView }) {
    const navigate = useNavigate();

    return (
        <div className="bg-light py-5">
            <main className="container">
                <section className="mb-5 text-center">
                    <h4 className="mt-3 display-4">Nuestra Colección de Uniformes</h4>
                    <p className="lead">Descubre una amplia variedad de uniformes escolares de calidad, diseñados especialmente para estudiantes de las 32 Comunas de la provincia de Santiago.</p>
                </section>

                <section className="row mb-5">
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <i className="fas fa-school fa-3x mb-3"></i>
                                <h3 className="card-title">Conocenos</h3>
                                <p className="card-text">Conoce más sobre nuestra historia, misión y visión. Somos más que un simple establecimiento, somos una comunidad.</p>
                                <img
                                    width="80"
                                    height="80"
                                    src="https://img.icons8.com/fluency/48/info.png"
                                    alt="Nosotros"
                                    onClick={() => changeView('Nosotros')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <i className="fas fa-headset fa-3x mb-3"></i>
                                <h3 className="card-title">Soporte</h3>
                                <p className="card-text">Estamos aquí para ayudarte. Si tienes alguna duda o problema, ¡no dudes en contactarnos!</p>
                                <a href="/Soporte"><img width="80" height="80" src="https://img.icons8.com/dusk/64/online-support--v1.png" alt="Soporte" /></a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <i className="fas fa-truck fa-3x mb-3"></i>
                                <h3 className="card-title">Seguimiento de pedido</h3>
                                <p className="card-text">¿Ansioso por tu nuevo uniforme? ¡Sigue tu pedido en tiempo real!</p>
                                <a href="/Seguimiento"><img width="80" height="80" src="https://img.icons8.com/cotton/64/track-order.png" alt="Seguimiento" /></a>
                            </div>
                        </div>
                    </div>
                    <p></p>
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <i className="fas fa-school fa-3x mb-3"></i>
                                <h3 className="card-title">Colegios</h3>
                                <p className="card-text">Búsqueda por Establecimientos Educacionales</p>
                                <img
                                    width="80"
                                    height="80"
                                    src="https://img.icons8.com/color/48/classroom.png"
                                    alt="Establecimientos"
                                    onClick={() => changeView('Colegios')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <i className="fas fa-truck fa-3x mb-3"></i>
                                <h3 className="card-title">Preguntas Frecuentes</h3>
                                <p className="card-text">Busqueda de Establecimiento Educacional por Comuna</p>
                                <a href="/PreguntasFrecuentes"><img width="80" height="80" src="https://img.icons8.com/color/48/faq.png" alt="PreguntasFrecuentas" /></a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
export default Home;