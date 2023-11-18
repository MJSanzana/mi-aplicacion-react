const express = require('express');
const app = express();
app.use(express.json());

const productosController = require('./controllers/productosController');
const productosVariantesController = require('./controllers/productosVariantesController');
const proveedoresProductosController = require('./controllers/proveedoresProductosController');


// Rutas para Productos
app.get('/productos', productosController.obtenerProductos);
app.post('/productos', productosController.crearProducto);
// Rutas para ProductosVariantes
app.get('/productosvariantes', productosVariantesController.obtenerVariantes);
app.post('/api/productosvariantes', productosVariantesController.crearVariante);


// Rutas para ProveedoresProductos
app.get('/proveedoresproductos', proveedoresProductosController.obtenerProveedoresProductos);
app.post('/proveedoresproductos', proveedoresProductosController.crearProveedorProducto);

