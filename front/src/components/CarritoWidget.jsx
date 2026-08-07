import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'

const CarritoWidget = ({ cantidadProductosCarrito }) => {

  return (
    <Link className='d-flex align-items-center gap-1 text-decoration-none' to="/carrito" style={{ color: 'var(--text)' }}>
      <div style={{ position: 'relative' }}>
        <ShoppingCart size={20} />
        <span style={{
          position: 'absolute',
          top: '-6px',
          right: '-8px',
          background: 'var(--danger)',
          color: 'white',
          fontSize: '0.625rem',
          fontWeight: 700,
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {cantidadProductosCarrito()}
        </span>
      </div>
      <span style={{ fontSize: '0.8125rem', fontWeight: 500 }} className='d-none d-md-inline'>
        Carrito
      </span>
    </Link>
  )
}

export default CarritoWidget
