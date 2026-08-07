import React, { useState } from 'react'
import { createContext } from 'react'
import { toast } from 'react-hot-toast'
import { notific } from '../js/notificacion'

export const CarritoContext = createContext()

export const CarritoContextProvider = ( { children } ) => {

    const [carrito, setCarrito] = useState([])

    const [estaProductoCarrito, setEstaProductoCarrito] = useState(false)

    const [cantidadPorProducto, setCantidadPorProducto] = useState(1)

    //agregar Productos al carrito de compras
    const agregarProductosCarrito = (prod)=>{

      const siExisteProductosEnCarrito = carrito.find((car) => car.id === prod.id);

      if (siExisteProductosEnCarrito) {
        setCarrito(carrito.map((car) =>car.id === prod.id ? { ...car, cantidad: car.cantidad + 1 }: car));
        setCantidadPorProducto(siExisteProductosEnCarrito.cantidad+1)
      } else {      
        setCarrito([...carrito, {...prod, cantidad: 1 }]);
        setEstaProductoCarrito(true)
      }  

      // Mostrar notificación de agregar un producto al carrito
      toast.success(`Producto ${prod.nombre} se agregó al carrito`, notific);
    }

    //devuelve cantidad de productos en carrito
    const cantidadProductosCarrito = ()=>{
      return carrito.reduce((acc,prod)=>acc+prod.cantidad, 0)
    }
    
    //calculo del total de precios de los productos
    const totalPagar = ()=>{
      const total = (carrito.reduce((acc, prod)=> acc+(prod.precio * prod.cantidad),0)).toFixed(2)
      return total
    }

    //eliminar Producto del carrito
    const eliminarProductosCarrito =(prod)=>{
      const productoEnCarrito = carrito.filter((car)=>car.id !== prod.id)
      setCarrito(productoEnCarrito)
      setEstaProductoCarrito(false)

      //mostrar notificacion del producto eliminado
      toast.error(`Producto ${prod.nombre} se elimino del carrito`, notific);
  }

  //extraer productos del carrito
  const sacarProductosCarrito = (prod)=>{
    
    const siExisteProductosEnCarrito = carrito.find((car) => car.id === prod.id);

    if (siExisteProductosEnCarrito) {
      setCarrito(carrito.map((car) =>car.id === prod.id ? { ...car, cantidad: car.cantidad -1 }: car));
      setCantidadPorProducto(siExisteProductosEnCarrito.cantidad-1)
    } 

    //mostrar notificacion de extraccion de producto del carrito
    toast.error(`Producto ${prod.nombre} se ha extraido del carrito`, notific);
  }

    //vaciar carrito
    const vaciarCarrito = ()=>{
      setCarrito([])
    }

  return (
    <CarritoContext.Provider value={{
      carrito, 
      agregarProductosCarrito, 
      eliminarProductosCarrito, 
      cantidadProductosCarrito, 
      sacarProductosCarrito, 
      vaciarCarrito, 
      totalPagar, 
      estaProductoCarrito,
      setEstaProductoCarrito,
      cantidadPorProducto, 
      setCantidadPorProducto }}>
      { children }
    </CarritoContext.Provider>
  )
}

