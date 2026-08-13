const bcrypt = require('bcryptjs')
const usuarioModelo = require('../models/modelsUsuario')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const { enviarCorreoRestablecimiento } = require('../services/emailService')

const rolNuevoUsuario = (email) => {
    const emailNormalizado = String(email || '').trim().toLowerCase()
    const dominio = emailNormalizado.split('@')[1] || ''

    const emailsAdmin = (process.env.ADMIN_EMAIL || '')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean)

    const dominiosAdmin = (process.env.ADMIN_DOMAIN || '')
        .split(',')
        .map(d => d.trim().toLowerCase().replace(/^@/, ''))
        .filter(Boolean)

    const esAdmin = emailsAdmin.includes(emailNormalizado) || dominiosAdmin.includes(dominio)
    return esAdmin ? 1 : 2
}

const registrarUsuario = async (req, res) => {
    const { nombre, email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ ok: false, message: "Email y password son requeridos" })
        }
        const verificarUsuario = await usuarioModelo.obtenerUsuarioEmail(email)
        if (verificarUsuario) {
            return res.status(400).json({ ok: false, message: "El usuario ya existe en la BD" })
        }
        const salt = await bcrypt.genSalt(5)
        const hashPassword = await bcrypt.hash(password, salt)
        const rol_id = rolNuevoUsuario(email)
        const nuevoUsuario = await usuarioModelo.crearUsuario({
            nombre: nombre || email.split('@')[0],
            email,
            password: hashPassword,
            rol_id
        })

        return res.status(201).send({
            ok: true,
            message: "Usuario registrado exitosamente",
            redirect: "/auth/login",
            rol: rol_id === 1 ? 'ADMIN' : 'CLIENT'
        })
    } catch (error) {
        console.error('Error en registro:', error.message);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
}

const loginUsuario = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ ok: false, message: "Se requiere email y password" })
    }
    try {
        const verificarUsuario = await usuarioModelo.obtenerUsuarioEmail(email)
        if (!verificarUsuario) {
            return res.status(400).send({ ok: false, message: "Credenciales invalidos." })
        }
        const verificoPassword = await bcrypt.compare(password, verificarUsuario.password)
        if (!verificoPassword) {
            return res.status(400).send({ ok: false, message: "Credenciales invalidos" })
        }

        const payload = {
            id: verificarUsuario.id,
            email: verificarUsuario.email,
            rol: verificarUsuario.rol
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP })

        return res.status(200).send({
            ok: true,
            message: "Usuario logueado",
            token,
            usuario: {
                id: verificarUsuario.id,
                nombre: verificarUsuario.nombre,
                email: verificarUsuario.email,
                rol: verificarUsuario.rol
            }
        })
    } catch (error) {
        console.error('Error en login:', error.message);
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' });
    }
}

const sincronizarGoogle = async (req, res) => {
    const { email, nombre } = req.body;
    if (!email) {
        return res.status(400).send({ ok: false, message: "Email requerido" })
    }
    try {
        let usuario = await usuarioModelo.obtenerUsuarioEmail(email)

        if (!usuario) {
            const salt = await bcrypt.genSalt(5)
            const fakePassword = await bcrypt.hash("google-auth-" + Date.now(), salt)
            const rol_id = rolNuevoUsuario(email)
            const nuevoUsuario = await usuarioModelo.crearUsuario({
                nombre: nombre || email.split('@')[0],
                email,
                password: fakePassword,
                rol_id
            })
            usuario = {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: rol_id === 1 ? 'ADMIN' : 'CLIENT'
            }
        }

        const payload = {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP })

        return res.status(200).send({
            ok: true,
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        })
    } catch (error) {
        console.error('Error en sincronizar-google:', error.message);
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' });
    }
}

const me = async (req, res) => {
    try {
        const usuario = await usuarioModelo.obtenerUsuarioId(req.usuario.id)
        if (!usuario) {
            return res.status(404).send({ ok: false, message: "Usuario no encontrado" })
        }
        return res.status(200).send({
            ok: true,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        })
    } catch (error) {
        console.error('Error en /me:', error.message);
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' });
    }
}

const verificarRol = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).send({ ok: false, message: "email requerido" })
        }
        const buscarUsuario = await usuarioModelo.obtenerUsuarioEmail(email)
        if (!buscarUsuario) {
            return res.status(200).send({ ok: true, existe: false, rol: null })
        }
        return res.status(200).send({
            ok: true,
            existe: true,
            rol: buscarUsuario.rol,
            usuario: {
                id: buscarUsuario.id,
                nombre: buscarUsuario.nombre,
                email: buscarUsuario.email,
                rol: buscarUsuario.rol
            }
        })
    } catch (error) {
        console.error('Error al verificar rol:', error.message);
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' });
    }
}

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params
        const { email } = req.body
        await usuarioModelo.actualizarUsuario({ id, email })
        return res.status(200).send({ ok: true, message: "Usuario actualizado en la BD" })
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' });
    }
}

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params
        await usuarioModelo.eliminarUsuario(id)
        return res.status(200).send({ ok: true, message: "Usuario eliminado de la BD" })
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' });
    }
}

