import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'react-hot-toast'
import { notific } from '../../js/notificacion'
import { Mail, Phone, User, MessageSquare, Send, CheckCircle } from 'lucide-react'

const API_URL = import.meta.env.VITE_URL_SERVER;

const ContactPage = () => {

  const { register, handleSubmit, reset } = useForm()
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const enviar = async (data) => {
    setEnviando(true)
    try {
      const res = await fetch(`${API_URL}/contactos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (!result.ok) {
        toast.error(result.message || 'Error al enviar el mensaje', notific)
        return
      }
      reset()
      setEnviado(true)
      toast.success('Mensaje enviado correctamente', notific)
    } catch (error) {
      console.error("Error al enviar contacto:", error)
      toast.error('Error al enviar el mensaje', notific)
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className='container my-5'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-6 col-lg-5'>
            <div className='card p-5 text-center'>
              <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
              <h4 className='fw-bold mb-2'>Mensaje enviado</h4>
              <p className='text-muted mb-4' style={{ fontSize: '0.875rem' }}>
                Gracias por escribirnos, te responderemos a la brevedad.
              </p>
              <button className='btn btn-outline-primary' onClick={() => setEnviado(false)}>
                Enviar otro mensaje
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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
                  <textarea className='form-control' rows={4} placeholder='Escriba su mensaje..' {...register('mensaje', { required: true })} />
                </div>
              </div>

              <button className='btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2' type='submit' disabled={enviando}>
                {enviando ? 'Enviando...' : (<><Send size={16} /> Enviar mensaje</>)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
