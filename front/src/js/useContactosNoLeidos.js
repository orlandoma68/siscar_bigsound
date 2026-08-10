import { useState, useEffect, useCallback } from 'react'

const API_URL = import.meta.env.VITE_URL_SERVER

const useContactosNoLeidos = (activo = true) => {
    const [cantidad, setCantidad] = useState(0)
    const [cargando, setCargando] = useState(true)

    const refrescar = useCallback(async () => {
        if (!activo) {
            setCantidad(0)
            setCargando(false)
            return
        }
        const token = localStorage.getItem('token')
        if (!token) {
            setCantidad(0)
            setCargando(false)
            return
        }
        try {
            const res = await fetch(`${API_URL}/contactos/no-leidos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.ok) {
                setCantidad(data.cantidad || 0)
            }
        } catch {
            setCantidad(0)
        } finally {
            setCargando(false)
        }
    }, [activo])

    useEffect(() => {
        refrescar()
        if (!activo) return
        const intervalo = setInterval(refrescar, 30000)
        return () => clearInterval(intervalo)
    }, [refrescar, activo])

    return { cantidad, cargando, refrescar }
}

export default useContactosNoLeidos
