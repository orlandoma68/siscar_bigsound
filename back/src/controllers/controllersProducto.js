const productoModelo = require("../models/modelsProducto")
const { subirImagen, eliminarImagen, estaConfigurado } = require("../services/imagenService")

const IMAGEN_POR_DEFECTO = 'default-product.png'

const crearProducto = async (req, res) => {
    let imagenSubida = null

    try {
        const { codigo, nombre, descripcion, categoria, cantidad, precio } = req.body

        if (!codigo || !nombre || !categoria) {
            return res.status(400).json({ ok: false, message: "Algunos de los datos estan vacios.." })
        }

        if (req.file && !estaConfigurado()) {
            return res.status(500).json({ ok: false, message: "El almacenamiento de imagenes no esta configurado." })
        }

        const verificarProducto = await productoModelo.obtenerProductoCodigo({ codigo })
        if (verificarProducto) {
            return res.status(400).json({ ok: false, message: "El producto ya existe en la BD.." })
        }

        let imagen = IMAGEN_POR_DEFECTO
        let imagenPublicId = null

        if (req.file) {
            imagenSubida = await subirImagen(req.file.buffer, req.file.originalname)
            imagen = imagenSubida.url
            imagenPublicId = imagenSubida.publicId
        }

        const nuevoProducto = await productoModelo.crearProducto({
            codigo,
            nombre,
            descripcion,
            categoria,
            imagen,
            imagen_public_id: imagenPublicId,
            cantidad,
            precio
        })

        return res.status(201).send({ status: "ok", message: "el producto ha sido registrado en la BD..", nuevoProducto: nuevoProducto.nombre })

    } catch (error) {
        if (imagenSubida) await eliminarImagen(imagenSubida.publicId)
        console.error('Error en la base de datos:', error.message)
        res.status(500).json({ success: false, message: 'No se pudo conectar a la base de datos', error: error.code })
    }
}

const obtenerProductos = async (req, res) => {
    try {
        const productos = await productoModelo.obtenerProductos()
        return res.status(200).json({ success: true, data: productos });
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error("El servidor MySQL parece estar caido:", error.message);
            res.status(503).send('Servidor en mantenimiento (DB)');
        } else {
            res.status(500).send('Error interno del servidor');
        }
    }
}

const obtenerProductoId = async (req, res) => {
    try {
        const { id } = req.params
        const producto = await productoModelo.obtenerProductoId(id)
        if (!producto) {
            return res.status(404).json({ ok: false, message: "Producto no encontrado" })
        }
        return res.status(200).json({ ok: true, data: producto })
    } catch (error) {
        console.error('Error al obtener producto:', error.message);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' })
    }
}

const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, descripcion, categoria, cantidad, precio } = req.body;
    const nuevaImagen = req.file;
    let imagenSubida = null

    try {
        if (nuevaImagen && !estaConfigurado()) {
            return res.status(500).json({ error: 'El almacenamiento de imagenes no esta configurado.' })
        }

        const productoActual = await productoModelo.obtenerProductoId(id);
        if (!productoActual) {
            return res.status(404).json({ error: 'El producto no existe.' });
        }

        let nombreImagenFinal = productoActual.imagen;
        let publicIdFinal = productoActual.imagen_public_id;

        if (nuevaImagen) {
            imagenSubida = await subirImagen(nuevaImagen.buffer, nuevaImagen.originalname);
            nombreImagenFinal = imagenSubida.url;
            publicIdFinal = imagenSubida.publicId;
        }

        await productoModelo.actualizarProducto({
            codigo,
            nombre,
            descripcion,
            categoria,
            imagen: nombreImagenFinal,
            imagen_public_id: publicIdFinal,
            cantidad,
            precio,
            id
        });

        if (imagenSubida && productoActual.imagen_public_id) {
            await eliminarImagen(productoActual.imagen_public_id);
        }

        res.status(200).json({ mensaje: 'Producto actualizado correctamente' });

    } catch (error) {
        if (imagenSubida) await eliminarImagen(imagenSubida.publicId);
        console.error('Error al actualizar producto:', error.message);
        res.status(500).json({ error: 'Error interno al actualizar el producto' });
    }
}

const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params
        const buscarImagenProducto = await productoModelo.obtenerProductoId(id)

        if (!buscarImagenProducto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        await productoModelo.eliminarProducto(id)

        if (buscarImagenProducto.imagen_public_id) {
            await eliminarImagen(buscarImagenProducto.imagen_public_id)
        }

        return res.status(200).send({ ok: true, message: "el producto se ha eliminado de la BD..." })
    } catch (error) {
        console.error('Error al eliminar producto:', error.message);
        return res.status(500).send({ ok: false, message: 'Error interno del servidor' });
    }
}

const obtenerProductosNombre = async (req, res) => {
    try {
        const { nombre } = req.query
        if (!nombre) {
            const productos = await productoModelo.obtenerProductos()
            return res.status(200).json({ success: true, data: productos });
        }
        const valor = [`%${nombre}%`];
        const productos = await productoModelo.obtenerProductosNombre(valor)
        return res.status(200).json({ success: true, data: Array.isArray(productos) ? productos : [productos] });
    } catch (error) {
        console.error('Error en la base de datos:', error.message);
        return res.status(500).json({ success: false, message: 'No se pudo conectar a la base de datos', error: error.code });
    }
}

const obtenerEstadisticas = async (req, res) => {
    try {
        const productos = await productoModelo.obtenerProductos()
        const totalProductos = productos.length
        const categorias = [...new Set(productos.map(p => p.categoria))]
        const totalCategorias = categorias.length
        const precioTotal = productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
        const stockTotal = productos.reduce((acc, p) => acc + p.cantidad, 0)
        const productosPorCategoria = categorias.map(cat => ({
            categoria: cat,
            cantidad: productos.filter(p => p.categoria === cat).length
        }))
        return res.status(200).json({
            ok: true,
            data: {
                totalProductos,
                totalCategorias,
                precioTotal: parseFloat(precioTotal.toFixed(2)),
                stockTotal,
                productosPorCategoria
            }
        })
    } catch (error) {
        console.error('Error al obtener estadisticas:', error.message);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoId,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosNombre,
    obtenerEstadisticas
}
