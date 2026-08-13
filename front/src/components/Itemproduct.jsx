import React from 'react'
import Item from './Item'

const Itemproduct = ({productosActuales}) => {
  return (
    <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 gy-4 d-flex justify-content-center'>
        { productosActuales.length >0 && 
            productosActuales.map((producto) =>{
                return(<Item key={producto.id} producto = {producto}/>)
            })
        }
    </div>
  )
}

export default Itemproduct
