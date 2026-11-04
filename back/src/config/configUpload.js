const multer = require('multer')

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 8 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
            const error = new Error('Formato de imagen no permitido. Usa JPG, PNG, WEBP o GIF.')
            error.status = 400
            return cb(error)
        }
        cb(null, true)
    }
})

module.exports = upload
