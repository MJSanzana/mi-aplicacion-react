const db = require('../api/routes/db/db');
const crypto = require('crypto');

exports.configurarProveedorPago = async (req, res) => {
    const { proveedor, claveAPI_Publica, claveAPI_Privada } = req.body;

    // Comprobar que los valores de entrada son válidos
    if (!proveedor || typeof claveAPI_Publica !== 'string' || typeof claveAPI_Privada !== 'string') {
        return res.status(400).json({ error: 'Los datos de entrada son incorrectos.' });
    }

    // Generar una clave de encriptación aleatoria de 32 bytes (256 bits)
    const encryptionKey = crypto.randomBytes(32);

    // Generar un vector de inicialización (IV) aleatorio de 16 bytes (128 bits)
    const encryptionIV = crypto.randomBytes(16);

    // Cifrar las claves API utilizando la clave de encriptación y el IV generados
    const encryptedPublic = crypto.createCipheriv('aes-256-ctr', encryptionKey, Buffer.from(encryptionIV));
    const encryptedPrivate = crypto.createCipheriv('aes-256-ctr', encryptionKey, Buffer.from(encryptionIV));

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
