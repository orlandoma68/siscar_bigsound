import React from 'react'
import { Link } from 'react-router-dom'
import { CarritoContext } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, Eye } from 'lucide-react'

const API_URL = import.meta.env.VITE_URL_SERVER;

const Item = ({ producto }) => {

  const { user } = useAuth()
  const { agregarProductosCarrito } = React.useContext(CarritoContext)

  return (
    <div className='col d-flex justify-content-center'>
      <div className="card h-100" style={{ width: '100%' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={`${API_URL}/uploads/${producto.imagen}`}
            alt={producto.nombre}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <span className='badge position-absolute top-0 end-0 m-2' style={{
            background: 'var(--primary)',
            fontSize: '0.6875rem',
            padding: '0.25rem 0.5rem'
          }}>
            {producto.categoria}
          </span>
        </div>
        <div className='card-body d-flex flex-column p-3'>
          <h6 className='card-title fw-semibold mb-1' style={{ fontSize: '0.9375rem' }}>
            {producto.nombre}
          </h6>
          <p className='text-muted mb-3' style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
            {producto.descripcion?.slice(0, 60)}{producto.descripcion?.length > 60 ? '...' : ''}
          </p>

          {user ? (
            <p className='fw-bold mb-3' style={{ color: 'var(--primary)', fontSize: '1.125rem' }}>
              US$ {producto.precio}
            </p>
          ) : (
            <Link to="/auth/login" className='text-decoration-none mb-3' style={{ fontSize: '0.8125rem', color: 'var(--warning)' }}>
              Inicia sesion para ver precios
            </Link>
          )}

          <div className='mt-auto d-flex gap-2'>
            <Link
              className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              to={`/item/${producto.id}`}
            >
              <Eye size={14} />
              Ver mas
            </Link>
            <button
              onClick={() => agregarProductosCarrito(producto)}
              className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
            >
              <ShoppingCart size={14} />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
