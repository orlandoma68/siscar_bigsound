const bcrypt = require('bcryptjs')
const usuarioModelo = require('../models/modelsUsuario')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

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
        const nuevoUsuario = await usuarioModelo.crearUsuario({
            nombre: nombre || email.split('@')[0],
            email,
            password: hashPassword,
            rol_id: 2
        })

        return res.status(201).send({
            ok: true,
            message: "Usuario registrado exitosamente",
            redirect: "/auth/login"
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
            const nuevoUsuario = await usuarioModelo.crearUsuario({
                nombre: nombre || email.split('@')[0],
                email,
                password: fakePassword,
                rol_id: 2
            })
            usuario = {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: 'CLIENT'
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

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModelo.obtenerUsuarios()
        return res.status(200).send({ ok: true, data: usuarios })
    } catch (error) {
        console.error('Error al listar usuarios:', error.message);
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' });
    }
}

module.exports = {
    registrarUsuario,
    loginUsuario,
    sincronizarGoogle,
    me,
    verificarRol,
    eliminarUsuario,
    actualizarUsuario,
    listarUsuarios,
}
