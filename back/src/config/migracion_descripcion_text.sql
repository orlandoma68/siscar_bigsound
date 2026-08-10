-- Migracion: ampliar la descripcion de productos a TEXT
-- Ejecutar una sola vez contra la base de datos existente.
ALTER TABLE tblproductos MODIFY COLUMN descripcion TEXT NOT NULL;
