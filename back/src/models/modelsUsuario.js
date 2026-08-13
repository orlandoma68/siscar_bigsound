const pool = require('../config/configDb')

const obtenerUsuarios = async () => {
    const sql = `SELECT u.id, u.nombre, u.email, r.roles as rol
                 FROM tblusuarios u
                 LEFT JOIN tblroles r ON u.rol_id = r.id`
    const [result] = await pool.query(sql);
    return result
}

const crearUsuario = async ({ nombre, email, password, rol_id = 2 }) => {
    const sql = "INSERT INTO tblusuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)"
    const [result] = await pool.query(sql, [nombre, email, password, rol_id])
    return { id: result.insertId, nombre, email, rol_id }
}

const actualizarUsuario = async ({ id, email }) => {
    const sql = 'UPDATE tblusuarios SET email = ? WHERE id = ?';
    const [result] = await pool.query(sql, [email, id]);
    return result
}

const actualizarPassword = async ({ id, password }) => {
    const sql = 'UPDATE tblusuarios SET password = ? WHERE id = ?';
    const [result] = await pool.query(sql, [password, id]);
    return result
}

const eliminarUsuario = async (id) => {
    const sql = 'DELETE FROM tblusuarios WHERE id = ?';
    const [result] = await pool.query(sql, [id]);
    return result
}

const actualizarRol = async ({ id, rol_id }) => {
    const sql = 'UPDATE tblusuarios SET rol_id = ? WHERE id = ?';
    const [result] = await pool.query(sql, [rol_id, id]);
    return result
}

const obtenerRol = async (rol_id) => {
    const sql = 'SELECT id, roles FROM tblroles WHERE id = ?';
    const [result] = await pool.query(sql, [rol_id]);
    return result[0]
}

const contarAdmins = async () => {
    const sql = 'SELECT COUNT(*) AS total FROM tblusuarios WHERE rol_id = 1';
    const [result] = await pool.query(sql);
    return result[0].total
}

const registrarAuditoriaRol = async ({ usuario_id, email, usuario_modificado_id, rol_anterior, rol_nuevo, accion }) => {
    const sql = `INSERT INTO tblauditoria_roles
                 (usuario_id, email, usuario_modificado_id, rol_anterior, rol_nuevo, accion)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(sql, [usuario_id, email, usuario_modificado_id, rol_anterior, rol_nuevo, accion]);
    return result
}

const obtenerUsuarioEmail = async (email) => {
    const sql = `SELECT u.*, r.roles as rol
                 FROM tblusuarios u
                 LEFT JOIN tblroles r ON u.rol_id = r.id
                 WHERE u.email = ?`;
    const [result] = await pool.query(sql, [email]);
    return result[0]
}

const obtenerUsuarioId = async (id) => {
    const sql = `SELECT u.*, r.roles as rol
                 FROM tblusuarios u
                 LEFT JOIN tblroles r ON u.rol_id = r.id
                 WHERE u.id = ?`
    const [result] = await pool.query(sql, [id]);
    return result[0]
}

module.exports = {
    crearUsuario,
    actualizarUsuario,
    actualizarPassword,
    actualizarRol,
    eliminarUsuario,
    obtenerUsuarioEmail,
    obtenerUsuarioId,
    obtenerUsuarios,
    obtenerRol,
    contarAdmins,
    registrarAuditoriaRol
}
