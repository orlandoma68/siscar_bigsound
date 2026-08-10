const contactoModelo = require('../models/modelsContacto')

const crearContacto = async (req, res) => {
    const { nombre, email, telefono, mensaje } = req.body
    try {
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ ok: false, message: "Nombre, email y mensaje son requeridos" })
        }
        await contactoModelo.crearContacto({ nombre, email, telefono, mensaje })
        return res.status(201).json({ ok: true, message: "Mensaje enviado correctamente" })
    } catch (error) {
        console.error('Error al crear contacto:', error.message)
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' })
    }
}

const listarContactos = async (req, res) => {
    try {
        const contactos = await contactoModelo.obtenerContactos()
        return res.status(200).json({ ok: true, data: contactos })
    } catch (error) {
        console.error('Error al listar contactos:', error.message)
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' })
    }
}

const contactosNoLeidos = async (req, res) => {
    try {
        const cantidad = await contactoModelo.obtenerContactosNuevos()
        return res.status(200).json({ ok: true, cantidad })
    } catch (error) {
        console.error('Error al contar contactos nuevos:', error.message)
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' })
    }
}

const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params
        const { estado } = req.body
        const estadosValidos = ['nuevo', 'leido', 'respondido']
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ ok: false, message: "Estado invalido" })
        }
        const contacto = await contactoModelo.obtenerContactoId(id)
        if (!contacto) {
            return res.status(404).json({ ok: false, message: "Contacto no encontrado" })
        }
        await contactoModelo.actualizarEstadoContacto({ id, estado })
        return res.status(200).json({ ok: true, message: "Estado del contacto actualizado" })
    } catch (error) {
        console.error('Error al actualizar estado del contacto:', error.message)
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' })
    }
}

const eliminarContacto = async (req, res) => {
    try {
        const { id } = req.params
        const contacto = await contactoModelo.obtenerContactoId(id)
        if (!contacto) {
            return res.status(404).json({ ok: false, message: "Contacto no encontrado" })
        }
        await contactoModelo.eliminarContacto(id)
        return res.status(200).json({ ok: true, message: "Mensaje eliminado" })
    } catch (error) {
        console.error('Error al eliminar contacto:', error.message)
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' })
    }
}

module.exports = {
    crearContacto,
    listarContactos,
    contactosNoLeidos,
    actualizarEstado,
    eliminarContacto
}
