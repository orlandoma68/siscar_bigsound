import React from 'react'
import about from "../../imagen/about.png"
import { Truck, Shield, Headphones } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className='container my-5'>
      <div className='row justify-content-center align-items-center g-4 mb-5'>
        <div className='col-12 col-md-5'>
          <div className='rounded-3 overflow-hidden' style={{ maxHeight: '350px' }}>
            <img src={about} alt="img-about" className="img-fluid w-100" style={{ objectFit: 'cover', height: '350px' }} />
          </div>
        </div>
        <div className='col-12 col-md-6'>
          <h3 className='fw-bold mb-3'>Sobre BIGSOUND</h3>
          <p style={{ fontSize: '0.9375rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
            Somos un sitio dedicado a ofrecerte los mejores productos de automocion con envios a todo el interior del pais.
            Trabajamos con las mejores marcas para garantizar la calidad y satisfaccion de nuestros clientes.
          </p>
        </div>
      </div>

      <div className='row g-4'>
        <div className='col-12 col-md-4'>
          <div className='card p-4 text-center h-100'>
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
              <Truck size={28} style={{ color: 'var(--primary)' }} />
            </div>
            <h6 className='fw-semibold'>Envios a todo el pais</h6>
            <p className='text-muted mb-0' style={{ fontSize: '0.8125rem' }}>
              Realizamos envios a todas las provincias del pais.
            </p>
          </div>
        </div>
        <div className='col-12 col-md-4'>
          <div className='card p-4 text-center h-100'>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: '#dcfce7',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Shield size={28} style={{ color: '#16a34a' }} />
            </div>
            <h6 className='fw-semibold'>Calidad garantizada</h6>
            <p className='text-muted mb-0' style={{ fontSize: '0.8125rem' }}>
              Solo trabajamos con productos de primera calidad.
            </p>
          </div>
        </div>
        <div className='col-12 col-md-4'>
          <div className='card p-4 text-center h-100'>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: '#fef3c7',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Headphones size={28} style={{ color: '#f59e0b' }} />
            </div>
            <h6 className='fw-semibold'>Soporte tecnico</h6>
            <p className='text-muted mb-0' style={{ fontSize: '0.8125rem' }}>
              Nuestro equipo esta disponible para ayudarte.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
