import React from 'react'
import "../css/modalContenido.css"

const Modalcontenido = ({children, handleOpenModal, handleCloseModal}) => {
  
  return (
    <div className={`modal-contenido ${handleOpenModal && `isopen`} `}>
      <div className='modal-sub-contenido shadow'>
        <button onClick={handleCloseModal} className='boton-close fs-3 border-0 btn btn-outline-dark'></button>
        {children}
      </div>
    </div>
  )
}

export default Modalcontenido
