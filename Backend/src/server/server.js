require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const verificarAutenticacion = require('../middlewares/verificarAutenticacion');
const verificarSesion = require('../middlewares/verificarSesion');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000', // Aquí especificas el origen que deseas permitir
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Incluye 'OPTIONS' en los métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Especifica los encabezados permitidos
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Middleware para autenticar token
app.use(verificarAutenticacion);

// Middleware para manejar sesiones
app.use(verificarSesion);

// Rutas
const apiRoutes = require('../api/routes/index');
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
