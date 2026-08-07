const pool = require("../config/configDb")

const obtenerProductos = async () => {
    try {
        const sql = 'SELECT * FROM tblproductos'
        const [result] = await pool.query(sql);
        return result         
    } catch (error) {
        error.message = "Error en la consulta SQL: " + error.message;
        throw error;        
    }
}

const crearProducto = async ({ codigo, nombre, descripcion, categoria, imagen, cantidad, precio }) => {
    const sql = "INSERT INTO tblproductos (codigo,nombre, descripcion, categoria,imagen, cantidad, precio) VALUES (?, ?, ?, ?, ?, ? ,?)"
    const [result] = await pool.execute(sql, [codigo, nombre, descripcion, categoria, imagen, cantidad, precio])
    return result
}

const actualizarProducto = async ({codigo, nombre, descripcion, categoria, imagen, cantidad, precio, id }) => {
    
    const sql = 'UPDATE tblproductos SET codigo = ?, nombre = ?, descripcion = ?, categoria = ?, imagen = ?, cantidad = ?, precio = ? WHERE id = ?';    
    const [result] = await pool.execute(sql, [codigo, nombre, descripcion, categoria, imagen, cantidad, precio, id ]);
    return result[0]
}
/*
const actualizarProducto = async (params, sitieneImagen) => {
    //id, { codigo, nombre, descripcion, categoria, imagen:nombreImagenFinal, cantidad, precio }
    console.log(params, "modelo param..")
    let sql = ""
    sql = 'UPDATE tblproductos SET codigo = ?, nombre = ?, descripcion = ?, categoria = ?, cantidad = ?, precio = ? WHERE id = ?';  
    if (sitieneImagen){
        sql = 'UPDATE tblproductos SET codigo = ?, nombre = ?, descripcion = ?, categoria = ?, imagen = ?, cantidad = ?, precio = ? WHERE id = ?';    
    }
    console.log(params, "modelo param.. despues")
    const result = await pool.execute(sql, params);
    return result[0]
}

*/
const eliminarProducto = async (id)=>{
    const sql = 'DELETE FROM tblproductos WHERE id = ?';
    const result = await pool.execute(sql, [id]);
    return result[0]
}

const obtenerProductoCodigo = async ({codigo}) => {
    const sql = "SELECT * FROM tblproductos WHERE codigo = ?"
    const [rows] = await pool.execute(sql, [codigo]);
    return rows[0]
} 

const obtenerProductoId = async (id) => {
    
    const sql = "SELECT * FROM tblproductos WHERE id = ?"
    const [rows] = await pool.execute(sql, [id]);
    return rows[0]
} 

const obtenerProductosNombre = async (nombre) => {
    const sql = "SELECT * FROM tblproductos WHERE nombre LIKE ?"
    const [rows] = await pool.execute(sql, nombre);
    return rows
}

module.exports = {
    obtenerProductos,
    crearProducto,
    obtenerProductoCodigo,
    obtenerProductoId,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosNombre
}