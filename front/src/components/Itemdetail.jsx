import React, { useContext } from 'react'
import ItemCount from './ItemCount'
import ZoomImagen from './ZoomImagen'
import { CarritoContext } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const API_URL = import.meta.env.VITE_URL_SERVER;

const Itemdetail = ({ item }) => {

  const { user } = useAuth()
  const { agregarProductosCarrito, eliminarProductosCarrito, sacarProductosCarrito } = useContext(CarritoContext)

  return (
    <>
      {item && (
        <div className='container py-5'>
          <Link to="/" className='d-inline-flex align-items-center gap-1 text-decoration-none mb-4' style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} />
            Volver a productos
          </Link>
          <div className='row g-4 justify-content-center'>
            <div className='col-12 col-md-5'>
              <div className='card overflow-hidden'>
                <ZoomImagen src={`${API_URL}/uploads/${item.imagen}`} alt={item.nombre} />
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='mb-2'>
                <span className='badge' style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>
                  {item.categoria}
                </span>
              </div>
              <h3 className='fw-bold mb-3'>{item.nombre}</h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                {item.descripcion}
              </p>

              {user ? (
                <p className='fw-bold mb-4' style={{ color: 'var(--primary)', fontSize: '1.75rem' }}>
                  US$ {item.precio}
                </p>
              ) : (
                <Link to="/auth/login" className='btn btn-outline-warning mb-4'>
                  Inicia sesion para ver precios
                </Link>
              )}

              <ItemCount
                handleSacarCarrito={() => { sacarProductosCarrito(item) }}
                handleEliminarCarrito={() => { eliminarProductosCarrito(item) }}
                handleAgregarCarrito={() => { agregarProductosCarrito(item) }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Itemdetail
