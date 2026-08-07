import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { KeyRound, Mail } from 'lucide-react'

const LostPassPage = () => {

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const { register, handleSubmit } = useForm()

  const enviar = async (data) => {
    if (!data.email) return setError("Ingrese un email por favor..")
    setError(null)
    setSuccess(null)
    setError("Funcion no disponible actualmente.")
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
                <KeyRound size={28} style={{ color: 'var(--primary)' }} />
              </div>
              <h4 className='fw-bold mb-1'>Restablecer Contrasena</h4>
              <p className='text-muted' style={{ fontSize: '0.875rem' }}>
                Ingresa tu email y te enviaremos un enlace para crear una nueva contrasena.
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

            <form onSubmit={handleSubmit(enviar)}>
              <div className='mb-4'>
                <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Email</label>
                <div className='input-group'>
                  <span className='input-group-text'><Mail size={16} /></span>
                  <input
                    type="email"
                    className='form-control'
                    placeholder='tu@email.com'
                    {...register('email')}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Enviar enlace
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LostPassPage
