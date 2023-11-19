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
router.post('/CreateProducts', productosController.crearProducto);
router.put('/aprobado/:id', productosController.updateProductApproval);
router.get('/productos/pendientes', productosController.getProductosPendientes);

// Rutas para ProductosVariantes
router.get('/productosvariantes', productosVariantesController.obtenerVariantes);
router.post('/productosvariantes', productosVariantesController.crearVariante); 

// Rutas para ProveedoresProductos
router.get('/proveedoresproductos', proveedoresProductosController.obtenerProveedoresProductos);
router.post('/proveedoresproductos', proveedoresProductosController.crearProveedorProducto);

// Rutas para crear ticket soporte
router.post('/createTicket', ticketsController.createTicket);
router.get('/getTickets', ticketsController.getTickets);

//Rutas de Usuarios
// Obtener todos los usuarios
router.get('/getAllUsers', usuariosController.getAllUsers);

// Obtener un usuario específico por ID
router.get('/Users/:id', usuariosController.getUserById); 

// Crear un nuevo usuario
router.post('/CreateUser', usuariosController.createUser);

// Iniciar sesión
router.post('/Login', usuariosController.loginUser);

// Actualizar un usuarios
router.put('/EditUsers/:id', usuariosController.updateUser); 

// Ruta para desactivar un usuario
router.post('/deactivate/:id', usuariosController.deactivateUser); 

// Ruta para reactivar un usuario
router.post('/reactivate/:id', usuariosController.reactivateUser); 

// Rutas para Pedidos
router.post('/pedidos', pedidosController.crearPedido);
router.get('/usuarios/:usuario_id/pedidos', pedidosController.obtenerPedidosUsuario);

// Rutas para Detalle de Pedidos
router.post('/detallepedidos', detallePedidosController.agregarDetallePedido);

// Rutas para Opiniones y Valoraciones
router.post('/opinionesvaloraciones', opinionesValoracionesController.crearOpinionValoracion);

// Rutas para Envíos
router.post('/envios', enviosController.crearEnvio);


// Rutas para Métodos de Pago
router.post('/metodospago', metodosPagoController.crearMetodoPago);
router.get('/metodospago', metodosPagoController.obtenerMetodosPago);

// Rutas para Pagos
router.post('/pagos', pagosController.registrarPago);
router.get('/pagos', verificarAutenticacion, pagosController.obtenerPagos);

// Rutas para Configuración de Pagos
router.post('/configuracionpago', configuracionPagoController.configurarProveedorPago);
router.get('/configuracionpago', configuracionPagoController.obtenerConfiguracionPago);

// Rutas para Log de Pagos
router.post('/logpagos', logPagosController.registrarEventoPago);
router.get('/logpagos', logPagosController.obtenerLogPagos);

module.exports = router;