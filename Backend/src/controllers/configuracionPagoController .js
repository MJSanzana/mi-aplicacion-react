// controllers/configuracionPagoController.js
const db = require('../api/routes/db/db'); 
const crypto = require('crypto');

exports.configurarProveedorPago = async (req, res) => {
    const { proveedor, claveAPI_Publica, claveAPI_Privada } = req.body;

    // Asegúrate de que solo los administradores puedan acceder a este controlador

    // Cifrar las claves API antes de almacenarlas
    const encryptedPublic = crypto.createCipheriv('aes-256-ctr', process.env.ENCRYPTION_KEY, Buffer.from(process.env.ENCRYPTION_IV));
    const encryptedPrivate = crypto.createCipheriv('aes-256-ctr', process.env.ENCRYPTION_KEY, Buffer.from(process.env.ENCRYPTION_IV));
    
    const publicAPI = encryptedPublic.update(claveAPI_Publica, 'utf8', 'hex') + encryptedPublic.final('hex');
    const privateAPI = encryptedPrivate.update(claveAPI_Privada, 'utf8', 'hex') + encryptedPrivate.final('hex');

    try {
        const result = await db.query(
            'INSERT INTO ConfiguracionPago (Proveedor, ClaveAPI_Publica, ClaveAPI_Privada) VALUES (?, ?, ?)',
            [proveedor, publicAPI, privateAPI]
        );
        res.status(200).json({ message: "Configuración de pago creada con éxito", configuracionId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerConfiguracionPago = async (req, res) => {
    // Asegúrate de que solo los administradores puedan acceder a este controlador
    
    try {
        const configuraciones = await db.query('SELECT * FROM ConfiguracionPago');
        // No devolver las claves API en la respuesta
        const configuracionesSeguras = configuraciones.map(({ ClaveAPI_Publica, ClaveAPI_Privada, ...config }) => config);
        res.json(configuracionesSeguras);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
