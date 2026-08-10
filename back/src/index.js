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
const routerPedidos = require("./routes/routesPedido")
const routerContactos = require("./routes/routesContacto")

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(routerIndex)
app.use("/productos",routerProductos)
app.use("/usuarios",routerUsuarios)
app.use("/pedidos",routerPedidos)
app.use("/contactos",routerContactos)

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

const iniciarTablasPedidos = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tblpedidos (
                id INT NOT NULL AUTO_INCREMENT,
                usuario_id INT NOT NULL,
                nombre_cliente VARCHAR(100) NOT NULL,
                email_cliente VARCHAR(255) NOT NULL,
                telefono VARCHAR(50) DEFAULT NULL,
                tipo_envio VARCHAR(50) NOT NULL DEFAULT 'retiro en local',
                metodo_pago VARCHAR(50) NOT NULL DEFAULT 'efectivo',
                direccion VARCHAR(255) DEFAULT NULL,
                total DECIMAL(11,2) NOT NULL DEFAULT '0.00',
                estado ENUM('pendiente','pagado','enviado','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
                fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) REFERENCES tblusuarios(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci
        `)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tblpedidos_detalle (
                id INT NOT NULL AUTO_INCREMENT,
                pedido_id INT NOT NULL,
                producto_id INT NOT NULL,
                codigo VARCHAR(30) DEFAULT NULL,
                nombre VARCHAR(100) NOT NULL,
                precio DECIMAL(11,2) NOT NULL,
                cantidad INT NOT NULL,
                PRIMARY KEY (id),
                CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES tblpedidos(id) ON DELETE CASCADE,
                CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES tblproductos(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci
        `)

        const columnas = {
            tipo_envio: "VARCHAR(50) NOT NULL DEFAULT 'retiro en local'",
            metodo_pago: "VARCHAR(50) NOT NULL DEFAULT 'efectivo'",
            direccion: "VARCHAR(255) DEFAULT NULL"
        }
        for (const [columna, definicion] of Object.entries(columnas)) {
            const [rows] = await pool.query(
                `SELECT COUNT(*) AS total
                 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tblpedidos' AND COLUMN_NAME = ?`,
                [columna]
            )
            if (rows[0].total === 0) {
                await pool.query(`ALTER TABLE tblpedidos ADD COLUMN ${columna} ${definicion}`)
                console.log(`Columna '${columna}' agregada a tblpedidos`)
            }
        }

        const columnasDetalle = {
            codigo: "VARCHAR(30) DEFAULT NULL"
        }
        for (const [columna, definicion] of Object.entries(columnasDetalle)) {
            const [rows] = await pool.query(
                `SELECT COUNT(*) AS total
                 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tblpedidos_detalle' AND COLUMN_NAME = ?`,
                [columna]
            )
            if (rows[0].total === 0) {
                await pool.query(`ALTER TABLE tblpedidos_detalle ADD COLUMN ${columna} ${definicion}`)
                console.log(`Columna '${columna}' agregada a tblpedidos_detalle`)
            }
        }

        console.log("Tablas de pedidos verificadas en la BD")
    } catch (error) {
        console.error("Error al crear tablas de pedidos:", error.message)
    }
}

const crearTablaContactos = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tblcontactos (
            id INT NOT NULL AUTO_INCREMENT,
            nombre VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            telefono VARCHAR(50) DEFAULT NULL,
            mensaje TEXT NOT NULL,
            estado ENUM('nuevo','leido','respondido') NOT NULL DEFAULT 'nuevo',
            fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci
    `)
}

const iniciarTablasContactos = async () => {
    try {
        const [existe] = await pool.query(
            `SELECT COUNT(*) AS total
             FROM information_schema.TABLES
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tblcontactos'`
        )
        if (existe[0].total > 0) {
            const [columnas] = await pool.query(
                `SELECT COLUMN_NAME
                 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tblcontactos'`
            )
            const nombres = columnas.map((c) => c.COLUMN_NAME)
            if (!nombres.includes('id') || !nombres.includes('telefono') || !nombres.includes('estado')) {
                console.log("Estructura antigua de tblcontactos detectada, recreando tabla...")
                await pool.query('DROP TABLE IF EXISTS tblcontactos')
            }
        }

        await crearTablaContactos()
        console.log("Tabla de contactos verificada en la BD")
    } catch (error) {
        console.error("Error al crear tabla de contactos:", error.message)
    }
}

iniciarRoles().then(iniciarTablasPedidos).then(iniciarTablasContactos).then(() => {
    app.listen(port, () => {
        console.log(`Server iniciado en el puerto ${port}`)
    })
})
