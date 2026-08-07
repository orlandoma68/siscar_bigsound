import React from 'react'
import { useForm } from "react-hook-form"
import { Mail, Phone, User, MessageSquare, Send } from 'lucide-react'

const ContactPage = () => {

  const { register, handleSubmit, reset } = useForm()

  const enviar = (data) => {
    console.log("enviando....", data)
    reset()
  }

  return (
    <div className='container my-5'>
      <div className='row justify-content-center'>
        <div className='col-12 col-md-6 col-lg-5'>
          <div className='card p-4'>
            <div className='text-center mb-4'>
              <h4 className='fw-bold mb-1'>Contacto</h4>
              <p className='text-muted' style={{ fontSize: '0.875rem' }}>
                Dejanos tu mensaje y te responderemos a la brevedad.
              </p>
            </div>

            <form onSubmit={handleSubmit(enviar)}>
              <div className='mb-3'>
                <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Nombre</label>
                <div className='input-group'>
                  <span className='input-group-text'><User size={16} /></span>
                  <input className='form-control' type="text" placeholder='Tu nombre' {...register('nombre', { required: true })} />
                </div>
              </div>

              <div className='mb-3'>
                <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Email</label>
                <div className='input-group'>
                  <span className='input-group-text'><Mail size={16} /></span>
                  <input className='form-control' type="email" placeholder='tu@email.com' {...register('email', { required: true })} />
                </div>
              </div>

              <div className='mb-3'>
                <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Telefono</label>
                <div className='input-group'>
                  <span className='input-group-text'><Phone size={16} /></span>
                  <input className='form-control' type="tel" placeholder='Tu telefono' {...register('telefono')} />
                </div>
              </div>

              <div className='mb-4'>
                <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Mensaje</label>
                <div className='input-group'>
                  <span className='input-group-text'><MessageSquare size={16} /></span>
                  <textarea className='form-control' rows={4} placeholder='Escriba su mensaje..' {...register('mensaje')} />
                </div>
              </div>

              <button className='btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2' type='submit'>
                <Send size={16} />
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
