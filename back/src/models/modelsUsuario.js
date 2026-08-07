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

const eliminarUsuario = async (id) => {
    const sql = 'DELETE FROM tblusuarios WHERE id = ?';
    const [result] = await pool.query(sql, [id]);
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
    eliminarUsuario,
    obtenerUsuarioEmail,
    obtenerUsuarioId,
    obtenerUsuarios
}
