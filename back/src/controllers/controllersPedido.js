const pedidoModelo = require('../models/modelsPedido')
const productoModelo = require('../models/modelsProducto')

const crearPedido = async (req, res) => {
    const { productos, nombre, email, telefono, tipo_envio, metodo_pago, direccion } = req.body
    try {
        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ ok: false, message: "El carrito esta vacio" })
        }

        const tiposEnvioValidos = ['retiro en local', 'envio a domicilio']
        const metodosPagoValidos = ['transferencia', 'efectivo']
        if (!tiposEnvioValidos.includes(tipo_envio)) {
            return res.status(400).json({ ok: false, message: "Tipo de envio invalido" })
        }
        if (!metodosPagoValidos.includes(metodo_pago)) {
            return res.status(400).json({ ok: false, message: "Metodo de pago invalido" })
        }
        if (tipo_envio === 'envio a domicilio' && !direccion) {
            return res.status(400).json({ ok: false, message: "La direccion es requerida para envio a domicilio" })
        }

        const productosValidados = []
        for (const item of productos) {
            const producto = await productoModelo.obtenerProductoId(item.id)
            if (!producto) {
                return res.status(400).json({ ok: false, message: `El producto no existe (id: ${item.id})` })
            }
            const cantidad = parseInt(item.cantidad, 10) || 0
            if (cantidad < 1) {
                return res.status(400).json({ ok: false, message: `Cantidad invalida para ${producto.nombre}` })
            }
            if (producto.cantidad < cantidad) {
                return res.status(400).json({ ok: false, message: `Stock insuficiente para ${producto.nombre}` })
            }
            productosValidados.push({
                producto_id: producto.id,
                codigo: producto.codigo,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad
            })
        }

        const pedidoId = await pedidoModelo.crearPedido({
            usuario_id: req.usuario.id,
            nombre_cliente: nombre || req.usuario.email.split('@')[0],
            email_cliente: email || req.usuario.email,
            telefono,
            tipo_envio,
            metodo_pago,
            direccion,
            productos: productosValidados
        })

        const pedido = await pedidoModelo.obtenerPedidoId(pedidoId)
        return res.status(201).json({
            ok: true,
            message: "Pedido registrado",
            pedidoId,
            fecha: pedido?.fecha || null,
            total: pedido?.total || null
        })
    } catch (error) {
        console.error('Error al crear pedido:', error.message)
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' })
    }
}

const misPedidos = async (req, res) => {
    try {
        const pedidos = await pedidoModelo.obtenerPedidosPorUsuario(req.usuario.id)
        const datos = await Promise.all(pedidos.map(async (pedido) => ({
            ...pedido,
            productos: await pedidoModelo.obtenerDetallePedido(pedido.id)
        })))
        return res.status(200).json({ ok: true, data: datos })
    } catch (error) {
        console.error('Error al obtener mis pedidos:', error.message)
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' })
    }
}

const listarPedidos = async (req, res) => {
    try {
        const pedidos = await pedidoModelo.obtenerTodosPedidos()
        const datos = await Promise.all(pedidos.map(async (pedido) => ({
            ...pedido,
            productos: await pedidoModelo.obtenerDetallePedido(pedido.id)
        })))
        return res.status(200).json({ ok: true, data: datos })
    } catch (error) {
        console.error('Error al listar pedidos:', error.message)
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' })
    }
}

const detallePedido = async (req, res) => {
    try {
        const { id } = req.params
        const pedido = await pedidoModelo.obtenerPedidoId(id)
        if (!pedido) {
            return res.status(404).json({ ok: false, message: "Pedido no encontrado" })
        }
        if (req.usuario.rol !== 'ADMIN' && pedido.usuario_id !== req.usuario.id) {
            return res.status(403).json({ ok: false, message: "Acceso denegado. El pedido no te pertenece" })
        }
        const productos = await pedidoModelo.obtenerDetallePedido(id)
        return res.status(200).json({ ok: true, data: { ...pedido, productos } })
    } catch (error) {
        console.error('Error al obtener detalle del pedido:', error.message)
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' })
    }
}

const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params
        const { estado } = req.body
        const estadosValidos = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ ok: false, message: "Estado invalido" })
        }
        const pedido = await pedidoModelo.obtenerPedidoId(id)
        if (!pedido) {
            return res.status(404).json({ ok: false, message: "Pedido no encontrado" })
        }
        await pedidoModelo.actualizarEstadoPedido({ id, estado })
        return res.status(200).json({ ok: true, message: "Estado del pedido actualizado" })
    } catch (error) {
        console.error('Error al actualizar estado del pedido:', error.message)
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' })
    }
}

module.exports = {
    crearPedido,
    misPedidos,
    listarPedidos,
    detallePedido,
    actualizarEstado
}
