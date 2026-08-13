import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { KeyRound, Mail, Lock } from 'lucide-react'

const LostPassPage = () => {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { olvidarPassword, restablecerPassword } = useAuth()

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [enlaceDev, setEnlaceDev] = useState(null)
  const { register, handleSubmit } = useForm()

  const enviar = async (data) => {
    if (!data.email) return setError('Ingrese un email por favor..')
    setError(null)
    setSuccess(null)
    setEnlaceDev(null)
    setLoading(true)
    try {
      const result = await olvidarPassword(data.email)
      if (result.enlace) setEnlaceDev(result.enlace)
      setSuccess(result.message || 'Revisa tu bandeja de entrada.')
    } catch (err) {
      setError(err.message || 'Error al enviar el enlace')
    } finally {
      setLoading(false)
    }
  }

  const restablecer = async (data) => {
    if (data.password !== data.confirmar) return setError('Las contrasenas no coinciden')
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const result = await restablecerPassword(token, data.password)
      setSuccess(result.message || 'Contrasena restablecida exitosamente')
      setTimeout(() => navigate('/auth/login'), 2000)
    } catch (err) {
      setError(err.message || 'Error al restablecer la contrasena')
    } finally {
      setLoading(false)
    }
  }

  const esRestablecer = Boolean(token)

  return (
    <div className='container my-5'>
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
                <KeyRound size={28} style={{ color: 'var(--primary)' }} />
              </div>
              <h4 className='fw-bold mb-1'>
                {esRestablecer ? 'Nueva Contrasena' : 'Restablecer Contrasena'}
              </h4>
              <p className='text-muted' style={{ fontSize: '0.875rem' }}>
                {esRestablecer
                  ? 'Ingresa tu nueva contrasena para acceder a tu cuenta.'
                  : 'Ingresa tu email y te enviaremos un enlace para crear una nueva contrasena.'}
              </p>
            </div>

            {error && (
              <div className='alert alert-danger py-2' style={{ fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            {success && (
              <div className='alert alert-success py-2' style={{ fontSize: '0.875rem' }}>
                {success}
              </div>
            )}

            {enlaceDev && (
              <div className='alert alert-warning py-2' style={{ fontSize: '0.8125rem', wordBreak: 'break-all' }}>
                <strong>Modo dev (sin SMTP):</strong> enlace de restablecimiento generado.
                <br />
                <a href={enlaceDev}>{enlaceDev}</a>
              </div>
            )}

            {esRestablecer ? (
              <form onSubmit={handleSubmit(restablecer)}>
                <div className='mb-3'>
                  <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Nueva Contrasena</label>
                  <div className='input-group'>
                    <span className='input-group-text'><Lock size={16} /></span>
                    <input
                      type="password"
                      className='form-control'
                      placeholder='Minimo 6 caracteres'
                      {...register('password', { required: true, minLength: 6 })}
                    />
                  </div>
                </div>

                <div className='mb-4'>
                  <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Confirmar Contrasena</label>
                  <div className='input-group'>
                    <span className='input-group-text'><Lock size={16} /></span>
                    <input
                      type="password"
                      className='form-control'
                      placeholder='Repite tu contrasena'
                      {...register('confirmar', { required: true })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar Contrasena'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit(enviar)}>
                <div className='mb-4'>
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
                <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>
            )}

            <div className='text-center' style={{ fontSize: '0.875rem' }}>
              <span className='text-muted'>Recuerdas tu contrasena? </span>
              <Link to="/auth/login" className='text-decoration-none' style={{ color: 'var(--primary)', fontWeight: 500 }}>
                Iniciar sesion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LostPassPage
