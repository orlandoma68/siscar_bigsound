import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFoundPage = () => {

  return (
    <div className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '70vh', padding: '2rem' }}>
      <h1 className='fw-bold mb-2' style={{ fontSize: '4rem', color: 'var(--primary)', letterSpacing: '-0.05em' }}>
        404
      </h1>
      <h4 className='fw-semibold mb-2'>Pagina no encontrada</h4>
      <p className='text-muted mb-4 text-center' style={{ fontSize: '0.875rem', maxWidth: '400px' }}>
        La direccion web que has solicitado no es una pagina activa de nuestro sitio.
      </p>
      <Link to="/" className='btn btn-primary d-flex align-items-center gap-2'>
        <Home size={16} />
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFoundPage
