// api/index.js
const express = require('express');
const router = express.Router();

const colegioController = require('../../controllers/colegioController');
const colegiosUsuariosController = require('../../controllers/colegiosUsuariosController');
const productosController = require('../../controllers/productosController');
const productosVariantesController = require('../../controllers/productosVariantesController');
const proveedoresProductosController = require('../../controllers/proveedoresProductosController');
const ticketsController = require('../../controllers/ticketsController');
const usuariosController = require('../../controllers/usuariosController'); 
const pedidosController = require('../../controllers/pedidosController');
const detallePedidosController = require('../../controllers/detallePedidosController');
const opinionesValoracionesController = require('../../controllers/opinionesValoracionesController');
const enviosController = require('../../controllers/enviosController');
const metodosPagoController = require('../../controllers/metodosPagoController');
const pagosController = require('../../controllers/pagosController');
const configuracionPagoController = require('../../controllers/configuracionPagoController');
const logPagosController = require('../../controllers/logPagosController');
const verificarAutenticacion = require('../../middlewares/verificarAutenticacion');
const mensajesController = require('../../controllers/mensajesController');
const carritoController = require ('../../controllers/carritoController');

//Obtener todos los colegios
router.get('/getAllColegios', colegioController.getAllColegios);
//Crear nuevo colegio
router.post('/createColegio', colegioController.createColegio);

//Ruta para asociar colegios a usuarios & viceversa
// Asociar un usuario con un colegio
router.post('/colegios/:colegioId/usuarios/:usuarioId', colegiosUsuariosController.asociarUsuarioConColegio);

// Obtener todos los colegios asociados a un usuario
router.get('/usuarios/:usuarioId/colegios', colegiosUsuariosController.obtenerColegiosPorUsuario);

// Obtener todos los usuarios asociados a un colegio
router.get('/colegios/:colegioId/usuarios', colegiosUsuariosController.obtenerUsuariosPorColegio);

// Rutas para Productos
router.get('/ObtenerProductos', productosController.obtenerProductos);
router.get('/ObtenerProductos/:userId', productosController.obtenerProductosPorProveedor);
router.get('/ObtenerProductoPorId/:id', productosController.obtenerProductoPorId);
router.post('/CreateProducts', productosController.crearProducto);
router.put('/aprobado/:id', productosController.updateProductApproval);
router.get('/productos/pendientes', productosController.getProductosPendientes);
router.patch('/aprobado/multiple', productosController.aprobarProductosMultiples);
router.patch('/productos/rechazar/:id', productosController.rechazarProducto);

// Rutas para ProductosVariantes
router.get('/productosvariantes', productosVariantesController.obtenerVariantes);
router.get('/obtenerVariantesPorProductoId/:productoId', productosVariantesController.obtenerVariantesPorProductoId);
router.post('/productosvariantes', productosVariantesController.crearVariante); 
router.put('/actualizarVariante', productosVariantesController.actualizarVariante);
router.put('/actualizarVarianteId/:producto_id', productosVariantesController.actualizarVarianteId);



// Rutas para ProveedoresProductos
router.get('/proveedoresproductos', proveedoresProductosController.obtenerProveedoresProductos);
router.post('/proveedoresproductos', proveedoresProductosController.crearProveedorProducto);
router.get('/proveedoresproductos/:userId', proveedoresProductosController.obtenerProductosPorProveedorId);
router.post('/proveedoresproductos/registrarVenta', proveedoresProductosController.registrarVentaAProveedor);
router.post('/proveedoresproductos/actualizarStockYNotificar', proveedoresProductosController.actualizarStockYNotificar);


// Rutas para crear ticket soporte
router.post('/createTicket', ticketsController.createTicket);
router.get('/getTickets', ticketsController.getTickets);

//Rutas de Usuarios
router.get('/getAllUsers', usuariosController.getAllUsers);
router.get('/Users/:id', usuariosController.getUserById); 
router.post('/CreateUser', usuariosController.createUser);
router.post('/Login', usuariosController.loginUser);
router.put('/EditUsers/:id', usuariosController.updateUser); 
router.post('/deactivate/:id', usuariosController.deactivateUser); 
router.post('/reactivate/:id', usuariosController.reactivateUser); 
router.put('/cambiar-contrasena/:id', usuariosController.changeUserPassword);

// Rutas para Pedidos
router.post('/pedidos', verificarAutenticacion,pedidosController.crearPedido);
router.get('/usuarios/:usuario_id/pedidos', pedidosController.obtenerPedidosUsuario);

// Rutas para Detalle de Pedidos
router.post('/detallepedidos', detallePedidosController.agregarDetallePedido);

// Rutas para Opiniones y Valoraciones
router.post('/crearOpinionValoracion', opinionesValoracionesController.crearOpinionValoracion);
router.get('/ResenasComentarios/:productoId', opinionesValoracionesController.obtenerReseñasPorProductoId);

// Rutas para Envíos
router.post('/envios', enviosController.crearEnvio);


// Rutas para Métodos de Pago
router.post('/metodospago', metodosPagoController.crearMetodoPago);
router.get('/metodospago', metodosPagoController.obtenerMetodosPago);

// Rutas para Pagos
router.post('/pagos', pagosController.registrarPago);
router.get('/pagos', verificarAutenticacion, pagosController.obtenerPagos);
router.post('/crearPagoSimulado', verificarAutenticacion,pagosController.crearPagoSimulado);

// Rutas para Configuración de Pagos
router.post('/configuracionpago', configuracionPagoController.configurarProveedorPago);
router.get('/configuracionpago', configuracionPagoController.obtenerConfiguracionPago);

// Rutas para Log de Pagos
router.post('/logpagos', logPagosController.registrarEventoPago);
router.get('/logpagos', logPagosController.obtenerLogPagos);

//Rutas para mensajeria 

router.get('/mensajes/usuario/:UsuarioId', mensajesController.obtenerMensajes);
router.put('/mensajes/marcar-leido/:mensajeId', mensajesController.marcarMensajeLeido);
router.post('/mensajes/crear', mensajesController.crearMensaje);
router.get('/mensajes/enviados/:emisorId', mensajesController.obtenerMensajesEnviados);

//Rutas de carrito
router.get('/carrito', verificarAutenticacion, carritoController.getCart);
router.post('/carrito/agregar', verificarAutenticacion, carritoController.addItemToCart);
router.delete('/carrito/eliminar/:itemId', verificarAutenticacion, carritoController.removeItemFromCart);

module.exports = router;