import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FAQ = () => {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Preguntas Frecuentes</h2>
      <div className="accordion" id="faqAccordion">

        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
              ¿Cuánto tiempo tarda el envío?
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
            <div className="accordion-body">
              El tiempo de envío estándar es de 5-7 días hábiles. Sin embargo, durante temporadas altas, como el regreso a clases, puede haber demoras. Te recomendamos hacer tu pedido con anticipación.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
              ¿Puedo personalizar el uniforme con bordados o logos?
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
            <div className="accordion-body">
              Sí, ofrecemos servicios de personalización para pedidos especiales. Hay un costo adicional por la personalización. Para más detalles, visita nuestra sección de personalización o contacta con nuestro equipo.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTree">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTree" aria-expanded="true" aria-controls="collapseTree">
              ¿Es posible realizar cambios o devoluciones si la talla no es correcta?
            </button>
          </h2>
          <div id="collapseTree" className="accordion-collapse collapse" aria-labelledby="headingTree" data-bs-parent="#faqAccordion">
            <div className="accordion-body">
              Claro, ofrecemos una política de devoluciones de 30 días. Si necesitas cambiar la talla o el producto, contáctanos para gestionarlo.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="headingFour">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
              ¿Qué hago si el uniforme que recibí tiene un defecto de fábrica?
            </button>
          </h2>
          <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
            <div className="accordion-body">
              Si recibiste un uniforme con un defecto, por favor contáctanos de inmediato. Te proporcionaremos instrucciones para la devolución y nos encargaremos de enviarte un reemplazo o realizar el reembolso correspondiente.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FAQ;



