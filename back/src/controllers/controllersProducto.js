const productoModelo = require("../models/modelsProducto")
const fs = require('fs/promises');
const path = require('path');

const crearProducto = async (req, res) => {
    try {
        const { codigo, nombre, descripcion, categoria, cantidad, precio } = req.body
        const imagenFile = req.file ? req.file.filename : 'default-product.png';
        
        if (!codigo || !nombre || !categoria) {
            return res.status(400).json({ ok: false, message: "Algunos de los datos estan vacios.." })
        }
        
        const verificarProducto = await productoModelo.obtenerProductoCodigo({ codigo })
        if (verificarProducto) {      
            if (imagenFile) await fs.unlink(imagenFile.path); 
            return res.status(400).json({ ok: false, message: "El producto ya existe en la BD.." })
        }
        
        const nuevoProducto = await productoModelo.crearProducto({ codigo, nombre, descripcion, categoria, imagen:imagenFile, cantidad, precio })
        return res.status(201).send({ status: "ok", message: "el producto ha sido registrado en la BD..", nuevoProducto: nuevoProducto.nombre })

    } catch (error) {
        if (imagenFile) await fs.unlink(imagenFile.path).catch(() => {});
        console.error('Error en la base de datos:', error.message);
        res.status(500).json({ success: false, message: 'No se pudo conectar a la base de datos', error: error.code });
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
    const nuevaImagen = req.file; // Si subieron un archivo nuevo

    try {
        const productoActual = await productoModelo.obtenerProductoId(id);
        if (!productoActual) {
            // Si el producto no existe, borramos la nueva imagen si se llegó a subir
            if (nuevaImagen) {
                await fs.unlink(nuevaImagen.path);
            }
            return res.status(404).json({ error: 'El producto no existe.' });
        }

        // Determinar qué nombre de imagen se guardará en la base de datos
        let nombreImagenFinal = productoActual.imagen; // Mantenemos la actual por defecto   
        if (nuevaImagen) {
            nombreImagenFinal = nuevaImagen.filename; // Usamos el nombre de la nueva
            console.log(nombreImagenFinal, ",,2da.imagen,,")
        }

        // Actualizar la información en la base de datos
        await productoModelo.actualizarProducto({codigo, nombre, descripcion, categoria, imagen:nombreImagenFinal, cantidad, precio, id });
        
        // borramos la IMAGEN ANTERIOR del servidor
        if (nuevaImagen && productoActual.imagen) {
            const rutaImagenAntigua = path.join(__dirname, '../uploads', productoActual.imagen);
            console.log(rutaImagenAntigua, "ruta antigua")
        
            // Eliminamos la imagen vieja (usamos catch para evitar interrupciones si no existía)
            await fs.unlink(rutaImagenAntigua).catch((err) => {
                console.warn('No se pudo borrar la imagen anterior:', err.message);
            });
        }

        res.status(200).json({ mensaje: 'Producto actualizado correctamente' });
        
    } catch (error) {
        // Si algo falla durante el proceso, borramos la nueva imagen cargada
        if (nuevaImagen) await fs.unlink(nuevaImagen.path).catch(() => {});
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
        const nombreImagen = buscarImagenProducto.imagen

        await productoModelo.eliminarProducto(id)

        if (nombreImagen) {
            const rutaArchivo = path.join(__dirname, '..', 'uploads', nombreImagen);
            fs.unlink(rutaArchivo, (err) => {
                if (err) {
                    console.error("Error al borrar el archivo fisico:", err);
                }
            });
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
