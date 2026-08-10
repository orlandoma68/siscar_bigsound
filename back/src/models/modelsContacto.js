const pool = require('../config/configDb')

const crearContacto = async ({ nombre, email, telefono, mensaje }) => {
    const sql = `INSERT INTO tblcontactos (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)`
    const [result] = await pool.execute(sql, [nombre, email, telefono || null, mensaje])
    return result
}

const obtenerContactos = async () => {
    const [contactos] = await pool.query(
        `SELECT id, nombre, email, telefono, mensaje, estado, fecha
         FROM tblcontactos
         ORDER BY fecha DESC`
    )
    return contactos
}

const obtenerContactoId = async (id) => {
    const [contactos] = await pool.query(
        `SELECT id, nombre, email, telefono, mensaje, estado, fecha
         FROM tblcontactos
         WHERE id = ?`,
        [id]
    )
    return contactos[0]
}

const actualizarEstadoContacto = async ({ id, estado }) => {
    const sql = 'UPDATE tblcontactos SET estado = ? WHERE id = ?'
    const [result] = await pool.execute(sql, [estado, id])
    return result
}

const obtenerContactosNuevos = async () => {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS total
         FROM tblcontactos
         WHERE estado = 'nuevo'`
    )
    return rows[0].total
}

const eliminarContacto = async (id) => {
    const sql = 'DELETE FROM tblcontactos WHERE id = ?'
    const [result] = await pool.execute(sql, [id])
    return result
}

module.exports = {
    crearContacto,
    obtenerContactos,
    obtenerContactoId,
    actualizarEstadoContacto,
    obtenerContactosNuevos,
    eliminarContacto
}
