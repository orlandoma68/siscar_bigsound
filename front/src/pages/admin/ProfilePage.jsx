import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Mail, Shield, LogOut } from 'lucide-react'

const ProfilePage = () => {

  const { user, rol, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className='container py-4' style={{ maxWidth: '800px' }}>
      <h4 className='fw-bold mb-4'>Mi Perfil</h4>

      <div className='card p-4 mb-4'>
        <div className='d-flex align-items-center gap-4 mb-4'>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={36} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h5 className='fw-bold mb-1'>{user?.nombre || 'Usuario'}</h5>
            <p className='text-muted mb-0' style={{ fontSize: '0.875rem' }}>{user?.email}</p>
          </div>
        </div>

        <div className='d-flex flex-column gap-3'>
          <div className='d-flex align-items-center gap-3 py-3' style={{ borderBottom: '1px solid var(--border)' }}>
            <User size={18} style={{ color: 'var(--text-muted)' }} />
            <div>
              <div className='text-muted' style={{ fontSize: '0.75rem' }}>Nombre</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.nombre || 'Sin nombre'}</div>
            </div>
          </div>

          <div className='d-flex align-items-center gap-3 py-3' style={{ borderBottom: '1px solid var(--border)' }}>
            <Mail size={18} style={{ color: 'var(--text-muted)' }} />
            <div>
              <div className='text-muted' style={{ fontSize: '0.75rem' }}>Email</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.email}</div>
            </div>
          </div>

          <div className='d-flex align-items-center gap-3 py-3' style={{ borderBottom: '1px solid var(--border)' }}>
            <Shield size={18} style={{ color: 'var(--text-muted)' }} />
            <div>
              <div className='text-muted' style={{ fontSize: '0.75rem' }}>Rol</div>
              <span className='badge' style={{
                background: rol === 'ADMIN' ? '#dcfce7' : 'var(--primary-light)',
                color: rol === 'ADMIN' ? '#16a34a' : 'var(--primary)',
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                {rol || 'Sin rol'}
              </span>
            </div>
          </div>

          <div className='d-flex align-items-center gap-3 py-3'>
            <div className='text-muted' style={{ fontSize: '0.75rem', width: '18px' }}></div>
            <div>
              <div className='text-muted' style={{ fontSize: '0.75rem' }}>Estado</div>
              <span className='badge' style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.75rem', padding: '0.25rem 0.625rem', borderRadius: '6px' }}>
                Activo
              </span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleLogout} className='btn btn-outline-danger d-flex align-items-center gap-2'>
        <LogOut size={16} />
        Cerrar Sesion
      </button>
    </div>
  )
}

export default ProfilePage
