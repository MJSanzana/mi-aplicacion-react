//productosController.js
const multer = require('multer');
const db = require('../api/routes/db/db');
const {pool, query} = require ('../api/routes/db/db')

// Configuración de Multer para almacenar imágenes en el servidor
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

// Función para generar un nuevo SKU
function generarNuevoSKU(ultimoSKU) {
    let numero = parseInt(ultimoSKU.replace('UNI', '')) + 1;
    return 'UNI' + numero.toString().padStart(5, '0');
}

exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await db.query('SELECT * FROM Productos');
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Función modificada para crear producto con carga de imagen
exports.crearProducto = async (req, res) => {
    upload.single('imagen')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Error de Multer al cargar la imagen: ' + err.message });
        } else if (err) {
            return res.status(500).json({ error: 'Error al cargar la imagen: ' + err.message });
        }

        // Si llegamos aquí, no hay error y la imagen se ha cargado correctamente
        const { nombre, descripcion, genero, precio } = req.body;
        const imagen = req.file ? req.file.path : null;
        const aprobado = 0; // Suponiendo que el producto no está aprobado inicialmente
        const estado = 'activo'; // El estado inicial de tu producto

        try {
            const ultimoSKUResult = await db.query('SELECT SKU FROM Productos ORDER BY SKU DESC LIMIT 1');
            let ultimoSKU = ultimoSKUResult[0] ? ultimoSKUResult[0].SKU : 'UNI00000';
            let nuevoSKU = generarNuevoSKU(ultimoSKU);

            const result = await db.query('INSERT INTO Productos (Nombre, Descripcion, Genero, Precio, Imagen, Aprobado, Estado, SKU) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [nombre, descripcion, genero, precio, imagen, aprobado, estado, nuevoSKU]);

            res.status(200).json({ id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
exports.updateProductApproval = async (req, res) => {
    const productId = req.params.id;
    const { aprobado } = req.body; // Cambia 'estado' por 'aprobado' para que coincida con tu campo de base de datos
    
    // Verificar que 'aprobado' es un valor válido (0 o 1)
    if (aprobado !== 0 && aprobado !== 1) {
        return res.status(400).json({ message: 'El valor de aprobación es inválido' });
    }
    
    let sqlUpdateApproval = 'UPDATE productos SET Aprobado = ? WHERE id = ?';
    
    try {
        await db.query(sqlUpdateApproval, [aprobado, productId]);
        res.json({ message: 'Aprobación del producto actualizada con éxito' });
    } catch (err) {
        console.error('Error al actualizar la aprobación del producto:', err);
        return res.status(500).json({ message: 'Error interno del servidor al actualizar la aprobación' });
    }
};
exports.getProductosPendientes = async (req, res) => {
    let sqlQuery = 'SELECT * FROM productos WHERE Aprobado = 0';

    try {
        const productosPendientes = await db.query(sqlQuery);
        res.json(productosPendientes);
    } catch (err) {
        console.error('Error al obtener los productos pendientes:', err);
        return res.status(500).json({ message: 'Error interno del servidor al obtener los productos pendientes' });
    }
};
exports.obtenerProductosPorProveedor = async (req, res) => {
    const proveedorId = req.params.userId;

    try {
        const sqlQuery = 'SELECT p.* FROM Productos p INNER JOIN ProveedoresProductos pp ON p.id = pp.producto_id WHERE pp.proveedor_id = ?';
        const productos = await db.query(sqlQuery, [proveedorId]);

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.aprobarProductosMultiples = async (req, res) => {
    try {
        const { productosIds } = req.body; // Supongamos que envías un array de IDs de productos a aprobar

        if (!productosIds || !Array.isArray(productosIds) || productosIds.length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron productos para aprobar.' });
        }

        const productosToUpdate = [];

        // Verifica si los productos existen y si no están aprobados
        for (const productoId of productosIds) {
            const producto = await db.query('SELECT * FROM Productos WHERE id = ? AND Aprobado = 0', [productoId]);
            if (producto.length === 1) {
                productosToUpdate.push(productoId);
            }
        }

        if (productosToUpdate.length === 0) {
            return res.status(400).json({ error: 'No se encontraron productos válidos para aprobar.' });
        }

        // Realiza la actualización de aprobación en la base de datos
        const sqlUpdate = 'UPDATE Productos SET Aprobado = 1 WHERE id IN (?)';
        await db.query(sqlUpdate, [productosToUpdate]);

        // Responde con un mensaje de éxito
        return res.status(200).json({ message: 'Productos aprobados exitosamente.' });
    } catch (error) {
        console.error("Error durante la aprobación de múltiples productos:", error);
        return res.status(500).json({ error: 'Error durante la aprobación de los productos.' });
    }
};

exports.rechazarProducto = async (req, res) => {
    const Producto_Id = req.params.id;
    const { Mensaje, Emisor_Id } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error obteniendo conexión:', err);
            return res.status(500).json({ error: 'Error interno del servidor al obtener conexión.' });
        }

        connection.beginTransaction(async (err) => {
            if (err) {
                connection.release();
                console.error('Error comenzando transacción:', err);
                return res.status(500).json({ error: 'Error interno del servidor al comenzar transacción.' });
            }

            try {
                // Marcar el producto como rechazado
                const sqlProductoRechazado = 'UPDATE Productos SET Aprobado = ?, Estado = ? WHERE Id = ?';
                await query(sqlProductoRechazado, [0, 'rechazado', Producto_Id]);
                
                // Encuentra el ID del proveedor asociado con el producto
                const sqlProveedor = 'SELECT Proveedor_Id FROM ProveedoresProductos WHERE Producto_Id = ?';
                const proveedorResult = await query(sqlProveedor, [Producto_Id]);
                if (proveedorResult.length === 0) {
                    throw new Error('Proveedor no encontrado para el producto.');
                }
                const Receptor_Id = proveedorResult[0].Proveedor_Id;

                // Insertar el mensaje en la tabla de mensajes
                const sqlInsertMensaje = 'INSERT INTO Mensajes (Emisor_Id, Receptor_Id, Producto_Id, Mensaje, Leido) VALUES (?, ?, ?, ?, ?)';
                await query(sqlInsertMensaje, [Emisor_Id, Receptor_Id, Producto_Id, Mensaje, 0]);

                // Commit the transaction
                connection.commit((err) => {
                    if (err) {
                        connection.rollback(() => {
                            connection.release();
                        });
                        console.error('Error haciendo commit de transacción:', err);
                        return res.status(500).json({ error: 'Error interno del servidor al hacer commit de transacción.' });
                    }

                    connection.release();
                    res.status(200).json({ message: 'Producto rechazado y mensaje enviado al proveedor.' });
                });
            } catch (error) {
                // Si hay un error, rollback de la transacción
                connection.rollback(() => {
                    connection.release();
                });
                console.error('Error en la transacción:', error);
                res.status(500).json({ error: error.message });
            }
        });
    });
};
