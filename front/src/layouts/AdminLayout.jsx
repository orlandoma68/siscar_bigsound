import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NavarAdmin from '../components/NavarAdmin'
import Spinner from '../components/Spinner'
import { LogOut, Home } from 'lucide-react'

const AdminLayout = () => {

  const { user, rol, cargandoRol, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogoutAndGoHome = async () => {
    await logout()
    navigate('/')
  }

  if (cargandoRol) {
    return <Spinner />
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (rol && rol !== 'ADMIN') {
    return (
      <div className='container py-5 text-center' style={{ maxWidth: '500px' }}>
        <div className='card p-5'>
          <h3 className='fw-bold mb-2'>Acceso Denegado</h3>
          <p className='text-muted mb-4' style={{ fontSize: '0.875rem' }}>
            Tu cuenta <strong>{user.email}</strong> no tiene permisos de administrador.
          </p>
          <div className='d-flex justify-content-center gap-2'>
            <button onClick={handleLogoutAndGoHome} className='btn btn-outline-secondary d-flex align-items-center gap-2'>
              <LogOut size={16} />
              Cerrar sesion
            </button>
            <a href="/" className='btn btn-primary d-flex align-items-center gap-2'>
              <Home size={16} />
              Ir al inicio
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!rol) {
    return (
      <div className='container py-5 text-center' style={{ maxWidth: '500px' }}>
        <div className='card p-5'>
          <h4 className='fw-bold mb-2'>Sin rol asignado</h4>
          <p className='text-muted mb-4' style={{ fontSize: '0.875rem' }}>
            Tu cuenta no tiene un rol asignado en el sistema. Contacta al administrador.
          </p>
          <div className='d-flex justify-content-center gap-2'>
            <button onClick={handleLogoutAndGoHome} className='btn btn-outline-secondary d-flex align-items-center gap-2'>
              <LogOut size={16} />
              Cerrar sesion
            </button>
            <a href="/" className='btn btn-primary d-flex align-items-center gap-2'>
              <Home size={16} />
              Ir al inicio
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-100'>
      <NavarAdmin />
      <Outlet />
    </div>
  )
}

export default AdminLayout
