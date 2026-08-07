const mysql = require("mysql2/promise")

const dotenv = require("dotenv").config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0    
});

pool.on('error', (err) => {
    console.error('Error de base de datos:', err.code);
});

module.exports = pool;

/*
{
"nombre": "Coca Cola",
"descripcion": "Bebida gaseosa",
"categoria": "Bebidas",
"imagen": "imagen.png",
"cantidad": 100,
"precio": 1.5,
"codigo" : "123456789"}

*/

/*
{"email": "orlando@gmail.com",
"password": "admin123"
}
*/