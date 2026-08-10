const routerContactos = require('express').Router()

const controllerContacto = require('../controllers/controllersContacto')
const { verificarToken, verificarAdmin } = require('../middlewares/auth')

routerContactos.post("/", controllerContacto.crearContacto)

routerContactos.get("/no-leidos", verificarToken, verificarAdmin, controllerContacto.contactosNoLeidos)

routerContactos.get("/", verificarToken, verificarAdmin, controllerContacto.listarContactos)

routerContactos.put("/:id/estado", verificarToken, verificarAdmin, controllerContacto.actualizarEstado)

routerContactos.delete("/:id", verificarToken, verificarAdmin, controllerContacto.eliminarContacto)

module.exports = routerContactos
