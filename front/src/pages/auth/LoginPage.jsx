import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { LogIn, Mail, Lock } from 'lucide-react'

const LoginPage = () => {

  const { signIn, singInWithGoogle } = useAuth()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()

  const enviar = async (data) => {
    try {
      setError(null)
      setLoading(true)
      await signIn(data.email, data.password)
    } catch (err) {
      setError(err.message || 'Credenciales invalidas')
    } finally {
      setLoading(false)
    }
  }

  const handleWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      await singInWithGoogle()
    } catch {
      setError('Error al iniciar sesion con Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container my-5">
      <div className='row justify-content-center'>
        <div className='col-12 col-md-6 col-lg-4'>
          <div className='card p-4'>
            <div className='text-center mb-4'>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'var(--primary-light)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <LogIn size={28} style={{ color: 'var(--primary)' }} />
              </div>
              <h4 className='fw-bold mb-1'>Iniciar Sesion</h4>
              <p className='text-muted' style={{ fontSize: '0.875rem' }}>
                Accede a tu cuenta de Bigsound
              </p>
            </div>

            {error && (
              <div className='alert alert-danger py-2' style={{ fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(enviar)}>
              <div className='mb-3'>
                <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Email</label>
                <div className='input-group'>
                  <span className='input-group-text'><Mail size={16} /></span>
                  <input
                    type="email"
                    className='form-control'
                    placeholder='tu@email.com'
                    {...register('email', { required: true })}
                  />
                </div>
              </div>

              <div className='mb-3'>
                <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Contrasena</label>
                <div className='input-group'>
                  <span className='input-group-text'><Lock size={16} /></span>
                  <input
                    type="password"
                    className='form-control'
                    placeholder='Tu contrasena'
                    {...register('password', { required: true })}
                  />
                </div>
              </div>

              <button type='submit' className='btn btn-primary w-100 mb-3' disabled={loading}>
                {loading ? "Accediendo..." : "Acceder"}
              </button>

              <div className='position-relative mb-3'>
                <hr />
                <span className='position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted' style={{ fontSize: '0.75rem' }}>
                  o continua con
                </span>
              </div>

              <button type='button' onClick={handleWithGoogle} disabled={loading} className='btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2'>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </form>

            <div className='text-center mt-4' style={{ fontSize: '0.875rem' }}>
              <span className='text-muted'>No tienes cuenta? </span>
              <Link to="/auth/register" className='text-decoration-none' style={{ color: 'var(--primary)', fontWeight: 500 }}>
                Registrate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
