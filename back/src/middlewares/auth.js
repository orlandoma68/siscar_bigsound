const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const verificarToken = (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ ok: false, message: "Token de autenticacion requerido" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = decoded
        next()
    } catch (error) {
        return res.status(401).json({ ok: false, message: "Token invalido o expirado" })
    }
}

const verificarAdmin = (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== 'ADMIN') {
        return res.status(403).json({ ok: false, message: "Acceso denegado. Se requiere rol de administrador" })
    }
    next()
}

module.exports = { verificarToken, verificarAdmin }
