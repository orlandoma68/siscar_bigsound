
DROP TABLE IF EXISTS `tblproductos`;
CREATE TABLE IF NOT EXISTS `tblproductos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(30) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `imagen` varchar(255),
  `cantidad` int(11) NOT NULL,
  `precio` decimal(11,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


DROP TABLE IF EXISTS `tblroles`;
CREATE TABLE `tblroles` (
  `id` int(11) NOT NULL,
  `roles` varchar(50) NOT NULL UNIQUE CHECK (ROLES IN ('ADMIN', 'CLIENT')),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

INSERT IGNORE INTO `tblroles` (`id`, `roles`) VALUES (1, 'ADMIN'), (2, 'CLIENT');


DROP TABLE IF EXISTS `tblusuarios`;
CREATE TABLE `tblusuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` text NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol_id` int not null default 2,
  PRIMARY KEY (`id`),
  FOREIGN KEY (rol_id) REFERENCES tblroles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
