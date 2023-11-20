// colegioController.js
const multer = require('multer');
const db = require('../api/routes/db/db'); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
      const newName = `${Date.now()}-${file.originalname}`;
      const correctedName = newName.replace(/\\/g, '/');
      cb(null, correctedName);
  }
});

const upload = multer({ storage: storage });

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
  upload.single('imagen')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
          return res.status(500).json({ error: 'Error de Multer al cargar la imagen: ' + err.message });
      } else if (err) {
          return res.status(500).json({ error: 'Error al cargar la imagen: ' + err.message });
      }

      const { Nombre_Establecimiento, Direccion, Comuna } = req.body;
      const imagenPath = req.file ? req.file.path : null;

      try {
          const result = await db.query(
              'INSERT INTO colegio (Nombre_Establecimiento, Direccion, Comuna, Imagen) VALUES (?, ?, ?, ?)',
              [Nombre_Establecimiento, Direccion, Comuna, imagenPath]
          );
          res.status(201).json({ message: 'Colegio creado correctamente', colegioId: result.insertId });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al crear el colegio.' });
      }
  });
};