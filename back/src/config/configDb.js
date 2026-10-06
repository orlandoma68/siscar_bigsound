const mysql = require("mysql2/promise")

const dotenv = require("dotenv").config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false // 🔥 OBLIGATORIO para que Aiven no rechace a Render
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0    
});

pool.on('error', (err) => {
    console.error('Error de base de datos:', err.code);
});

const createTablesSQL = `
  
DROP TABLE IF EXISTS tblproductos;
CREATE TABLE IF NOT EXISTS tblproductos (
  id int(11) NOT NULL AUTO_INCREMENT,
  codigo varchar(30) NOT NULL,
  nombre varchar(100) NOT NULL,
  descripcion text NOT NULL,
  categoria varchar(100) NOT NULL,
  imagen varchar(255),
  cantidad int(11) NOT NULL,
  precio decimal(11,2) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


DROP TABLE IF EXISTS tblroles;
CREATE TABLE IF NOT EXISTS tblroles (
  id int(11) NOT NULL,
  roles varchar(50) NOT NULL UNIQUE CHECK (ROLES IN ('ADMIN', 'CLIENT')),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

INSERT IGNORE INTO tblroles (id, roles) VALUES (1, 'ADMIN'), (2, 'CLIENT');


DROP TABLE IF EXISTS tblusuarios;
CREATE TABLE IF NOT EXISTS tblusuarios (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  email text NOT NULL,
  password varchar(255) NOT NULL,
  rol_id int not null default 2,
  PRIMARY KEY (id),
  FOREIGN KEY (rol_id) REFERENCES tblroles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


DROP TABLE IF EXISTS tblpedidos;
CREATE TABLE IF NOT EXISTS tblpedidos (
  id int(11) NOT NULL AUTO_INCREMENT,
  usuario_id int(11) NOT NULL,
  nombre_cliente varchar(100) NOT NULL,
  email_cliente varchar(255) NOT NULL,
  telefono varchar(50) DEFAULT NULL,
  tipo_envio varchar(50) NOT NULL DEFAULT 'retiro en local',
  metodo_pago varchar(50) NOT NULL DEFAULT 'efectivo',
  direccion varchar(255) DEFAULT NULL,
  total decimal(11,2) NOT NULL DEFAULT '0.00',
  estado enum('pendiente','pagado','enviado','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  fecha datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (usuario_id) REFERENCES tblusuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


DROP TABLE IF EXISTS tblpedidos_detalle;
CREATE TABLE IF NOT EXISTS tblpedidos_detalle (
  id int(11) NOT NULL AUTO_INCREMENT,
  pedido_id int(11) NOT NULL,
  producto_id int(11) NOT NULL,
  codigo varchar(30) NULL,
  nombre varchar(100) NOT NULL,
  precio decimal(11,2) NOT NULL,
  cantidad int(11) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (pedido_id) REFERENCES tblpedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES tblproductos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


DROP TABLE IF EXISTS tblcontactos;
CREATE TABLE IF NOT EXISTS tblcontactos (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  email varchar(255) NOT NULL,
  telefono varchar(50) DEFAULT NULL,
  mensaje text NOT NULL,
  estado enum('nuevo','leido','respondido') NOT NULL DEFAULT 'nuevo',
  fecha datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
`
// Se ejecuta automáticamente al importar este archivo
initDB();

module.exports = pool;