const olvidarPassword = async (req, res) => {
    const { email } = req.body
    try {
        if (!email) {
            return res.status(400).send({ ok: false, message: "Email requerido" })
        }

        const usuario = await usuarioModelo.obtenerUsuarioEmail(email)
        const respuesta = { ok: true, message: "Si el email existe, recibiras un enlace para restablecer tu contrasena." }
        if (!usuario) {
            return res.status(200).send(respuesta)
        }

        const token = jwt.sign(
            { id: usuario.id, tipo: 'reset' },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        )
        const frontUrl = process.env.FRONT_URL || 'http://localhost:5173'
        const link = `${frontUrl}/auth/lostpass?token=${token}`

        const resultado = await enviarCorreoRestablecimiento({ to: usuario.email, link })
        if (resultado.modoDev) {
            respuesta.enlace = link
        }
        return res.status(200).send(respuesta)
    } catch (error) {
        console.error('Error en olvidar-password:', error.message)
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' })
    }
}

const restablecerPassword = async (req, res) => {
    const { token, password } = req.body
    try {
        if (!token || !password) {
            return res.status(400).send({ ok: false, message: "Token y contrasena son requeridos" })
        }
        if (password.length < 6) {
            return res.status(400).send({ ok: false, message: "La contrasena debe tener al menos 6 caracteres" })
        }

        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            return res.status(400).send({ ok: false, message: "Enlace invalido o expirado" })
        }
        if (!decoded.id || decoded.tipo !== 'reset') {
            return res.status(400).send({ ok: false, message: "Enlace invalido o expirado" })
        }

        const usuario = await usuarioModelo.obtenerUsuarioId(decoded.id)
        if (!usuario) {
            return res.status(400).send({ ok: false, message: "Enlace invalido o expirado" })
        }

        const salt = await bcrypt.genSalt(5)
        const hashPassword = await bcrypt.hash(password, salt)
        await usuarioModelo.actualizarPassword({ id: usuario.id, password: hashPassword })

        return res.status(200).send({ ok: true, message: "Contrasena actualizada exitosamente" })
    } catch (error) {
        console.error('Error en restablecer-password:', error.message)
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' })
    }
}

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModelo.obtenerUsuarios()
        return res.status(200).send({ ok: true, data: usuarios })
    } catch (error) {
        console.error('Error al listar usuarios:', error.message);
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' });
    }
}

const cambiarRolUsuario = async (req, res) => {
    try {
        const { id } = req.params
        const { rol_id } = req.body

        if (!rol_id) {
            return res.status(400).send({ ok: false, message: "El rol_id es requerido" })
        }

        const rolDestino = await usuarioModelo.obtenerRol(rol_id)
        if (!rolDestino) {
            return res.status(400).send({ ok: false, message: "El rol indicado no existe en el sistema" })
        }

        const usuario = await usuarioModelo.obtenerUsuarioId(id)
        if (!usuario) {
            return res.status(404).send({ ok: false, message: "Usuario no encontrado" })
        }

        if (Number(usuario.id) === Number(req.usuario.id)) {
            return res.status(400).send({ ok: false, message: "No puedes cambiar tu propio rol" })
        }

        if (usuario.rol === 'ADMIN' && rolDestino.roles !== 'ADMIN') {
            const totalAdmins = await usuarioModelo.contarAdmins()
            if (totalAdmins <= 1) {
                return res.status(400).send({ ok: false, message: "No se puede revocar el rol del unico administrador del sistema" })
            }
        }

        await usuarioModelo.actualizarRol({ id: usuario.id, rol_id: rolDestino.id })

        const accion = rolDestino.roles === 'ADMIN' ? 'promover' : 'revocar'
        await usuarioModelo.registrarAuditoriaRol({
            usuario_id: req.usuario.id,
            email: req.usuario.email,
            usuario_modificado_id: usuario.id,
            rol_anterior: usuario.rol,
            rol_nuevo: rolDestino.roles,
            accion
        })

        const mensaje = rolDestino.roles === 'ADMIN'
            ? `"${usuario.email}" promovido a ADMIN exitosamente`
            : `"${usuario.email}" revocado a CLIENT exitosamente`

        return res.status(200).send({ ok: true, message: mensaje })
    } catch (error) {
        console.error('Error al cambiar rol de usuario:', error.message);
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' });
    }
}

module.exports = {
    registrarUsuario,
    loginUsuario,
    sincronizarGoogle,
    me,
    verificarRol,
    olvidarPassword,
    restablecerPassword,
    eliminarUsuario,
    actualizarUsuario,
    listarUsuarios,
    cambiarRolUsuario,
}
