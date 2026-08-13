import { createContext, useState, useEffect, useContext } from 'react'
import { auth, googleProvider } from '../js/config'
import { signInWithPopup, signOut } from 'firebase/auth'

const AuthContext = createContext()

const URL_SERVER = import.meta.env.VITE_URL_SERVER || 'http://localhost:3000'

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [rol, setRol] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [cargandoRol, setCargandoRol] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                setCargando(false)
                setCargandoRol(false)
                return
            }
            try {
                const res = await fetch(`${URL_SERVER}/usuarios/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const data = await res.json()
                if (data.ok) {
                    setUser(data.usuario)
                    setRol(data.usuario.rol)
                } else {
                    localStorage.removeItem('token')
                }
            } catch {
                localStorage.removeItem('token')
            }
            setCargando(false)
            setCargandoRol(false)
        }
        initAuth()
    }, [])

    const signUp = async ( nombre, email, password ) => {
        const res = await fetch(`${URL_SERVER}/usuarios/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        })
      
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || data.error || `Error en el servidor (${res.status})`);
        return data;
    }

    const signIn = async (email, password) => {
        const res = await fetch(`${URL_SERVER}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (!data.ok) throw new Error(data.message || 'Credenciales invalidas')
        localStorage.setItem('token', data.token)
        setUser(data.usuario)
        setRol(data.usuario.rol)
        return data
    }

    const singInWithGoogle = async () => {
        const resultadoFirebase = await signInWithPopup(auth, googleProvider)
        const email = resultadoFirebase.user.email
        const nombre = resultadoFirebase.user.displayName || email.split('@')[0]

        const res = await fetch(`${URL_SERVER}/usuarios/sincronizar-google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, nombre })
        })
        const data = await res.json()
        if (data.ok) {
            localStorage.setItem('token', data.token)
            setUser(data.usuario)
            setRol(data.usuario.rol)
        }
        return data
    }

    const logout = async () => {
        localStorage.removeItem('token')
        setUser(null)
        setRol(null)
        try { await signOut(auth) } catch { /* ignore */ }
    }

    const verificarRol = async (email) => {
        try {
            const res = await fetch(`${URL_SERVER}/usuarios/verificar-rol?email=${encodeURIComponent(email)}`)
            const data = await res.json()
            if (data.ok && data.existe) {
                setRol(data.rol)
                setUser(data.usuario)
                return data.rol
            }
            setRol(null)
            return null
        } catch {
            setRol(null)
            return null
        }
    }

    const olvidarPassword = async (email) => {
        const res = await fetch(`${URL_SERVER}/usuarios/olvidar-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        const data = await res.json()
        if (!data.ok) throw new Error(data.message || 'Error al enviar el enlace')
        return data
    }

    const restablecerPassword = async (token, password) => {
        const res = await fetch(`${URL_SERVER}/usuarios/restablecer-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        })
        const data = await res.json()
        if (!data.ok) throw new Error(data.message || 'Error al restablecer la contrasena')
        return data
    }

    const esAdmin = rol === 'ADMIN'

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            rol,
            cargando,
            cargandoRol,
            esAdmin,
            signUp,
            signIn,
            singInWithGoogle,
            logout,
            verificarRol,
            olvidarPassword,
            restablecerPassword
        }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
