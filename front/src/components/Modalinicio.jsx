import React, { useEffect, useRef, useState } from 'react'
import Modalcontenido from './Modalcontenido'
import { Link } from 'react-router-dom'
import { pedirProductos, pedirProductosCategoriaUnicos } from '../js/pedirProductos'
import { MenuIcon } from 'lucide-react'

const Modalinicio = () => {
  const [openModal, setOpenModal] = useState(false)
  const [productos, setProductos] = useState([])
  const contenedorRef = useRef(null)

  const handleToggleModal = () => setOpenModal((prev) => !prev)
  const handleCloseModal = () => setOpenModal(false)

  useEffect(() => {
    obtenerProductos()
  }, [])

  useEffect(() => {
    if (!openModal) return
    const handleClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        handleCloseModal()
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleCloseModal()
    }
    document.addEventListener('mousedown', handleClickFuera)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickFuera)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [openModal])

  const obtenerProductos = async () => {
    try {
      const datos = await pedirProductos()
      const categorias = await pedirProductosCategoriaUnicos(datos)
      setProductos(categorias)
    } catch {
      setProductos([])
    }
  }

  return (
    <div className='modal-inicio mx-4' ref={contenedorRef}>
      <button className="nav-link border-0 bg-transparent" onClick={handleToggleModal}>
        <MenuIcon />
        Categoria
      </button>
      <Modalcontenido handleOpenModal={openModal} handleCloseModal={handleCloseModal}>
        <div className='bg-light'>
          <ul className="mr-auto mx-3 p-3 d-flex" style={{ overflowX: 'auto' }}>
            {productos.map(prod => {
              return <li key={prod.categoria} onClick={handleCloseModal} className='mx-2 p-1 list-unstyled'>
                <Link className='link-primary link-offset-3 link-underline link-underline-opacity-0 link-underline-opacity-100-hover' to={`/category/${prod.categoria}`}>
                  {prod.categoria}
                </Link>
              </li>
            })}
          </ul>
        </div>
      </Modalcontenido>
    </div>
  )
}

export default Modalinicio
