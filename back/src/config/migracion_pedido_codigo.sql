-- Migracion: agregar el codigo del producto al detalle de pedidos
-- Ejecutar una sola vez contra la base de datos existente.
-- Los pedidos antiguos quedaran con codigo NULL y el frontend lo oculta.
ALTER TABLE tblpedidos_detalle ADD COLUMN codigo varchar(30) NULL AFTER producto_id;
