import React, { useEffect, useState } from 'react'
import { createContext } from 'react'

const API_URL = import.meta.env.VITE_URL_SERVER;

export const ProductoContext = createContext()

export const ProductoContextProvider = ( { children } ) => {

    const [productos, setProductos] = useState([])

    const obtenerProductos = async () => {
        try {
            const res = await fetch(`${API_URL}/productos/productos`);
            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }
            const data = await res.json();
            setProductos(data);
        } catch (error) {
            console.error("Error al traer productos ...", error);
        }
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    const agregarProducto = ()=>{

    }
    
    const eliminarProducto = ()=>{

    }
    
  return (
    <ProductoContext.Provider value={{
      productos, 
      agregarProducto,
      eliminarProducto, 
     }}>
      { children }
    </ProductoContext.Provider>
  )
}

