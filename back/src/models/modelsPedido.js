const pool = require('../config/configDb')

const crearPedido = async ({ usuario_id, nombre_cliente, email_cliente, telefono, tipo_envio, metodo_pago, direccion, productos }) => {
    const conexion = await pool.getConnection()
    try {
        await conexion.beginTransaction()

        const total = productos.reduce((acc, p) => acc + (parseFloat(p.precio) * p.cantidad), 0)

        const [resultPedido] = await conexion.execute(
            `INSERT INTO tblpedidos (usuario_id, nombre_cliente, email_cliente, telefono, tipo_envio, metodo_pago, direccion, total)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [usuario_id, nombre_cliente, email_cliente, telefono || null, tipo_envio, metodo_pago, direccion || null, total.toFixed(2)]
        )

        const pedidoId = resultPedido.insertId

        for (const p of productos) {
            await conexion.execute(
                `INSERT INTO tblpedidos_detalle (pedido_id, producto_id, codigo, nombre, precio, cantidad)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [pedidoId, p.producto_id, p.codigo || null, p.nombre, p.precio, p.cantidad]
            )
            await conexion.execute(
                `UPDATE tblproductos SET cantidad = cantidad - ? WHERE id = ? AND cantidad >= ?`,
                [p.cantidad, p.producto_id, p.cantidad]
            )
        }

        await conexion.commit()
        return pedidoId
    } catch (error) {
        await conexion.rollback()
        throw error
    } finally {
        conexion.release()
    }
}

const obtenerPedidosPorUsuario = async (usuario_id) => {
    const [pedidos] = await pool.query(
        `SELECT p.id, p.nombre_cliente, p.email_cliente, p.telefono, p.tipo_envio, p.metodo_pago, p.direccion, p.total, p.estado, p.fecha
         FROM tblpedidos p
         WHERE p.usuario_id = ?
         ORDER BY p.fecha DESC`,
        [usuario_id]
    )
    return pedidos
}

const obtenerTodosPedidos = async () => {
    const [pedidos] = await pool.query(
        `SELECT p.id, p.usuario_id, p.nombre_cliente, p.email_cliente, p.telefono, p.tipo_envio, p.metodo_pago, p.direccion, p.total, p.estado, p.fecha,
                u.nombre as usuario_nombre, u.email as usuario_email
         FROM tblpedidos p
         LEFT JOIN tblusuarios u ON p.usuario_id = u.id
         ORDER BY p.fecha DESC`
    )
    return pedidos
}

const obtenerPedidoId = async (id) => {
    const [pedidos] = await pool.query(
        `SELECT p.id, p.usuario_id, p.nombre_cliente, p.email_cliente, p.telefono, p.tipo_envio, p.metodo_pago, p.direccion, p.total, p.estado, p.fecha
         FROM tblpedidos p
         WHERE p.id = ?`,
        [id]
    )
    return pedidos[0]
}

const obtenerDetallePedido = async (pedido_id) => {
    const [detalle] = await pool.query(
        `SELECT d.id, d.pedido_id, d.producto_id, d.codigo, d.nombre, d.precio, d.cantidad
         FROM tblpedidos_detalle d
         WHERE d.pedido_id = ?
         ORDER BY d.id`,
        [pedido_id]
    )
    return detalle
}

const actualizarEstadoPedido = async ({ id, estado }) => {
    const sql = 'UPDATE tblpedidos SET estado = ? WHERE id = ?'
    const [result] = await pool.execute(sql, [estado, id])
    return result
}

module.exports = {
    crearPedido,
    obtenerPedidosPorUsuario,
    obtenerTodosPedidos,
    obtenerPedidoId,
    obtenerDetallePedido,
    actualizarEstadoPedido
}
