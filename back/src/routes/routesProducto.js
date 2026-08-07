const routerProductos = require('express').Router()

const upload = require('../config/configUpload')

const controllerProducto = require('../controllers/controllersProducto')

routerProductos.get("/productos", controllerProducto.obtenerProductos)

routerProductos.get("/producto/:id", controllerProducto.obtenerProductoId)

routerProductos.get("/producto/buscar", controllerProducto.obtenerProductosNombre)

routerProductos.get("/stats", controllerProducto.obtenerEstadisticas)

routerProductos.post("/registrar", upload.single('imagen'), controllerProducto.crearProducto)

routerProductos.put("/actualizar/:id", upload.single('imagen'), controllerProducto.actualizarProducto)

routerProductos.delete("/delete/:id", controllerProducto.eliminarProducto)

module.exports = routerProductos
