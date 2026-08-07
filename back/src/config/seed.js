const bcrypt = require('bcryptjs')
const pool = require('./configDb')

const usuarios = [
    {
        nombre: 'Administrador',
        email: 'admin@siscar.com',
        password: 'admin123',
        rol_id: 1
    },
    {
        nombre: 'Cliente Test',
        email: 'cliente@siscar.com',
        password: 'cliente123',
        rol_id: 2
    }
]

const ensureRoles = async () => {
    await pool.query(
        "INSERT IGNORE INTO tblroles (id, roles) VALUES (1, 'ADMIN'), (2, 'CLIENT')"
    )
    console.log("Roles verificados: ADMIN (1), CLIENT (2)")
}

const seed = async () => {
    const args = process.argv.slice(2)
    const reset = args.includes('--reset')
    const promoteEmail = args.find((a, i) => args[i - 1] === '--promote')

    try {
        await ensureRoles()

        if (promoteEmail) {
            const [existe] = await pool.query("SELECT id, nombre FROM tblusuarios WHERE email = ?", [promoteEmail])
            if (existe.length === 0) {
                console.log(`\nNo se encontro usuario con email: ${promoteEmail}`)
                process.exit(1)
            }
            await pool.query("UPDATE tblusuarios SET rol_id = 1 WHERE email = ?", [promoteEmail])
            console.log(`\nUsuario "${promoteEmail}" promovido a ADMIN exitosamente.`)
            process.exit(0)
        }

        if (reset) {
            console.log("\nModo reset: eliminando usuarios seed existentes...\n")
            const emails = usuarios.map(u => u.email)
            await pool.query("DELETE FROM tblusuarios WHERE email IN (?)", [emails])
            console.log("Usuarios anteriores eliminados.")
        }

        console.log("\nIniciando seed de usuarios...\n")

        for (const usuario of usuarios) {
            const [existe] = await pool.query(
                "SELECT id FROM tblusuarios WHERE email = ?",
                [usuario.email]
            )

            if (existe.length > 0) {
                console.log(`"${usuario.email}" ya existe (id: ${existe[0].id}), saltando...`)
                continue
            }

            const salt = await bcrypt.genSalt(5)
            const hashPassword = await bcrypt.hash(usuario.password, salt)

            const [result] = await pool.query(
                "INSERT INTO tblusuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)",
                [usuario.nombre, usuario.email, hashPassword, usuario.rol_id]
            )

            const rol = usuario.rol_id === 1 ? 'ADMIN' : 'CLIENT'
            console.log(`\nUsuario creado:`)
            console.log(`  Nombre:   ${usuario.nombre}`)
            console.log(`  Email:    ${usuario.email}`)
            console.log(`  Password: ${usuario.password}`)
            console.log(`  Rol:      ${rol} (id: ${usuario.rol_id})`)
            console.log(`  DB id:    ${result.insertId}`)
        }

        console.log("\nSeed completado exitosamente.")
        process.exit(0)
    } catch (error) {
        console.error("\nError durante el seed:", error.message)
        process.exit(1)
    }
}

seed()
