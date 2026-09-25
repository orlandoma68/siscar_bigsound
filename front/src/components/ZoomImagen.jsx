import React, { useRef } from 'react'

const ZoomImagen = ({ src, alt, alto = 400, zoom = 2 }) => {

    const capaRef = useRef(null)

    const mover = (e) => {
        const capa = capaRef.current
        const contenedor = e.currentTarget
        const rect = contenedor.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        capa.style.transformOrigin = `${x}% ${y}%`
    }

    const mostrar = () => {
        const capa = capaRef.current
        if (capa) capa.style.transform = `scale(${zoom})`
    }

    const ocultar = () => {
        const capa = capaRef.current
        if (capa) capa.style.transform = 'scale(1)'
    }

    return (
        <div
            className='zoom-imagen'
            style={{ height: `${alto}px` }}
            onMouseEnter={mostrar}
            onMouseLeave={ocultar}
            onMouseMove={mover}
        >
            <img src={src} alt={alt} />
            <img
                ref={capaRef}
                className='zoom-imagen-capa'
                src={src}
                alt=''
                aria-hidden='true'
            />
        </div>
    )
}

export default ZoomImagen