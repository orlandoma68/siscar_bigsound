const routerProductos = require('express').Router()

const upload = require('../config/configUpload')

const controllerProducto = require('../controllers/controllersProducto')
const { verificarToken, verificarAdmin } = require('../middlewares/auth')

routerProductos.get("/productos", controllerProducto.obtenerProductos)

routerProductos.get("/producto/:id", controllerProducto.obtenerProductoId)

routerProductos.get("/buscar", controllerProducto.obtenerProductosNombre)

routerProductos.get("/stats", controllerProducto.obtenerEstadisticas)

routerProductos.post("/registrar", verificarToken, verificarAdmin, upload.single('imagen'), controllerProducto.crearProducto)

routerProductos.put("/actualizar/:id", verificarToken, verificarAdmin, upload.single('imagen'), controllerProducto.actualizarProducto)

routerProductos.delete("/delete/:id", verificarToken, verificarAdmin, controllerProducto.eliminarProducto)

module.exports = routerProductos
