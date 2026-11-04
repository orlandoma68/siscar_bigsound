const path = require('path')
const cloudinary = require('cloudinary').v2

const CARPETA = process.env.CLOUDINARY_FOLDER || 'siscar/productos'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const estaConfigurado = () => Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
)

const limpiarNombre = (nombreOriginal) => {
    const nombreBase = path.parse(nombreOriginal || 'imagen').name
    const limpio = nombreBase.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 60)
    return limpio || 'imagen'
}

const subirImagen = (buffer, nombreOriginal) => {
    return new Promise((resolve, reject) => {
        if (!estaConfigurado()) {
            return reject(new Error('Cloudinary no esta configurado. Revisa las variables de entorno.'))
        }

        const sufijo = Math.random().toString(36).slice(2, 8)
        const publicId = `${Date.now()}-${sufijo}-${limpiarNombre(nombreOriginal)}`
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: CARPETA,
                public_id: publicId,
                resource_type: 'image',
                overwrite: false
            },
            (error, result) => {
                if (error) return reject(error)
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                })
            }
        )

        stream.end(buffer)
    })
}

const eliminarImagen = async (publicId) => {
    if (!publicId || !estaConfigurado()) return

    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.warn('No se pudo eliminar la imagen de Cloudinary:', error.message)
    }
}

module.exports = {
    subirImagen,
    eliminarImagen,
    estaConfigurado
}
