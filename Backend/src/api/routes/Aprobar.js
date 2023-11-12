const express = require('express');
const router = express.Router();
const db = require('../db/db');
const checkProductExists = (req, res, next) => {
   const productId = req.params.id;
   let sqlCheckProduct = 'SELECT * FROM productos WHERE id = ?';
   db.query(sqlCheckProduct, [productId], (err, results) => {
      if (err) {
         console.error('Error al verificar el producto:', err);
         return res.status(500).json({ message: 'Error interno del servidor al verificar el producto' });
      }
      if (!results.length) {
         return res.status(404).json({ message: 'Producto no encontrado' });
      }
      next();
   });
};
router.get('/getPendingProducts', (req, res) => {
   let sqlGetPendingProducts = 'SELECT * FROM productos WHERE estado = ?';
   db.query(sqlGetPendingProducts, ["pendiente"], (err, results) => {
      if (err) {
         console.error('Error al obtener productos pendientes:', err);
         return res.status(500).json({ message: 'Error interno del servidor al obtener productos pendientes' });
      }
      res.json(results);
   });
});
// Nueva funcionalidad para actualizar el estado del producto
router.put('/estado/:id', checkProductExists, (req, res) => {
   const productId = req.params.id;
   const estado = req.body.estado;
   if (!estado) {
      return res.status(400).json({ message: 'El estado es obligatorio' });
   }
   let sqlUpdateState = 'UPDATE productos SET estado = ? WHERE id = ?';
   db.query(sqlUpdateState, [estado, productId], (err) => {
      if (err) {
         console.error('Error al actualizar el estado del producto:', err);
         return res.status(500).json({ message: 'Error interno del servidor al actualizar el estado' });
      }
      res.json({ message: 'Estado del producto actualizado con éxito' });
   });
});
module.exports = router;