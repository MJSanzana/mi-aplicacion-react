// carritoController.js
const db = require('../api/routes/db/db');

exports.getCart = async (req, res) => {
    // Obtén el ID del usuario o el ID de sesión desde la sesión o token
    const userId = req.usuario ? req.usuario.id : null;
    const sessionId = req.session.id; // Asumiendo que estás utilizando sesiones

    try {
        let cartItems;
        if (userId) {
            // Lógica para obtener los ítems del carrito del usuario registrado
            cartItems = await db.query('SELECT * FROM Carrito WHERE Usuario_Id = ?', [userId]);
        } else {
            // Lógica para obtener los ítems del carrito del usuario no registrado
            cartItems = await db.query('SELECT * FROM Carrito WHERE Session_Id = ?', [sessionId]);
        }
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addItemToCart = async (req, res) => {
    // Datos del ítem que deseas agregar al carrito
    const { productoId, cantidad } = req.body;
    const userId = req.usuario ? req.usuario.id : null;
    const sessionId = req.session.id; // Asumiendo que estás utilizando sesiones

    try {
        // Lógica para agregar el ítem al carrito en la base de datos
        const columns = userId ? '(Usuario_Id, Producto_Id, Cantidad)' : '(Session_Id, Producto_Id, Cantidad)';
        const values = userId ? [userId, productoId, cantidad] : [sessionId, productoId, cantidad];
        
        await db.query(`INSERT INTO Carrito ${columns} VALUES (?, ?, ?)`, values);
        res.status(200).json({ message: 'Ítem agregado al carrito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeItemFromCart = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.usuario ? req.usuario.id : null;
    const sessionId = req.session.id; // Asumiendo que estás utilizando sesiones

    try {
        // Lógica para eliminar el ítem del carrito en la base de datos
        if (userId) {
            await db.query('DELETE FROM Carrito WHERE Id = ? AND Usuario_Id = ?', [itemId, userId]);
        } else {
            await db.query('DELETE FROM Carrito WHERE Id = ? AND Session_Id = ?', [itemId, sessionId]);
        }
        res.status(200).json({ message: 'Ítem eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


