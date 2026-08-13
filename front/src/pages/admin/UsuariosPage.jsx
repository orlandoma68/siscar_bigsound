import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import { notific } from '../../js/notificacion'
import { Users, ShieldCheck, ShieldOff, Mail } from 'lucide-react'
import ModalConfirmar from '../../components/ModalConfirmar'

const API_URL = import.meta.env.VITE_URL_SERVER

const estilosRol = {
    ADMIN: { background: '#dcfce7', color: '#16a34a' },
    CLIENT: { background: '#dbeafe', color: '#2563eb' }
}

const UsuariosPage = () => {

    const { esAdmin, user } = useAuth()
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [cambio, setCambio] = useState(null)

    const token = localStorage.getItem('token')

    const cargarUsuarios = async () => {
        try {
            const res = await fetch(`${API_URL}/usuarios/listar`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.ok) {
                setUsuarios(data.data)
            } else {
                toast.error(data.message || 'Error al cargar usuarios', notific)
            }
        } catch (error) {
            console.error("Error al cargar usuarios:", error)
            toast.error("Error al cargar usuarios", notific)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarUsuarios()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [esAdmin])

    const confirmarCambioRol = async () => {
        if (!cambio) return
        try {
            const res = await fetch(`${API_URL}/usuarios/${cambio.id}/rol`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rol_id: cambio.rol_id })
            })
            const data = await res.json()
            if (!data.ok) throw new Error(data.message || 'Error al cambiar el rol')
            toast.success(data.message, notific)
            setCambio(null)
            cargarUsuarios()
        } catch (error) {
            toast.error(error.message || 'Error al cambiar el rol', notific)
        }
    }

    const esAdminDestino = (rol_id) => rol_id === 1
    const esUsuarioActual = (id) => Number(id) === Number(user?.id)

    return (
        <>
        <div className='container-fluid py-4 px-4' style={{ maxWidth: '1200px' }}>
            <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2'>
                <div>
                    <h4 className='fw-bold mb-1'>Usuarios</h4>
                    <p className='text-muted mb-0' style={{ fontSize: '0.875rem' }}>
                        {usuarios.length} usuarios registrados
                    </p>
                </div>
            </div>

            {loading ? (
                <div className='text-center py-5'>
                    <div className='spinner-border' role='status'></div>
                    <p className='mt-3 text-muted'>Cargando usuarios...</p>
                </div>
            ) : usuarios.length > 0 ? (
                <div className='card'>
                    <div className='table-responsive'>
                        <table className='table table-hover align-middle mb-0'>
                            <thead>
                                <tr>
                                    <th style={{ fontSize: '0.8125rem' }}>Nombre</th>
                                    <th style={{ fontSize: '0.8125rem' }}>Email</th>
                                    <th style={{ fontSize: '0.8125rem' }}>Rol</th>
                                    <th className='text-end' style={{ fontSize: '0.8125rem' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario) => {
                                    const esAdminUsuario = usuario.rol === 'ADMIN'
                                    const esYo = esUsuarioActual(usuario.id)
                                    return (
                                        <tr key={usuario.id}>
                                            <td style={{ fontSize: '0.875rem' }} className='fw-semibold'>
                                                {usuario.nombre}
                                                {esYo && (
                                                    <span className='text-muted fw-normal' style={{ fontSize: '0.75rem' }}>
                                                        {' '}(tú)
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ fontSize: '0.875rem' }}>
                                                <span className='d-flex align-items-center gap-1'>
                                                    <Mail size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                                    {usuario.email}
                                                </span>
                                            </td>
                                            <td>
                                                <span className='badge' style={{
                                                    background: estilosRol[usuario.rol]?.background || '#f1f5f9',
                                                    color: estilosRol[usuario.rol]?.color || '#64748b',
                                                    padding: '0.35rem 0.75rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500
                                                }}>
                                                    {usuario.rol}
                                                </span>
                                            </td>
                                            <td className='text-end'>
                                                {esYo ? (
                                                    <span className='text-muted' style={{ fontSize: '0.8125rem' }}>
                                                        No puedes cambiar tu propio rol
                                                    </span>
                                                ) : esAdminUsuario ? (
                                                    <button
                                                        className='btn btn-sm btn-outline-danger d-flex align-items-center gap-1 ms-auto'
                                                        onClick={() => setCambio({ ...usuario, rol_id: 2 })}
                                                        data-bs-toggle='modal'
                                                        data-bs-target='#modalCambioRol'
                                                        style={{ fontSize: '0.8125rem', padding: '0.25rem 0.625rem' }}
                                                    >
                                                        <ShieldOff size={14} />
                                                        Revocar Admin
                                                    </button>
                                                ) : (
                                                    <button
                                                        className='btn btn-sm btn-outline-success d-flex align-items-center gap-1 ms-auto'
                                                        onClick={() => setCambio({ ...usuario, rol_id: 1 })}
                                                        data-bs-toggle='modal'
                                                        data-bs-target='#modalCambioRol'
                                                        style={{ fontSize: '0.8125rem', padding: '0.25rem 0.625rem' }}
                                                    >
                                                        <ShieldCheck size={14} />
                                                        Hacer Admin
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className='card p-5 text-center'>
                    <Users size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h5 className='fw-semibold mb-2'>No hay usuarios</h5>
                    <p className='text-muted mb-0' style={{ fontSize: '0.875rem' }}>
                        Aun no hay usuarios registrados en el sistema.
                    </p>
                </div>
            )}
        </div>
        <ModalConfirmar
            id='modalCambioRol'
            titulo={cambio && esAdminDestino(cambio.rol_id) ? 'Promover a Administrador' : 'Revocar rol de Administrador'}
            mensaje={cambio && esAdminDestino(cambio.rol_id)
                ? `¿Seguro que deseas promover a "${cambio.nombre}" (${cambio.email}) a ADMIN? Podra acceder a todo el panel de administracion.`
                : `¿Seguro que deseas revocar el rol ADMIN de "${cambio?.nombre || ''}" (${cambio?.email || ''})? Volvera a ser CLIENT y perdera el acceso al panel de administracion.`}
            textoConfirmar={cambio && esAdminDestino(cambio.rol_id) ? 'Promover a Admin' : 'Revocar Admin'}
            onConfirmar={confirmarCambioRol}
        />
        </>
    )
}

export default UsuariosPage
