import React, { useEffect, useState } from 'react'
import {pedirProductosCategoria} from "../js/pedirProductos"
import { useParams } from 'react-router-dom'
import Spinner from './Spinner'
import {pedirProductos} from "../js/pedirProductos"
import Pagination from './Pagination'

const Listproducts = () => {

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState(null)

    const [productos, setProductos] = useState([])

    const [tituloProducto, setTituloProducto] = useState("")

    const categoria = useParams().categoria;

    useEffect(()=>{        
      obtenerProductos()
    },[categoria])

    const obtenerProductos = async ()=>{
        try {
            setIsLoading(true)
            setError(null)
            const datos = await pedirProductos()
            pedirProductosCategoria(datos, categoria)
            .then((res)=>{
                if(categoria){
                    setProductos(res)
                    setTituloProducto(`Producto de Categoria: ${categoria}`)
                }else{
                    setProductos(datos)
                    setTituloProducto("Productos")
                }
            })   
                
          } catch (error) {
            setProductos([])
            setError(error)
          }finally{
            setIsLoading(false)
          }
    }

    if(isLoading) return <Spinner/>        

    if(error) return <p className='bg-danger text-white text-center fs-6 p-2 my-1'>{error}</p>

  return (
    <div>    
        {productos.length === 0 ?
        ( <div>
          <p className='fs-6 w-100 text-success py-1 text-center'><strong>No se encontraron registros en la base de datos...</strong> </p>
        </div>
         ) :(

          <div className='my-4'>
              <h1 className='fs-3 w-100 text-dark py-2 text-center'>{tituloProducto}</h1>
              <hr />
              <Pagination productos = {productos} />
          </div>
         )
        }
    </div>    
  )
}

export default Listproducts
