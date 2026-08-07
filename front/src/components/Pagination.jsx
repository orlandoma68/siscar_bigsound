import React, { useState } from 'react'
import Pages from './Pages'
import PaginaActual from './PaginaActual'

const Pagination = ({productos}) => {

    const [cantidadProductosPorPagina] = useState(6)
    const [numeroPaginaActual, setNumeroPaginaActual] = useState(1)

    const indiceUltimoProducto = cantidadProductosPorPagina * numeroPaginaActual
    const indicePrimerProducto = indiceUltimoProducto - cantidadProductosPorPagina
    const productosActuales = productos.slice(indicePrimerProducto, indiceUltimoProducto)
    const totalPaginas = Math.ceil(productos.length / cantidadProductosPorPagina)
    const totalProductos = productos.length

  return (
    <div>
        {productosActuales && <Pages productosActuales = {productosActuales}/>}
        <PaginaActual totalProductos={totalProductos} totalPaginas = {totalPaginas} numeroPaginaActual = {numeroPaginaActual} setNumerPaginaActual={setNumeroPaginaActual}/>
    </div>
  )
}

export default Pagination;
