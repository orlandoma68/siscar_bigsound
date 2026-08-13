const routerUsuarios = require('express').Router()

const controllerUsuario = require('../controllers/controllersUsuario')
const { verificarToken, verificarAdmin } = require('../middlewares/auth')

routerUsuarios.post("/registrar", controllerUsuario.registrarUsuario)

routerUsuarios.post("/login", controllerUsuario.loginUsuario)

routerUsuarios.post("/sincronizar-google", controllerUsuario.sincronizarGoogle)

routerUsuarios.post("/olvidar-password", controllerUsuario.olvidarPassword)

routerUsuarios.post("/restablecer-password", controllerUsuario.restablecerPassword)

routerUsuarios.get("/me", verificarToken, controllerUsuario.me)

routerUsuarios.get("/verificar-rol", controllerUsuario.verificarRol)

routerUsuarios.put("/actualizar/:id", controllerUsuario.actualizarUsuario)

routerUsuarios.delete("/delete/:id", controllerUsuario.eliminarUsuario)

routerUsuarios.get("/listar", verificarToken, verificarAdmin, controllerUsuario.listarUsuarios)

routerUsuarios.put("/:id/rol", verificarToken, verificarAdmin, controllerUsuario.cambiarRolUsuario)

module.exports = routerUsuarios
