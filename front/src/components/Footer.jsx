import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {

  return (
    <footer style={{ background: '#1e293b', color: '#cbd5e1' }}>
      <div className='container py-5'>
        <div className='row g-4'>
          <div className='col-12 col-md-6 col-lg-4'>
            <h5 className='fw-bold text-white mb-3' style={{ fontSize: '1.125rem' }}>BIGSOUND</h5>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.7' }}>
              Somos un sitio dedicado a ofrecerte los mejores productos de automocion con envios a todo el pais.
            </p>
          </div>

          <div className='col-12 col-md-6 col-lg-2'>
            <h6 className='fw-semibold text-white mb-3' style={{ fontSize: '0.875rem' }}>Enlaces</h6>
            <ul className='list-unstyled d-flex flex-column gap-2'>
              <li><Link to="/" className='text-decoration-none' style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Inicio</Link></li>
              <li><Link to="/about" className='text-decoration-none' style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Nosotros</Link></li>
              <li><Link to="/contact" className='text-decoration-none' style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Contacto</Link></li>
            </ul>
          </div>

          <div className='col-12 col-md-6 col-lg-3'>
            <h6 className='fw-semibold text-white mb-3' style={{ fontSize: '0.875rem' }}>Servicios</h6>
            <ul className='list-unstyled d-flex flex-column gap-2'>
              <li style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Compra y venta de productos</li>
              <li style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Logistica y distribucion</li>
              <li style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Asesoramiento tecnico</li>
              <li style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Entregas a domicilio</li>
            </ul>
          </div>

          <div className='col-12 col-md-6 col-lg-3'>
            <h6 className='fw-semibold text-white mb-3' style={{ fontSize: '0.875rem' }}>Contacto</h6>
            <ul className='list-unstyled d-flex flex-column gap-2'>
              <li className='d-flex align-items-center gap-2' style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                <MapPin size={14} /> LIMA, Peru
              </li>
              <li className='d-flex align-items-center gap-2'>
                <Phone size={14} style={{ color: '#94a3b8' }} />
                <Link to="tel:+1234567890" className='text-decoration-none' style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  +1 (234) 12-345
                </Link>
              </li>
              <li className='d-flex align-items-center gap-2'>
                <Mail size={14} style={{ color: '#94a3b8' }} />
                <Link to="mailto:siscar@gmail.com" className='text-decoration-none' style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  bigsound@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #334155' }}>
        <div className='container py-3 d-flex justify-content-between align-items-center flex-wrap' style={{ gap: '0.5rem' }}>
          <p className='mb-0' style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            &copy; 2025 BIGSOUND. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
