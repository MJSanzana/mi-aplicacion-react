const express = require('express');
const router = express.Router(); // Deberías usar 'router' en lugar de 'app'

const productosController = require('./controllers/productosController');
const productosVariantesController = require('./controllers/productosVariantesController');
const proveedoresProductosController = require('./controllers/proveedoresProductosController');

// Rutas para Productos
router.get('/Obtener', productosController.obtenerProductos);
router.post('/CreateProducts', productosController.crearProducto);

// Rutas para ProductosVariantes
router.get('/productosvariantes', productosVariantesController.obtenerVariantes);
router.post('/productosvariantes', productosVariantesController.crearVariante); 

// Rutas para ProveedoresProductos
router.get('/proveedoresproductos', proveedoresProductosController.obtenerProveedoresProductos);
router.post('/proveedoresproductos', proveedoresProductosController.crearProveedorProducto);

module.exports = router; 
