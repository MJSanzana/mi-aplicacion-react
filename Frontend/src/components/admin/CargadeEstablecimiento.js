import React, { useState } from 'react';
import axios from 'axios';

function CargaDeEstablecimiento() {
    const [file, setFile] = useState(null);
    const [establecimiento, setEstablecimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [comuna, setComuna] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onUpload = () => {
        if (!file || !establecimiento) {
            setMessage('Por favor, rellene todos los campos requeridos y seleccione una imagen.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('imagen', file);
        formData.append('establecimiento', establecimiento);
        if (direccion) formData.append('direccion', direccion);
        if (comuna) formData.append('comuna', comuna);

        axios.post('http://localhost:5000/api/Establecimiento', formData)
            .then((response) => {
                setMessage("Archivo cargado con éxito!");
                setFile(null);
                setEstablecimiento('');
                setDireccion('');
                setComuna('');
                setImageUrl('');
            })
            .catch((error) => {
                setMessage("Error al cargar el archivo: " + (error.response?.data.message || error.message));
            })
            .finally(() => {
                setIsUploading(false);
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Carga de Establecimientos Educacionales</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <div className="mb-3">
                <input className="form-control" type="text" placeholder="Establecimiento" value={establecimiento} onChange={e => setEstablecimiento(e.target.value)} />
            </div>
            <div className="mb-3">
                <input className="form-control" type="text" placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="comuna" className="form-label">Comuna</label>
                <select id="comuna" className="form-control" value={comuna} onChange={(e) => setComuna(e.target.value)}>
                    <option value="">-- Selecciona una Comuna --</option>
                    <option value="Cerrillos">Cerrillos</option>
                    <option value="Cerro Navia">Cerro Navia</option>
                    <option value="Conchali">Conchali</option>
                    <option value="El Bosque">El Bosque</option>
                    <option value="Estación Central">Estación Central</option>
                    <option value="Huechuraba">Huechuraba</option>
                    <option value="Independencia">Independencia</option>
                    <option value="La Cisterna">La Cisterna</option>
                    <option value="La Florida">La Florida</option>
                    <option value="La Granja">La Granja</option>
                    <option value="La Pintana">La Pintana</option>
                    <option value="La Reina">La Reina</option>
                    <option value="Las Condes">Las Condes</option>
                    <option value="Lo Barnechea">Lo Barnechea</option>
                    <option value="Lo Espejo">Lo Espejo</option>
                    <option value="Lo Prado">Lo Prado</option>
                    <option value="Macul">Macul</option>
                    <option value="Maipu">Maipu</option>
                    <option value="Ñuñoa">Ñuñoa</option>
                    <option value="Pedro Aguirre Cerda">Pedro Aguirre Cerda</option>
                    <option value="Peñalolen">Peñalolen</option>
                    <option value="Providencia">Providencia</option>
                    <option value="Pudahuel">Pudahuel</option>
                    <option value="Quilicura">Quilicura</option>
                    <option value="Quinta Normal">Quinta Normal</option>
                    <option value="Recoleta">Recoleta</option>
                    <option value="Renca">Renca</option>
                    <option value="San Joaquin">San Joaquín</option>
                    <option value="San Miguel">San Miguel</option>
                    <option value="San Ramón">San Ramón</option>
                    <option value="Santiago">Santiago</option>
                    <option value="Vitacura">Vitacura</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Imagen del establecimiento:</label>
                <input className="form-control" type="file" onChange={onFileChange} />
            </div>
            <div className="mb-3">
            <button className="btn btn-primary" onClick={onUpload} disabled={isUploading}>
                    {isUploading ? 'Subiendo...' : 'Subir'}
                </button>
            </div>
            {imageUrl && <div className="text-center"><img src={imageUrl} alt="Imagen del establecimiento" className="img-fluid" style={{ maxWidth: '400px' }} /></div>}
        </div>
    );
}

export default CargaDeEstablecimiento;


