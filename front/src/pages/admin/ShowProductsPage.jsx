import React, { useEffect, useState } from 'react'
import { notific } from '../../js/notificacion'
import { toast } from 'react-hot-toast'
import { pedirProductos } from '../../js/pedirProductos'
import { PlusCircle, RotateCcw, Save, Search, Trash2, Edit3, X } from 'lucide-react'
import { useForm } from "react-hook-form";
import ModalConfirmar from '../../components/ModalConfirmar'

const API_URL = import.meta.env.VITE_URL_SERVER;

const ShowProductsPage = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [busqueda, setBusqueda] = useState("")
    const [operacion, setOperacion] = useState(1)
    const [titulo, setTitulo] = useState('')
    const [productos, setProductos] = useState([])
    const [selectProducto, setSelectProducto] = useState(null)
    const [productoAEliminar, setProductoAEliminar] = useState(null)

    const buscarDatos = (datos) => {
        if (!busqueda) return datos
        return datos.filter((item) =>
            item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            item.categoria.toLowerCase().includes(busqueda.toLowerCase())
        )
    }

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("codigo", data.codigo);
        formData.append("nombre", data.nombre);
        formData.append("descripcion", data.descripcion);
        formData.append("categoria", data.categoria);
        formData.append("cantidad", data.cantidad);
        formData.append("precio", data.precio);

        if (data.imagen && data.imagen[0]) {
            formData.append("imagen", data.imagen[0]);
        }

        if (operacion === 1) {
            agregarProducto(formData);
        }

        if (operacion === 2) {
            actualizarProducto(selectProducto.id, formData);
        }
    }

    useEffect(() => {
        obtenerProductos()
    }, [])

    const obtenerProductos = async () => {
        try {
            const datos = await pedirProductos()
            setProductos(datos)
        } catch {
            toast.error("Error al cargar productos", notific)
        }
    }

    const agregarProducto = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/productos/registrar`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData,
            });
            const result = await response.json();
            if (result.ok === false) {
                return toast.error(result.message, notific);
            }
            toast.success(`Producto registrado correctamente`, notific);
        } catch {
            toast.error("Error al registrar producto", notific);
        }
        obtenerProductos()
        cerrarModal()
    }

    const actualizarProducto = async (id, formData) => {
        try {
            const respuesta = await fetch(`${API_URL}/productos/actualizar/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData,
            })
            if (!respuesta.ok) {
                throw new Error('Error en la solicitud')
            }
            toast.success("Producto actualizado correctamente", notific);
            obtenerProductos()
        } catch {
            toast.error("Error al actualizar el producto", notific);
        }
        cerrarModal()
    }

    const eliminarProducto = async (id) => {
        try {
            const res = await fetch(`${API_URL}/productos/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            })
            if (!res.ok) throw new Error('Error en la solicitud')                
            toast.success("Producto eliminado correctamente", notific);
            obtenerProductos()
        } catch {
            toast.error("Error al eliminar el producto", notific);
        }
    }

    const openModal = (op, prod) => {
        setOperacion(op)
        if (Number(op) === 1) {
            setTitulo('Registrar Producto')
            reset();
        }
        if (Number(op) === 2) {
            setTitulo("Editar Producto")
            setSelectProducto(prod);
            reset(prod);
        }
    }

    const cerrarModal = () => {
        reset()
        setSelectProducto(null)
    }

    return (
        <div className='container-fluid py-4 px-4' style={{ maxWidth: '1200px' }}>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <div>
                    <h4 className='fw-bold mb-1'>Productos</h4>
                    <p className='text-muted mb-0' style={{ fontSize: '0.875rem' }}>
                        {productos.length} productos registrados
                    </p>
                </div>
                <button
                    onClick={() => openModal(1)}
                    className='btn btn-primary d-flex align-items-center gap-2'
                    data-bs-toggle='modal'
                    data-bs-target='#modalProducts'
                >
                    <PlusCircle size={16} />
                    Nuevo Producto
                </button>
            </div>

            <div className='card mb-4'>
                <div className='card-body py-3'>
                    <div className='d-flex justify-content-end'>
                        <div className='search-box'>
                            <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            <input
                                type="text"
                                placeholder='Buscar por nombre o categoria...'
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='card'>
                <div className='table-responsive'>
                    <table className='table table-hover mb-0'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th>Descripcion</th>
                                <th>Categoria</th>
                                <th>Stock</th>
                                <th>Precio</th>
                                <th className='text-center'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buscarDatos(productos).length > 0 ? (
                                buscarDatos(productos).map((prod) => (
                                    <tr key={prod.id}>
                                        <td className='text-muted'>{prod.id}</td>
                                        <td><code style={{ fontSize: '0.8125rem' }}>{prod.codigo}</code></td>
                                        <td className='fw-medium'>{prod.nombre}</td>
                                        <td className='text-muted' style={{ maxWidth: '200px' }}>
                                            {prod.descripcion?.slice(0, 50)}{prod.descripcion?.length > 50 ? '...' : ''}
                                        </td>
                                        <td>
                                            <span className='badge' style={{
                                                background: 'var(--primary-light)',
                                                color: 'var(--primary)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 500
                                            }}>
                                                {prod.categoria}
                                            </span>
                                        </td>
                                        <td className={prod.cantidad < 5 ? 'text-danger fw-medium' : ''}>
                                            {prod.cantidad}
                                        </td>
                                        <td className='fw-medium'>US$ {prod.precio}</td>
                                        <td>
                                            <div className='d-flex justify-content-center gap-1'>
                                                <button
                                                    className='btn btn-sm btn-outline-primary d-flex align-items-center gap-1'
                                                    onClick={() => openModal(2, prod)}
                                                    data-bs-toggle='modal'
                                                    data-bs-target='#modalProducts'
                                                    style={{ fontSize: '0.8125rem', padding: '0.25rem 0.625rem' }}
                                                >
                                                    <Edit3 size={14} />
                                                    Editar
                                                </button>
                                                <button
                                                    className='btn btn-sm btn-outline-danger d-flex align-items-center gap-1'
                                                    onClick={() => setProductoAEliminar(prod)}
                                                    data-bs-toggle='modal'
                                                    data-bs-target='#modalEliminarProducto'
                                                    style={{ fontSize: '0.8125rem', padding: '0.25rem 0.625rem' }}
                                                >
                                                    <Trash2 size={14} />
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan='8' className='text-center py-4 text-muted'>
                                        No se encontraron productos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Producto */}
            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog modal-lg'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='fw-bold mb-0'>{titulo}</h5>
                            <button type='button' className='btn-close' data-bs-dismiss="modal" aria-label="close"></button>
                        </div>
                        <div className='modal-body p-4'>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='row g-3'>
                                    <div className='col-md-6'>
                                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Codigo *</label>
                                        <input
                                            className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
                                            {...register("codigo", { required: true })}
                                            type="text"
                                            placeholder='Ej: PROD-001'
                                        />
                                        {errors.codigo && <div className='invalid-feedback'>El codigo es requerido</div>}
                                    </div>
                                    <div className='col-md-6'>
                                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Nombre *</label>
                                        <input
                                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                            {...register("nombre", { required: true })}
                                            type="text"
                                            placeholder='Nombre del producto'
                                        />
                                        {errors.nombre && <div className='invalid-feedback'>El nombre es requerido</div>}
                                    </div>
                                    <div className='col-12'>
                                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Descripcion</label>
                                        <textarea
                                            className='form-control'
                                            {...register("descripcion")}
                                            rows={3}
                                            placeholder='Descripcion del producto'
                                        />
                                    </div>
                                    <div className='col-md-6'>
                                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Categoria *</label>
                                        <input
                                            className={`form-control ${errors.categoria ? 'is-invalid' : ''}`}
                                            {...register("categoria", { required: true })}
                                            type="text"
                                            placeholder='Ej: Aceites, Filtros'
                                        />
                                        {errors.categoria && <div className='invalid-feedback'>La categoria es requerida</div>}
                                    </div>
                                    <div className='col-md-6'>
                                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Imagen</label>
                                        <input
                                            className='form-control'
                                            {...register("imagen")}
                                            type="file"
                                            accept='image/*'
                                        />
                                    </div>
                                    <div className='col-md-6'>
                                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Cantidad</label>
                                        <input
                                            className='form-control'
                                            {...register("cantidad")}
                                            type="number"
                                            min='0'
                                            placeholder='0'
                                        />
                                    </div>
                                    <div className='col-md-6'>
                                        <label className='form-label' style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Precio (US$)</label>
                                        <input
                                            className='form-control'
                                            {...register("precio")}
                                            type="number"
                                            step="0.01"
                                            min='0'
                                            placeholder='0.00'
                                        />
                                    </div>
                                </div>
                                <div className='d-flex justify-content-end gap-2 mt-4'>
                                    <button type='button' className='btn btn-outline-secondary' data-bs-dismiss="modal">
                                        Cancelar
                                    </button>
                                    <button type='submit' className='btn btn-primary d-flex align-items-center gap-2'>
                                        {Number(operacion) === 1 ? <Save size={16} /> : <RotateCcw size={16} />}
                                        {Number(operacion) === 1 ? "Guardar" : "Actualizar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <ModalConfirmar
                id='modalEliminarProducto'
                titulo='Eliminar producto'
                mensaje={`¿Seguro que deseas eliminar "${productoAEliminar?.nombre || ''}"? Esta accion no se puede deshacer.`}
                onConfirmar={() => {
                    if (productoAEliminar) eliminarProducto(productoAEliminar.id)
                    setProductoAEliminar(null)
                }}
            />
        </div>
    )
}

export default ShowProductsPage
