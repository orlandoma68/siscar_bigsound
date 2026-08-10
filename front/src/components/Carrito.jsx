import { useContext } from "react"
import { Link } from 'react-router-dom'
import { CarritoContext } from "../context/CarritoContext"
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react'

const API_URL = import.meta.env.VITE_URL_SERVER;

const Carrito = () => {

  const { carrito, vaciarCarrito, cantidadProductosCarrito, totalPagar, eliminarProductosCarrito, sacarProductosCarrito, agregarProductosCarrito } = useContext(CarritoContext)

  return (
    <div className='container py-4' style={{ maxWidth: '1000px' }}>
      <h4 className='fw-bold mb-4'>Carrito de Compras</h4>

      {carrito.length > 0 ? (
        <div className='row g-4'>
          <div className='col-12 col-lg-8'>
            <div className='card p-3'>
              {carrito.map((prod) => (
                <div key={prod.id} className='d-flex align-items-center gap-3 py-3' style={{ borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      className="img-fluid w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      src={`${API_URL}/uploads/${prod.imagen}`}
                      alt={prod.nombre}
                    />
                  </div>
                  <div className='flex-grow-1'>
                    <h6 className='fw-semibold mb-1'>{prod.nombre}</h6>
                    <p className='text-muted mb-1' style={{ fontSize: '0.8125rem' }}>{prod.descripcion?.slice(0, 40)}</p>
                    <p className='fw-bold mb-0' style={{ color: 'var(--primary)', fontSize: '0.9375rem' }}>
                      US$ {prod.precio}
                    </p>
                  </div>
                  <div className='d-flex flex-column align-items-end gap-2'>
                    <div className='d-flex align-items-center' style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                      {prod.cantidad === 1 ? (
                        <button onClick={() => eliminarProductosCarrito(prod)} className='btn btn-sm border-0' style={{ padding: '0.375rem 0.625rem' }}>
                          <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                        </button>
                      ) : (
                        <button onClick={() => sacarProductosCarrito(prod)} className='btn btn-sm border-0' style={{ padding: '0.375rem 0.625rem' }}>
                          <Minus size={14} />
                        </button>
                      )}
                      <span className='px-2 fw-medium' style={{ fontSize: '0.875rem' }}>{prod.cantidad}</span>
                      <button onClick={() => agregarProductosCarrito(prod)} className='btn btn-sm border-0' style={{ padding: '0.375rem 0.625rem' }}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className='fw-semibold mb-0' style={{ fontSize: '0.875rem' }}>
                      Subtotal: US$ {(prod.precio * prod.cantidad).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className='d-flex justify-content-between align-items-center mt-3'>
                <button className='btn btn-outline-danger btn-sm d-flex align-items-center gap-1' onClick={vaciarCarrito}>
                  <Trash2 size={14} />
                  Vaciar Carrito
                </button>
                <Link to="/" className='btn btn-outline-primary btn-sm'>
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>

          <div className='col-12 col-lg-4'>
            <div className='card p-4'>
              <h5 className='fw-bold mb-3'>Resumen</h5>
              <div className='d-flex justify-content-between py-2' style={{ borderBottom: '1px solid var(--border)' }}>
                <span className='text-muted'>Productos</span>
                <span className='fw-medium'>{cantidadProductosCarrito()}</span>
              </div>
              <div className='d-flex justify-content-between py-3'>
                <span className='fw-bold'>Total</span>
                <span className='fw-bold' style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>
                  US$ {totalPagar()}
                </span>
              </div>
              <Link className='btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2' to="/checkout">
                <ShoppingCart size={16} />
                Finalizar su compra
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className='card p-5 text-center'>
          <div className='d-flex flex-column align-items-center'>
            <ShoppingCart size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h5 className='fw-semibold mb-2'>El carrito esta vacio</h5>
            <p className='text-muted mb-4' style={{ fontSize: '0.875rem' }}>
              Agrega productos para comenzar tu compra
            </p>
            <Link to="/" className='btn btn-primary'>
              Explorar productos
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Carrito
