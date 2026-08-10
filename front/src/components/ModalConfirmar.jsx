import React from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'

const ModalConfirmar = ({ id, titulo, mensaje, textoConfirmar = "Eliminar", onConfirmar }) => {
    return (
        <div id={id} className='modal fade' aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h5 className='fw-bold mb-0'>{titulo}</h5>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Cerrar'></button>
                    </div>
                    <div className='modal-body'>
                        <div className='d-flex align-items-start gap-3'>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: '#fee2e2',
                                color: '#dc2626',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <AlertTriangle size={22} />
                            </div>
                            <p className='mb-0 pt-1' style={{ fontSize: '0.875rem' }}>{mensaje}</p>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' className='btn btn-outline-secondary' data-bs-dismiss='modal'>
                            Cancelar
                        </button>
                        <button
                            type='button'
                            className='btn btn-danger d-flex align-items-center gap-2'
                            data-bs-dismiss='modal'
                            onClick={onConfirmar}
                        >
                            <Trash2 size={16} />
                            {textoConfirmar}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalConfirmar
