import React, { useContext } from 'react'
import Navbar from './Navbar'
import { CarritoContext } from '../context/CarritoContext'

const Header = () => {
  
  const {cantidadProductosCarrito} = useContext(CarritoContext)

  return (
    <div>
      <Navbar cantidadProductosCarrito = {cantidadProductosCarrito} />
    </div>
  )
}

export default Header
