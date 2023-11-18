// colegioController.js
const db = require('../api/routes/db/db'); 

exports.getAllColegios = async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM colegio');
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los colegios.' });
  }
};

exports.createColegio = async (req, res) => {
  const { Nombre_Establecimiento, Direccion, Comuna, Imagen } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO colegio (Nonbre_Establecimiento, Direccion, Comuna, Imagen) VALUES (?, ?, ?, ?)',
      [Nombre_Establecimiento, Direccion, Comuna, Imagen]
    );
    res.status(201).json({ message: 'Colegio creado correctamente', colegioId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el colegio.' });
  }
};
