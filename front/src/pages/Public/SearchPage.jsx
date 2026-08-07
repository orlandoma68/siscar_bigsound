import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Item from '../../components/Item'
import Spinner from '../../components/Spinner'

const API_URL = import.meta.env.VITE_URL_SERVER;

const SearchPage = () => {

  const [productos, setProductos] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  const [error, setError] = useState()

  const termino = useParams().termino

  useEffect(()=>{

    const buscarPorNombre = async ()=>{
    
      try {
//      const respuesta = await fetch(`https://68d41b8f214be68f8c686c74.mockapi.io/api/v1/productos?nombre=${encodeURIComponent(termino)}`)
//      const res = await axios.get(`http://localhost:5000/api/productos/buscar?nombre=${valor}`);
        const respuesta = await fetch(`${API_URL}/productos/buscar?nombre=${encodeURIComponent(termino)}`)
        if(!respuesta.ok) throw new error ("Error en la busqueda")
        const datos = await respuesta.json()
        setProductos(datos)          
      } catch (error) {
        setError(error)
        setProductos([])
      }finally{
        setIsLoading(false)
      }
    }
    buscarPorNombre()
  }, [termino])
  
  if(isLoading) return <Spinner/>        

  //if(error) return <p>{error}</p>

  return (
    <div className='my-5 row gy-5 row-cols-1 row-cols-sm-2 row-cols-md-3 d-flex justify-content-center align-items-center'>
        { productos.length >0 ?
            productos.map((producto) =>{
                return(
                    <Item key={producto.id} producto = {producto}/>
                )
            }):
            <p className='text-center p-3 text-primary w-50' style={{backgroundColor:"#e3f2fd"}}> <b className='rounded-circle btn btn-outline-primary mx-4'><span className='text-primary p-1'>!</span></b>No se han encontrado productos que coincidan con tu eleccion</p>
        }
    </div>
  )
}

export default SearchPage