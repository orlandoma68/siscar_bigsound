import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { UserPlus, Mail, Lock, User } from 'lucide-react'

const RegisterPage = () => {

  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const { register, handleSubmit } = useForm()

  const enviar = async (data) => {
    try {
      setError(null)
      setLoading(true)
      await signUp(data.nombre, data.email, data.password)
      return navigate('/auth/login')
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

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
                <UserPlus size={28} style={{ color: 'var(--primary)' }} />
              </div>
              <h4 className='fw-bold mb-1'>Crear Cuenta</h4>
              <p className='text-muted' style={{ fontSize: '0.875rem' }}>
                Registrate para empezar a comprar
              </p>
            </div>

            {error && (
              <div className='alert alert-danger py-2' style={{ fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(enviar)}>
              <div className='mb-3'>
                <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Nombre</label>
                <div className='input-group'>
                  <span className='input-group-text'><User size={16} /></span>
                  <input
                    type="text"
                    className='form-control'
                    placeholder='Tu nombre'
                    {...register('nombre', { required: true })}
                  />
                </div>
              </div>

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

              <div className='mb-4'>
                <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Contrasena</label>
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

              <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </button>
            </form>

            <div className='text-center' style={{ fontSize: '0.875rem' }}>
              <span className='text-muted'>Ya tienes cuenta? </span>
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

export default RegisterPage
