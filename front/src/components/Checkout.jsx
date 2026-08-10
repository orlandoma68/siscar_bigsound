import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CarritoContext } from '../context/CarritoContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { notific } from '../js/notificacion'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, ShoppingBag, MapPin, CreditCard, Truck } from 'lucide-react'

const API_URL = import.meta.env.VITE_URL_SERVER;

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

const Checkout = () => {

    const { register, handleSubmit, watch, reset } = useForm()
    const [pedidos, setPedidos] = useState(null)
    const { carrito, totalPagar, vaciarCarrito } = useContext(CarritoContext)
    const { user } = useAuth()
    const navigate = useNavigate()

    const tipoEnvio = watch('tipo_envio')

    const handleIrAlPanel = () => {
        navigate('/admin/pedidos')
    }

    if (carrito.length === 0 && !pedidos) {
        return (
            <div className='container py-5 text-center'>
                <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h5 className='fw-semibold mb-2'>No hay productos para pagar</h5>
                <p className='text-muted mb-4' style={{ fontSize: '0.875rem' }}>
                    Agrega productos al carrito para continuar.
                </p>
                <Link to="/" className='btn btn-primary'>Explorar productos</Link>
            </div>
        )
    }

    const comprar = async (data) => {
        const token = localStorage.getItem('token')

        if (!user || !token) {
            toast.error('Debes iniciar sesion para realizar la compra', notific)
            navigate('/auth/login')
            return
        }

        try {
            const res = await fetch(`${API_URL}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productos: carrito.map((p) => ({ id: p.id, cantidad: p.cantidad })),
                    nombre: data.nombre,
                    email: data.email,
                    telefono: data.telefono,
                    tipo_envio: data.tipo_envio,
                    metodo_pago: data.metodo_pago,
                    direccion: data.direccion || null
                })
            })
            const result = await res.json()
            if (!result.ok) {
                toast.error(result.message || 'Error al registrar el pedido', notific)
                return
            }
            vaciarCarrito()
            reset()
            setPedidos({
                pedidoId: result.pedidoId,
                fecha: result.fecha,
                total: result.total,
                ...data,
                productos: [...carrito]
            })
        } catch (error) {
            console.error("Error al crear pedido:", error)
            toast.error('Error al registrar el pedido', notific)
        }
    }

    if (pedidos) {
        return (
            <div className='container py-4' style={{ maxWidth: '720px' }}>
                <div className='card p-4'>
                    <div className='text-center mb-4'>
                        <CheckCircle size={56} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                        <h4 className='fw-bold mb-1'>Gracias, tu pedido ha sido recibido</h4>
                        <p className='text-muted mb-0' style={{ fontSize: '0.875rem' }}>
                            Pedido previo pago - tu pago queda pendiente de confirmacion
                        </p>
                    </div>

                    <div className='mb-4 p-3 rounded-3' style={{ background: 'var(--bg)' }}>
                        <div className='row g-3'>
                            <div className='col-6 col-md-4'>
                                <div className='text-muted' style={{ fontSize: '0.75rem' }}>Numero de pedido</div>
                                <div className='fw-bold'>#{pedidos.pedidoId}</div>
                            </div>
                            <div className='col-6 col-md-4'>
                                <div className='text-muted' style={{ fontSize: '0.75rem' }}>Fecha</div>
                                <div className='fw-medium' style={{ fontSize: '0.875rem' }}>{formatearFecha(pedidos.fecha)}</div>
                            </div>
                            <div className='col-6 col-md-4'>
                                <div className='text-muted' style={{ fontSize: '0.75rem' }}>Total</div>
                                <div className='fw-bold' style={{ color: 'var(--primary)' }}>
                                    US$ {Number(pedidos.total ?? totalPagar()).toFixed(2)}
                                </div>
                            </div>
                            <div className='col-6 col-md-4'>
                                <div className='text-muted' style={{ fontSize: '0.75rem' }}>Correo electronico</div>
                                <div className='fw-medium' style={{ fontSize: '0.875rem' }}>{pedidos.email}</div>
                            </div>
                            <div className='col-6 col-md-4'>
                                <div className='text-muted' style={{ fontSize: '0.75rem' }}>Metodo de pago</div>
                                <div className='fw-medium' style={{ fontSize: '0.875rem' }}>{metodosPago[pedidos.metodo_pago]}</div>
                            </div>
                            <div className='col-6 col-md-4'>
                                <div className='text-muted' style={{ fontSize: '0.75rem' }}>Estado</div>
                                <span className='badge' style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '6px', fontWeight: 500 }}>
                                    Pendiente de pago
                                </span>
                            </div>
                        </div>
                    </div>

                    <h5 className='fw-bold mb-3'>Detalle del pedido</h5>
                    <div className='mb-4'>
                        {pedidos.productos.map((item) => (
                            <div key={item.id} className='d-flex justify-content-between align-items-center py-2' style={{ borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem' }}>
                                        {item.nombre}{item.codigo ? ` [${item.codigo}]` : ''}
                                    </div>
                                    <div className='text-muted' style={{ fontSize: '0.75rem' }}>
                                        {item.cantidad} x US$ {Number(item.precio).toFixed(2)}
                                    </div>
                                </div>
                                <span className='fw-medium' style={{ fontSize: '0.875rem' }}>
                                    US$ {(item.precio * item.cantidad).toFixed(2)}
                                </span>
                            </div>
                        ))}
                        <div className='d-flex justify-content-between align-items-center py-2'>
                            <span className='fw-semibold'>Total</span>
                            <span className='fw-bold' style={{ color: 'var(--primary)' }}>
                                US$ {Number(pedidos.total ?? totalPagar()).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className='row g-3 mb-4'>
                        <div className='col-md-6'>
                            <div className='d-flex align-items-center gap-2 mb-2'>
                                <Truck size={16} style={{ color: 'var(--text-muted)' }} />
                                <span className='text-muted' style={{ fontSize: '0.75rem' }}>Tipo de envio</span>
                            </div>
                            <div className='fw-medium' style={{ fontSize: '0.875rem' }}>{tiposEnvio[pedidos.tipo_envio]}</div>
                        </div>
                        <div className='col-md-6'>
                            <div className='d-flex align-items-center gap-2 mb-2'>
                                <CreditCard size={16} style={{ color: 'var(--text-muted)' }} />
                                <span className='text-muted' style={{ fontSize: '0.75rem' }}>Metodo de pago</span>
                            </div>
                            <div className='fw-medium' style={{ fontSize: '0.875rem' }}>{metodosPago[pedidos.metodo_pago]}</div>
                        </div>
                    </div>

                    <h5 className='fw-bold mb-3'>Direccion de facturacion</h5>
                    <div className='p-3 rounded-3 mb-4' style={{ background: 'var(--bg)' }}>
                        <div className='d-flex align-items-center gap-2 mb-2'>
                            <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                            <span className='text-muted' style={{ fontSize: '0.75rem' }}>Datos de entrega</span>
                        </div>
                        <div className='d-flex flex-column gap-1' style={{ fontSize: '0.875rem' }}>
                            <div><span className='text-muted'>Nombre: </span><span className='fw-medium'>{pedidos.nombre}</span></div>
                            <div><span className='text-muted'>Direccion: </span>
                                <span className='fw-medium'>
                                    {pedidos.direccion || (pedidos.tipo_envio === 'retiro en local' ? 'Retiro en local' : 'No especificada')}
                                </span>
                            </div>
                            <div><span className='text-muted'>Correo: </span><span className='fw-medium'>{pedidos.email}</span></div>
                        </div>
                    </div>

                    <div className='d-flex justify-content-center gap-2'>
                        <Link to="/" className='btn btn-primary'>Volver a la tienda</Link>
                        <button onClick={handleIrAlPanel} className='btn btn-outline-primary'>Ver mis pedidos</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='container py-4' style={{ maxWidth: '600px' }}>
            <div className='card p-4'>
                <h4 className='fw-bold text-center mb-4'>Finalizar compra</h4>

                <div className='mb-4 p-3 rounded-3' style={{ background: 'var(--bg)' }}>
                    <p className='fw-medium mb-1' style={{ fontSize: '0.875rem' }}>
                        {carrito.length} productos - Total: <span style={{ color: 'var(--primary)' }}>US$ {totalPagar()}</span>
                    </p>
                    <p className='text-muted mb-0' style={{ fontSize: '0.75rem' }}>
                        El pedido se registra previo pago: lo confirmamos cuando recibas o pagues.
                    </p>
                    {!user && (
                        <p className='text-muted mb-0 mt-1' style={{ fontSize: '0.75rem' }}>
                            Necesitas <Link to="/auth/login">iniciar sesion</Link> para completar la compra.
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit(comprar)}>
                    <div className='mb-3'>
                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Nombre</label>
                        <input className='form-control' type="text" placeholder='Tu nombre completo' defaultValue={user?.nombre || ''} {...register('nombre', { required: true })} />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Email</label>
                        <input className='form-control' type="email" placeholder='tu@email.com' defaultValue={user?.email || ''} {...register('email', { required: true })} />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Telefono</label>
                        <input className='form-control' type="tel" placeholder='Tu telefono' {...register('telefono')} />
                    </div>

                    <div className='mb-3'>
                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Tipo de envio</label>
                        <select className='form-control form-select' {...register('tipo_envio')}>
                            <option value='retiro en local'>Retiro en local</option>
                            <option value='envio a domicilio'>Envio a domicilio</option>
                        </select>
                    </div>

                    {tipoEnvio === 'envio a domicilio' && (
                        <div className='mb-3'>
                            <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Direccion de facturacion</label>
                            <input className='form-control' type="text" placeholder='Calle, casa, ciudad, estado' {...register('direccion', { required: 'La direccion es requerida para envio a domicilio' })} />
                        </div>
                    )}

                    <div className='mb-4'>
                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Metodo de pago</label>
                        <select className='form-control form-select' {...register('metodo_pago')}>
                            <option value='transferencia'>Transferencia / Deposito bancario</option>
                            <option value='efectivo'>Efectivo</option>
                        </select>
                    </div>

                    <button className='btn btn-primary w-100' type='submit' disabled={!user}>
                        Confirmar compra
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Checkout
