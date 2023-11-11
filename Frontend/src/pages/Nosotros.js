import React from 'react';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nosotros.css';

function Nosotros() {
  return (
    <div>
      <main>
        <div className="container mt-5">
          <h1 className="text-center display-4 mb-4">Conócenos Más</h1>
          <hr />
          <div className="row justify-content-center">
            <div className="col-md-8">
              <h2 className="font-weight-bold mb-4 text-center">¡Bienvenido a Uniformes Escolares!</h2>
              <p className="lead text-center">
                Somos tu plataforma de confianza para la adquisición de uniformes escolares, brindando un servicio amigable y especializado para padres y apoderados.
              </p>
              <p className="text-center">
                En <strong>Uniformes Escolares</strong>, nos dedicamos a hacer tu vida más fácil. Nuestra misión es brindarte un proceso de compra que sea cómodo, rápido y, sobre todo, seguro.
              </p>
              <p className="text-center">
                Explora nuestro extenso catálogo y descubre la variedad de uniformes de la más alta calidad. Nos ajustamos a las necesidades de cada institución educativa, ofreciendo diferentes tallas, colores y estilos.
              </p>
              <p className="text-center">
                ¿Necesitas ayuda o tienes alguna pregunta? Nuestro comprometido equipo de atención al cliente está siempre disponible para asistirte. No dudes en ponerte en contacto con nosotros; será un placer ayudarte.
              </p>
              <p className="font-weight-bold text-center">¡Te agradecemos por preferirnos y estamos emocionados de servirte!</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Nosotros;


