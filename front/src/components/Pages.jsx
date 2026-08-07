import React from 'react'
import Itemproduct from './Itemproduct'

const Pages = ({productosActuales}) => {  
  return (
    <div>        
      <Itemproduct productosActuales = {productosActuales} />
    </div>
  )
}

export default Pages
