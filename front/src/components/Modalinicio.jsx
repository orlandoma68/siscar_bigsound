import React, { useEffect, useState } from 'react'
import Modalcontenido from './Modalcontenido'
import { Link } from 'react-router-dom'
import { pedirProductosCategoriaUnicos } from '../js/pedirProductos'
import { MenuIcon } from 'lucide-react'

const API_URL = import.meta.env.VITE_URL_SERVER;

const Modalinicio = () => {
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = ()=> setOpenModal(true)
  const handleCloseModal = ()=> {
    setOpenModal(false)
  }
  const [productos, setProductos] = useState()

  useEffect(()=>{        
    obtenerProductos()
  },[])

  const obtenerProductos = async ()=>{
    try {
        const respuesta = await fetch(`${API_URL}/productos/productos`)              
        if(!respuesta.ok) throw new Error("Error en la busqueda")
        const datos = await respuesta.json()
        await pedirProductosCategoriaUnicos(datos)
        .then((res)=>{
            setProductos(res)
        })   
      } catch {
        setProductos([])
      }
    }

  return (
    <div className='modal-inicio mx-4'>
      {/*abre el modal*/ }
      <Link className="nav-link" onMouseEnter={handleOpenModal}   to="#"><MenuIcon/>Categoria</Link>
      <Modalcontenido handleOpenModal ={openModal} handleCloseModal = {handleCloseModal}>
        <div className='bg-light' onMouseLeave={handleCloseModal}>     
            <ul className="mr-auto mx-3 p-3 d-flex" style={{overflowX:'auto'}}>
                {productos && productos.map(prod => {
                   return <li key={prod.id} onClick={handleCloseModal} className='mx-2 p-1 list-unstyled'><Link className='link-primary link-offset-3 link-underline link-underline-opacity-0 link-underline-opacity-100-hover ' to= {`/category/${prod.categoria}`} > {prod.categoria}</Link></li>})                
                }
            </ul>
        </div>
      </Modalcontenido>
      </div>
  )
}

export default Modalinicio
