const API_URL = import.meta.env.VITE_URL_SERVER;

export const pedirProductos = async () => {
    try {
        const response = await fetch(`${API_URL}/productos/productos`);
        if (!response.ok) throw new Error("Error al traer los productos...");
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error(error, "error");
        return [];
    }
}

export const pedirProductosCategoria = (datos, categoria) => {
    return new Promise((resolve, reject) => {
        if (!categoria) {
            resolve(datos);
            return;
        }
        const normalizada = categoria.trim().toLowerCase();
        const itemCategoria = datos.filter((item) => item.categoria.trim().toLowerCase() === normalizada);
        if (itemCategoria.length > 0) {
            resolve(itemCategoria);
        } else {
            reject("No se encontraron productos en esta categoria");
        }
    })
}

export const pedirProductosCategoriaUnicos = (datos) => {
    return new Promise((resolve) => {
        const vistos = new Set();
        const categoriasUnicos = datos.filter((producto) => {
            const normalizada = producto.categoria.trim().toLowerCase();
            if (!normalizada || vistos.has(normalizada)) return false;
            vistos.add(normalizada);
            return true;
        });
        resolve(categoriasUnicos);
    })
}

export const pedirProductosNombre = (data, nombre) => {
    return new Promise((resolve, reject) => {
        const itemNombre = data.filter((prod) => prod.nombre.toLowerCase().includes(nombre.toLowerCase()));
        if (itemNombre.length > 0) {
            resolve(itemNombre);
        } else {
            reject("No se encontraron productos con ese nombre");
        }
    })
}
