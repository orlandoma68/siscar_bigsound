const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")
const pool = require("./config/configDb")

const app = express()
const port = process.env.PORT || 3000

const routerIndex = require("./routes/routesIndex")
const routerProductos = require("./routes/routesProducto")
const routerUsuarios = require("./routes/routesUsuario")

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(routerIndex)
app.use("/productos",routerProductos)
app.use("/usuarios",routerUsuarios)

const iniciarRoles = async () => {
    try {
        await pool.query(
            "INSERT IGNORE INTO tblroles (id, roles) VALUES (1, 'ADMIN'), (2, 'CLIENT')"
        )
        console.log("Roles verificados en la BD")
    } catch (error) {
        console.error("Error al iniciar roles:", error.message)
    }
}

iniciarRoles().then(() => {
    app.listen(port, () => {
        console.log(`Server iniciado en el puerto ${port}`)
    })
})
