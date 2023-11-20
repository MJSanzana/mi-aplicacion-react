import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente Colegio
function Colegio({ Nombre_Establecimiento, Direccion, Comuna, Imagen }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img src={Imagen || "https://via.placeholder.com/150"} alt={`Imagen de ${Nombre_Establecimiento}`} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{Nombre_Establecimiento}</h5>
          <p className="card-text">{Direccion}</p>
          <p className="card-text"><small className="text-muted">{Comuna}</small></p>
        </div>
      </div>
    </div>
  );
}

// Componente de Búsqueda
function Busqueda({ onSearch }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar colegio..."
        onChange={(event) => onSearch(event.target.value)}
      />
    </div>
  );
}

// Componente principal Colegios
export default function Colegios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [colegios, setColegios] = useState([]);

  useEffect(() => {
    const fetchColegios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getAllColegios');
        setColegios(response.data);
      } catch (error) {
        console.error("Error al obtener los colegios:", error);
      }
    };

    fetchColegios();
  }, []);

  const filteredColegios = colegios.filter(
    colegio => colegio.Nombre_Establecimiento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <Busqueda onSearch={setSearchTerm} />
      <div className="row">
        {filteredColegios.length ? (
          filteredColegios.map((colegio) => (
            <Colegio key={colegio.id} {...colegio} />
          ))
        ) : (
          <p>No se encontraron colegios.</p>
        )}
      </div>
    </div>
  );
}
