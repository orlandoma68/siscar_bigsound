import React, { useContext, useEffect, useState } from 'react'
import Itemdetail from './Itemdetail'
import { useParams } from 'react-router-dom'
import Spinner from './Spinner'
import { CarritoContext } from '../context/CarritoContext'

const API_URL = import.meta.env.VITE_URL_SERVER;

const Itemdetailcontain = () => {

  const { carrito, setEstaProductoCarrito, setCantidadPorProducto } = useContext(CarritoContext)

  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [itemError, setItemError] = useState(null)

  const id = useParams().id

  useEffect(() => {
    const obtenerProductosId = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/productos/producto/${id}`)
        if (!respuesta.ok) throw new Error("Error al obtener datos")
        const data = await respuesta.json()
        setItem(data.data || data)
      } catch {
        setItemError("Hubo un error al obtener los datos..")
        setItem(null)
      } finally {
        setIsLoading(false)
      }
    }
    obtenerProductosId()
  }, [id])

  useEffect(() => {
    const estaProductoEnCarrito = carrito.find((car) => car.id == id)
    if (estaProductoEnCarrito) {
      setEstaProductoCarrito(true)
      setCantidadPorProducto(estaProductoEnCarrito.cantidad)
    } else {
      setEstaProductoCarrito(false)
      setCantidadPorProducto(1)
    }
  }, [id, carrito])

  if (isLoading) return <Spinner />

  if (itemError) return <p className="text-center my-5">{itemError}</p>

  return (
    <div>
      <Itemdetail item={item} />
    </div>
  )
}

export default Itemdetailcontain
