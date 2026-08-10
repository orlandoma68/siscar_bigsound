const routerPedidos = require('express').Router()

const controllerPedido = require('../controllers/controllersPedido')
const { verificarToken, verificarAdmin } = require('../middlewares/auth')

routerPedidos.post("/", verificarToken, controllerPedido.crearPedido)

routerPedidos.get("/mios", verificarToken, controllerPedido.misPedidos)

routerPedidos.get("/", verificarToken, verificarAdmin, controllerPedido.listarPedidos)

routerPedidos.get("/:id", verificarToken, controllerPedido.detallePedido)

routerPedidos.put("/:id/estado", verificarToken, verificarAdmin, controllerPedido.actualizarEstado)

module.exports = routerPedidos
