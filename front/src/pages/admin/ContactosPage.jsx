import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import { notific } from '../../js/notificacion'
import useContactosNoLeidos from '../../js/useContactosNoLeidos'
import { MessageSquare, User, Mail, Phone, CheckCheck, Send, Trash2 } from 'lucide-react'
import ModalConfirmar from '../../components/ModalConfirmar'

const API_URL = import.meta.env.VITE_URL_SERVER;

const estilosEstado = {
    nuevo: { background: '#fee2e2', color: '#dc2626' },
    leido: { background: '#dbeafe', color: '#2563eb' },
    respondido: { background: '#dcfce7', color: '#16a34a' }
}

const formatearFecha = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha).toLocaleString()
}

const ContactosPage = () => {

    const { esAdmin } = useAuth()
    const [contactos, setContactos] = useState([])
    const [loading, setLoading] = useState(true)
    const [filtro, setFiltro] = useState('todos')
    const [contactoAEliminar, setContactoAEliminar] = useState(null)
    const { refrescar } = useContactosNoLeidos()

    const token = localStorage.getItem('token')

    const cargarContactos = async () => {
        try {
            const res = await fetch(`${API_URL}/contactos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.ok) {
                setContactos(data.data)
            } else {
                toast.error(data.message || 'Error al cargar mensajes', notific)
            }
        } catch (error) {
            console.error("Error al cargar contactos:", error)
            toast.error("Error al cargar mensajes", notific)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarContactos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [esAdmin])

    const cambiarEstado = async (id, estado) => {
        try {
            const res = await fetch(`${API_URL}/contactos/${id}/estado`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado })
            })
            const data = await res.json()
            if (!data.ok) throw new Error(data.message || 'Error')
            toast.success(`Mensaje marcado como ${estado}`, notific)
            refrescar()
            cargarContactos()
        } catch (error) {
            toast.error(error.message || 'Error al actualizar estado', notific)
        }
    }

    const eliminarContacto = async (id) => {
        try {
            const res = await fetch(`${API_URL}/contactos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (!data.ok) throw new Error(data.message || 'Error')
            toast.success('Mensaje eliminado', notific)
            refrescar()
            cargarContactos()
        } catch (error) {
            toast.error(error.message || 'Error al eliminar el mensaje', notific)
        }
    }

    const contactosFiltrados = filtro === 'todos'
        ? contactos
        : contactos.filter((c) => c.estado === filtro)

    return (
        <>
        <div className='container-fluid py-4 px-4' style={{ maxWidth: '1200px' }}>
            <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2'>
                <div>
                    <h4 className='fw-bold mb-1'>Mensajes de Contacto</h4>
                    <p className='text-muted mb-0' style={{ fontSize: '0.875rem' }}>
                        {contactos.length} mensajes recibidos
                    </p>
                </div>
                <div className='d-flex gap-1 flex-wrap'>
                    {['todos', 'nuevo', 'leido', 'respondido'].map((opcion) => (
                        <button
                            key={opcion}
                            onClick={() => setFiltro(opcion)}
                            className={`btn btn-sm ${filtro === opcion ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={{ fontSize: '0.8125rem' }}
                        >
                            {opcion[0].toUpperCase() + opcion.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className='text-center py-5'>
                    <div className='spinner-border' role='status'></div>
                    <p className='mt-3 text-muted'>Cargando mensajes...</p>
                </div>
            ) : contactosFiltrados.length > 0 ? (
                <div className='d-flex flex-column gap-3'>
                    {contactosFiltrados.map((contacto) => (
                        <div key={contacto.id} className='card p-4'>
                            <div className='d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2'>
                                <div>
                                    <div className='fw-bold' style={{ fontSize: '0.9375rem' }}>
                                        {contacto.nombre}
                                    </div>
                                    <div className='text-muted' style={{ fontSize: '0.8125rem' }}>
                                        {formatearFecha(contacto.fecha)}
                                    </div>
                                </div>
                                <span className='badge' style={{
                                    background: estilosEstado[contacto.estado]?.background || '#f1f5f9',
                                    color: estilosEstado[contacto.estado]?.color || '#64748b',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 500
                                }}>
                                    {contacto.estado}
                                </span>
                            </div>

                            <div className='d-flex flex-column gap-1 mb-3' style={{ fontSize: '0.8125rem' }}>
                                <div className='d-flex align-items-center gap-2'>
                                    <Mail size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                    <a href={`mailto:${contacto.email}`} style={{ color: 'var(--primary)' }}>{contacto.email}</a>
                                </div>
                                {contacto.telefono && (
                                    <div className='d-flex align-items-center gap-2'>
                                        <Phone size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                        <span>{contacto.telefono}</span>
                                    </div>
                                )}
                            </div>

                            <div className='p-3 rounded-3 mb-3' style={{ background: 'var(--bg)' }}>
                                <div className='d-flex align-items-center gap-2 mb-2'>
                                    <MessageSquare size={16} style={{ color: 'var(--text-muted)' }} />
                                    <span className='text-muted' style={{ fontSize: '0.75rem' }}>Mensaje</span>
                                </div>
                                <div style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{contacto.mensaje}</div>
                            </div>

                            <div className='d-flex justify-content-end gap-2'>
                                {contacto.estado !== 'leido' && (
                                    <button
                                        className='btn btn-sm btn-outline-primary d-flex align-items-center gap-1'
                                        onClick={() => cambiarEstado(contacto.id, 'leido')}
                                        style={{ fontSize: '0.8125rem', padding: '0.25rem 0.625rem' }}
                                    >
                                        <CheckCheck size={14} />
                                        Marcar leido
                                    </button>
                                )}
                                {contacto.estado !== 'respondido' && (
                                    <button
                                        className='btn btn-sm btn-outline-success d-flex align-items-center gap-1'
                                        onClick={() => cambiarEstado(contacto.id, 'respondido')}
                                        style={{ fontSize: '0.8125rem', padding: '0.25rem 0.625rem' }}
                                    >
                                        <Send size={14} />
                                        Respondido
                                    </button>
                                )}
                                <a
                                    href={`mailto:${contacto.email}?subject=Respuesta a tu mensaje - Bigsound`}
                                    className='btn btn-sm btn-primary d-flex align-items-center gap-1'
                                    style={{ fontSize: '0.8125rem', padding: '0.25rem 0.625rem' }}
                                >
                                    <Mail size={14} />
                                    Responder
                                </a>
                                <button
                                    className='btn btn-sm btn-outline-danger d-flex align-items-center gap-1'
                                    onClick={() => setContactoAEliminar(contacto)}
                                    data-bs-toggle='modal'
                                    data-bs-target='#modalEliminarContacto'
                                    style={{ fontSize: '0.8125rem', padding: '0.25rem 0.625rem' }}
                                >
                                    <Trash2 size={14} />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='card p-5 text-center'>
                    <User size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h5 className='fw-semibold mb-2'>No hay mensajes</h5>
                    <p className='text-muted mb-0' style={{ fontSize: '0.875rem' }}>
                        {filtro === 'todos' ? 'Aun no se han recibido mensajes de contacto.' : `No hay mensajes con estado "${filtro}".`}
                    </p>
                </div>
            )}
        </div>
        <ModalConfirmar
            id='modalEliminarContacto'
            titulo='Eliminar mensaje'
            mensaje={`¿Seguro que deseas eliminar el mensaje de "${contactoAEliminar?.nombre || ''}"? Esta accion no se puede deshacer.`}
            onConfirmar={() => {
                if (contactoAEliminar) eliminarContacto(contactoAEliminar.id)
                setContactoAEliminar(null)
            }}
        />
        </>
    )
}

export default ContactosPage
