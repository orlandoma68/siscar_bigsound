import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CarritoContext } from '../context/CarritoContext'
import { collection, addDoc } from 'firebase/firestore'
import { db } from "../js/config"
import { Link } from 'react-router-dom'
import { CheckCircle, ShoppingBag } from 'lucide-react'

const Checkout = () => {

  const { register, handleSubmit, reset } = useForm()
  const [pedidos, setPedidos] = useState()
  const { carrito, totalPagar, vaciarCarrito } = useContext(CarritoContext)

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

  const comprar = (data) => {
    const pedidosCliente = {
      productos: carrito,
      cliente: data,
      totalPagar: totalPagar()
    }

    const pedidosRef = collection(db, "pedidos")

    const agregarDatos = async () => {
      const resPedidos = await addDoc(pedidosRef, pedidosCliente)
      setPedidos(resPedidos.id)
    }
    agregarDatos()
  }

  if (pedidos) {
    vaciarCarrito()
    reset()
    return (
      <div className='container py-5 text-center'>
        <div className='card p-5 mx-auto' style={{ maxWidth: '500px' }}>
          <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
          <h4 className='fw-bold mb-2'>Compra realizada</h4>
          <p className='text-muted mb-3' style={{ fontSize: '0.875rem' }}>
            Tu orden de compra se registro con exito.
          </p>
          <div className='p-3 rounded-3 mb-3' style={{ background: 'var(--bg)' }}>
            <p className='text-muted mb-1' style={{ fontSize: '0.75rem' }}>Numero de pedido</p>
            <code className='fw-bold' style={{ fontSize: '0.9375rem' }}>{pedidos}</code>
          </div>
          <Link to="/" className='btn btn-primary'>Volver a la tienda</Link>
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
        </div>

        <form onSubmit={handleSubmit(comprar)}>
          <div className='mb-3'>
            <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Nombre</label>
            <input className='form-control' type="text" placeholder='Tu nombre completo' {...register('nombre', { required: true })} />
          </div>
          <div className='mb-3'>
            <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Email</label>
            <input className='form-control' type="email" placeholder='tu@email.com' {...register('email', { required: true })} />
          </div>
          <div className='mb-4'>
            <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Telefono</label>
            <input className='form-control' type="tel" placeholder='Tu telefono' {...register('telefono')} />
          </div>
          <button className='btn btn-primary w-100' type='submit'>
            Confirmar compra
          </button>
        </form>
      </div>
    </div>
  )
}

export default Checkout
