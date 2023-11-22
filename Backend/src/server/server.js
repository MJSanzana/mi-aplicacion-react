// Importaciones
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('../api/routes/db/db');
const jwt = require('jsonwebtoken'); 

const verificarAutenticacion = require('../middlewares/verificarAutenticacion');


// Configuración de la app
const app = express();
const PORT = process.env.PORT || 5000;

// Si estás detrás de un proxy (como Nginx o Heroku), confía en él:
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde el directorio 'uploads'
app.use('/uploads', express.static('uploads'));

app.use(express.static('public'));

// Configuración de CORS
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    // ... otras opciones de CORS si las necesitas
}));

// Configuración de Middlewares
app.use(express.json());

//app.use(express.static(path.join(__dirname, 'public')));

// Función authenticateJWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

// Añadido: Importa y usa las rutas del archivo 'index.js'
const apiRoutes = require('../api/routes/index'); 
app.use('/api', apiRoutes);

// Inicializar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});
