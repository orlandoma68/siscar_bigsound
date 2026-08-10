import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'
import { notific } from '../../js/notificacion'
import { ShoppingBag, Package, Truck, CreditCard, MapPin } from 'lucide-react'

const API_URL = import.meta.env.VITE_URL_SERVER;

const estilosEstado = {
    pendiente: { background: '#fef3c7', color: '#b45309' },
    pagado: { background: '#dbeafe', color: '#2563eb' },
    enviado: { background: '#e0e7ff', color: '#4f46e5' },
    entregado: { background: '#dcfce7', color: '#16a34a' },
    cancelado: { background: '#fee2e2', color: '#dc2626' }
}

const tiposEnvio = {
    'retiro en local': 'Retiro en local',
    'envio a domicilio': 'Envio a domicilio'
}

const metodosPago = {
    transferencia: 'Transferencia / Deposito bancario',
    efectivo: 'Efectivo'
}

const formatearFecha = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha).toLocaleString()
}

const PedidosPage = () => {

    const { esAdmin } = useAuth()
    const [pedidos, setPedidos] = useState([])
    const [loading, setLoading] = useState(true)
    const [busqueda, setBusqueda] = useState("")

    const token = localStorage.getItem('token')

    const cargarPedidos = async () => {
        try {
            const url = esAdmin ? `${API_URL}/pedidos` : `${API_URL}/pedidos/mios`
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.ok) {
                setPedidos(data.data)
            } else {
                toast.error(data.message || 'Error al cargar pedidos', notific)
            }
        } catch (error) {
            console.error("Error al cargar pedidos:", error)
            toast.error("Error al cargar pedidos", notific)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarPedidos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [esAdmin])

    const cambiarEstado = async (id, estado) => {
        try {
            const res = await fetch(`${API_URL}/pedidos/${id}/estado`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado })
            })
            const data = await res.json()
            if (!data.ok) throw new Error(data.message || 'Error')
            toast.success('Estado del pedido actualizado', notific)
            cargarPedidos()
        } catch (error) {
            toast.error(error.message || 'Error al actualizar estado', notific)
        }
    }

    const buscarDatos = (datos) => {
        if (!busqueda) return datos
        return datos.filter((item) =>
            item.email_cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
            item.usuario_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
            String(item.id).includes(busqueda)
        )
    }

    return (
        <div className='container-fluid py-4 px-4' style={{ maxWidth: '1200px' }}>
            <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2'>
                <div>
                    <h4 className='fw-bold mb-1'>
                        {esAdmin ? 'Pedidos' : 'Mis Compras'}
                    </h4>
                    <p className='text-muted mb-0' style={{ fontSize: '0.875rem' }}>
                        {esAdmin
                            ? `${pedidos.length} pedidos registrados`
                            : 'Historial de tus compras en la tienda'}
                    </p>
                </div>
                {esAdmin && (
                    <div className='search-box'>
                        <input
                            type="text"
                            placeholder='Buscar por cliente o numero de pedido...'
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {loading ? (
                <div className='text-center py-5'>
                    <div className='spinner-border' role='status'></div>
                    <p className='mt-3 text-muted'>Cargando pedidos...</p>
                </div>
            ) : buscarDatos(pedidos).length > 0 ? (
                <div className='d-flex flex-column gap-3'>
                    {buscarDatos(pedidos).map((pedido) => (
                        <div key={pedido.id} className='card p-4'>
                            <div className='d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2'>
                                <div>
                                    <div className='fw-bold' style={{ fontSize: '0.9375rem' }}>
                                        Pedido #{pedido.id}
                                    </div>
                                    <div className='text-muted' style={{ fontSize: '0.8125rem' }}>
                                        {formatearFecha(pedido.fecha)}
                                    </div>
                                </div>
                                <div className='d-flex align-items-center gap-2 flex-wrap'>
                                    <span className='badge' style={{
                                        background: estilosEstado[pedido.estado]?.background || '#f1f5f9',
                                        color: estilosEstado[pedido.estado]?.color || '#64748b',
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: 500
                                    }}>
                                        {pedido.estado}
                                    </span>
                                    {esAdmin && (
                                        <select
                                            className='form-select form-select-sm'
                                            style={{ width: 'auto', fontSize: '0.8125rem' }}
                                            value={pedido.estado}
                                            onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                                        >
                                            <option value='pendiente'>pendiente</option>
                                            <option value='pagado'>pagado</option>
                                            <option value='enviado'>enviado</option>
                                            <option value='entregado'>entregado</option>
                                            <option value='cancelado'>cancelado</option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            {esAdmin && (
                                <div className='mb-3' style={{ fontSize: '0.8125rem' }}>
                                    <span className='text-muted'>Cliente: </span>
                                    <span className='fw-medium'>
                                        {pedido.usuario_nombre || pedido.nombre_cliente} ({pedido.email_cliente})
                                    </span>
                                    {pedido.telefono && (
                                        <span className='text-muted'> - Tel: {pedido.telefono}</span>
                                    )}
                                </div>
                            )}

                            <div className='d-flex flex-column gap-1 mb-3' style={{ fontSize: '0.8125rem' }}>
                                <div className='d-flex align-items-center gap-2'>
                                    <Truck size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                    <span className='text-muted'>Tipo de envio:</span>
                                    <span className='fw-medium'>{tiposEnvio[pedido.tipo_envio] || pedido.tipo_envio}</span>
                                </div>
                                <div className='d-flex align-items-center gap-2'>
                                    <CreditCard size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                    <span className='text-muted'>Metodo de pago:</span>
                                    <span className='fw-medium'>{metodosPago[pedido.metodo_pago] || pedido.metodo_pago}</span>
                                </div>
                                {pedido.direccion && (
                                    <div className='d-flex align-items-center gap-2'>
                                        <MapPin size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                        <span className='text-muted'>Direccion:</span>
                                        <span className='fw-medium'>{pedido.direccion}</span>
                                    </div>
                                )}
                            </div>

                            <div className='d-flex flex-column gap-1 mb-3'>
                                {pedido.productos?.map((item) => (
                                    <div key={item.id} className='d-flex justify-content-between align-items-center py-2' style={{ borderBottom: '1px solid var(--border)' }}>
                                        <div className='d-flex align-items-center gap-2'>
                                            <Package size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.875rem' }}>
                                                {item.nombre}{item.codigo ? ` [${item.codigo}]` : ''} <span className='text-muted' style={{ fontSize: '0.75rem' }}>x{item.cantidad}</span>
                                            </span>
                                        </div>
                                        <span className='fw-medium' style={{ fontSize: '0.875rem' }}>
                                            US$ {(item.precio * item.cantidad).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className='d-flex justify-content-end'>
                                <div className='text-end'>
                                    <div className='text-muted' style={{ fontSize: '0.75rem' }}>Total</div>
                                    <div className='fw-bold' style={{ color: 'var(--primary)' }}>
                                        US$ {Number(pedido.total).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='card p-5 text-center'>
                    <ShoppingBag size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h5 className='fw-semibold mb-2'>No hay pedidos</h5>
                    <p className='text-muted mb-0' style={{ fontSize: '0.875rem' }}>
                        {esAdmin
                            ? 'Aun no se han registrado compras.'
                            : 'Cuando realices una compra, aparecera aqui.'}
                    </p>
                </div>
            )}
        </div>
    )
}

export default PedidosPage
