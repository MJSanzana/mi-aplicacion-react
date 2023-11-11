import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente Establecimiento
function Establecimiento({ id, establecimiento, enlace, imagen }) {
  return (
    <div className="col-md-3 mb-3">
      <div className="card h-100 shadow-sm">
        <div className="card-body text-center">
          <h5 className="card-title">{establecimiento}</h5>
          <a href={enlace}>
            {imagen 
              ? <img width="90" height="90" src={imagen} alt={`Imagen de ${establecimiento}`} />
              : <img width="80" height="80" src="https://img.icons8.com/fluency/48/info.png" alt={`Información de ${establecimiento}`} />
            }
          </a>
        </div>
      </div>
    </div>
  );
}

// Componente de Filtro y Búsqueda
function FiltroBusqueda({ onSearch }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Escribe el nombre de tu colegio"
        onChange={(event) => onSearch(event.target.value)}
      />
    </div>
  );
}

// Componente principal Establecimientos
export default function Establecimientos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [establecimientosData, setEstablecimientosData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    axios.get('http://localhost:5000/api/Establecimiento')
      .then((response) => {
        if (isMounted) {
          setEstablecimientosData(response.data);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Hubo un error obteniendo los establecimientos:", error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredData = establecimientosData.filter(
    (est) => est.establecimiento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <FiltroBusqueda onSearch={(value) => setSearchTerm(value)} />

      <section className="row mb-5">
        {filteredData.map((est) => (
          <Establecimiento key={est.id} {...est} />
        ))}
      </section>
    </div>
  );
}

