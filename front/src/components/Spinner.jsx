import React from 'react'

const Spinner = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
      <div className="spinner-border mb-3" role="status" aria-hidden="true"></div>
      <strong style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Cargando datos...</strong>
    </div>
  )
}

export default Spinner
