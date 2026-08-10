import React, { useEffect, useRef, useState } from 'react'
import { useContext } from 'react'
import { CarritoContext } from '../context/CarritoContext'
import { MessageCircle, ShoppingCart, X } from 'lucide-react'

const WHATSAPP_NUMERO = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')

const SALUDO = 'Hola, tengo una consulta sobre sus productos.'

const IconoWhatsApp = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const construirMensajeCarrito = (carrito, total) => {
  const lineas = carrito.map((prod, index) => {
    const codigo = prod.codigo ? ` [${prod.codigo}]` : ''
    return `${index + 1}.${codigo} ${prod.nombre} - ${prod.cantidad} x US$ ${Number(prod.precio).toFixed(2)} = US$ ${(prod.precio * prod.cantidad).toFixed(2)}`
  })
  return [
    '*Hola, mi carrito de compras:*',
    '',
    ...lineas,
    '',
    `*Total: US$ ${total}*`
  ].join('\n')
}

const BotonWhatsApp = () => {
  const { carrito, totalPagar } = useContext(CarritoContext)
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef(null)

  const handleToggle = () => setAbierto((prev) => !prev)
  const handleCerrar = () => setAbierto(false)

  useEffect(() => {
    if (!abierto) return
    const handleClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        handleCerrar()
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleCerrar()
    }
    document.addEventListener('mousedown', handleClickFuera)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickFuera)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [abierto])

  const abrirWhatsApp = (mensaje) => {
    const texto = encodeURIComponent(mensaje)
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`, '_blank', 'noopener,noreferrer')
  }

  if (!WHATSAPP_NUMERO) return null

  return (
    <div className='whatsapp-boton' ref={contenedorRef}>
      {abierto && (
        <div className='whatsapp-panel'>
          <button className='whatsapp-panel-opcion' onClick={() => { abrirWhatsApp(SALUDO); handleCerrar() }}>
            <MessageCircle size={18} />
            <span>
              <span className='d-block fw-semibold'>Chatear por WhatsApp</span>
              <span className='d-block' style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Escríbenos directamente</span>
            </span>
          </button>
          {carrito.length > 0 && (
            <button className='whatsapp-panel-opcion' onClick={() => { abrirWhatsApp(construirMensajeCarrito(carrito, totalPagar())); handleCerrar() }}>
              <ShoppingCart size={18} />
              <span>
                <span className='d-block fw-semibold'>Enviar resumen de carrito</span>
                <span className='d-block' style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{carrito.length} producto(s) - US$ {totalPagar()}</span>
              </span>
            </button>
          )}
        </div>
      )}
      <button className='whatsapp-flotante' onClick={handleToggle} aria-label={abierto ? 'Cerrar WhatsApp' : 'Abrir WhatsApp'}>
        {abierto ? <X size={24} /> : <IconoWhatsApp />}
      </button>
    </div>
  )
}

export default BotonWhatsApp
