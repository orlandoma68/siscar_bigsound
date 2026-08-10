import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import useContactosNoLeidos from '../../js/useContactosNoLeidos'
import { Package, Layers, DollarSign, Box, ShoppingBag, User, MessageSquare } from 'lucide-react'

const API_URL = import.meta.env.VITE_URL_SERVER;

const DasboardPage = () => {

  const { user, esAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { cantidad: contactosNoLeidos } = useContactosNoLeidos(esAdmin)

  useEffect(() => {
    if (!esAdmin) {
      setLoading(false)
      return
    }
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/productos/stats`)
        const data = await res.json()
        if (data.ok) {
          setStats(data.data)
        }
      } catch (error) {
        console.error("Error al cargar estadisticas:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [esAdmin])

  if (!esAdmin) {
    return (
      <div className='container py-4' style={{ maxWidth: '800px' }}>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <div>
            <h4 className='fw-bold mb-1'>
              Bienvenido, {user?.nombre || user?.email || 'Usuario'}
            </h4>
            <p className='text-muted mb-0' style={{ fontSize: '0.875rem' }}>
              Este es tu panel personal
            </p>
          </div>
        </div>

        <div className='row g-3'>
          <div className='col-12'>
            <div className='card p-4'>
              <h5 className='fw-bold mb-3'>Mi Perfil</h5>
              <div className='d-flex align-items-center gap-3 mb-3'>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <div className='fw-medium'>{user?.nombre || 'Sin nombre'}</div>
                  <div className='text-muted' style={{ fontSize: '0.8125rem' }}>{user?.email}</div>
                </div>
              </div>
              <Link to="/admin/profile" className='btn btn-outline-primary btn-sm'>
                Ver mi perfil
              </Link>
            </div>
          </div>

          <div className='col-12'>
            <div className='card p-4'>
              <div className='d-flex align-items-center gap-2 mb-2'>
                <ShoppingBag size={18} style={{ color: 'var(--primary)' }} />
                <h5 className='fw-bold mb-0'>Mis Compras</h5>
              </div>
              <p className='text-muted mb-3' style={{ fontSize: '0.875rem' }}>
                Consulta todos los pedidos que has realizado en la tienda.
              </p>
              <Link to="/admin/pedidos" className='btn btn-primary btn-sm d-flex align-items-center gap-2' style={{ width: 'fit-content' }}>
                <ShoppingBag size={14} />
                Ver mis pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container-fluid py-4 px-4' style={{ maxWidth: '1200px' }}>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h1 className='fs-4 fw-bold mb-1'>
            Bienvenido, {user?.nombre || user?.email || 'Usuario'}
          </h1>
          <p className='text-muted mb-0' style={{ fontSize: '0.875rem' }}>
            Panel de administracion de tu tienda
          </p>
        </div>
      </div>

      {loading ? (
        <div className='text-center py-5'>
          <div className='spinner-border' role='status'></div>
          <p className='mt-3 text-muted'>Cargando estadisticas...</p>
        </div>
      ) : (
        <>
          {contactosNoLeidos > 0 && (
            <div className='alert alert-warning d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4' role='alert'>
              <div className='d-flex align-items-center gap-2'>
                <MessageSquare size={18} />
                <span style={{ fontSize: '0.875rem' }}>
                  Tienes <strong>{contactosNoLeidos}</strong> mensaje{contactosNoLeidos !== 1 ? 's' : ''} de contacto sin leer.
                </span>
              </div>
              <Link to="/admin/contactos" className='btn btn-sm btn-outline-dark'>
                Ver mensajes
              </Link>
            </div>
          )}

          <div className='row g-3 mb-4'>
            <div className='col-12 col-sm-6 col-lg-3'>
              <div className='dashboard-stat-card'>
                <div className='d-flex justify-content-between align-items-start'>
                  <div>
                    <div className='stat-label mb-1'>Total Productos</div>
                    <div className='stat-value'>{stats?.totalProductos || 0}</div>
                  </div>
                  <div className='stat-icon' style={{ background: '#dbeafe', color: '#2563eb' }}>
                    <Package size={24} />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-sm-6 col-lg-3'>
              <div className='dashboard-stat-card'>
                <div className='d-flex justify-content-between align-items-start'>
                  <div>
                    <div className='stat-label mb-1'>Categorias</div>
                    <div className='stat-value'>{stats?.totalCategorias || 0}</div>
                  </div>
                  <div className='stat-icon' style={{ background: '#dcfce7', color: '#16a34a' }}>
                    <Layers size={24} />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-sm-6 col-lg-3'>
              <div className='dashboard-stat-card'>
                <div className='d-flex justify-content-between align-items-start'>
                  <div>
                    <div className='stat-label mb-1'>Stock Total</div>
                    <div className='stat-value'>{stats?.stockTotal || 0}</div>
                  </div>
                  <div className='stat-icon' style={{ background: '#fef3c7', color: '#f59e0b' }}>
                    <Box size={24} />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-sm-6 col-lg-3'>
              <div className='dashboard-stat-card'>
                <div className='d-flex justify-content-between align-items-start'>
                  <div>
                    <div className='stat-label mb-1'>Valor Inventario</div>
                    <div className='stat-value' style={{ fontSize: '1.25rem' }}>
                      US$ {stats?.precioTotal?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div className='stat-icon' style={{ background: '#f3e8ff', color: '#9333ea' }}>
                    <DollarSign size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row g-3'>
            <div className='col-12 col-lg-7'>
              <div className='card p-4'>
                <h5 className='fw-bold mb-3'>Productos por Categoria</h5>
                {stats?.productosPorCategoria?.length > 0 ? (
                  <div className='d-flex flex-column gap-2'>
                    {stats.productosPorCategoria.map((cat, idx) => (
                      <div key={idx} className='d-flex align-items-center gap-3'>
                        <span style={{ fontSize: '0.875rem', minWidth: '120px', fontWeight: 500 }}>
                          {cat.categoria}
                        </span>
                        <div className='flex-grow-1' style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${(cat.cantidad / stats.totalProductos) * 100}%`,
                            background: 'var(--primary)',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', minWidth: '30px', textAlign: 'right' }}>
                          {cat.cantidad}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-muted'>No hay datos disponibles</p>
                )}
              </div>
            </div>

            <div className='col-12 col-lg-5'>
              <div className='card p-4'>
                <h5 className='fw-bold mb-3'>Perfil</h5>
                <div className='d-flex flex-column gap-2'>
                  <div className='d-flex justify-content-between py-2' style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className='text-muted' style={{ fontSize: '0.875rem' }}>Nombre</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {user?.nombre || 'Sin nombre'}
                    </span>
                  </div>
                  <div className='d-flex justify-content-between py-2' style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className='text-muted' style={{ fontSize: '0.875rem' }}>Email</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {user?.email}
                    </span>
                  </div>
                  <div className='d-flex justify-content-between py-2'>
                    <span className='text-muted' style={{ fontSize: '0.875rem' }}>Estado</span>
                    <span className='badge' style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.75rem', padding: '0.25rem 0.625rem', borderRadius: '6px' }}>
                      Activo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DasboardPage;
