import { LayoutDashboard, Package, User, LogOut } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navegacion = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Productos", href: "/admin/listar", icon: Package },
    { name: "Perfil", href: "/admin/profile", icon: User }
]

const NavarAdmin = () => {

    const { logout } = useAuth()

    return (
        <nav className='admin-nav'>
            <div className='d-flex align-items-center gap-1'>
                <NavLink to="/admin" className='fw-bold me-3' style={{ color: 'white', fontSize: '1rem' }}>
                    BIGSOUND
                </NavLink>
                {navegacion.map((item) => (
                    <NavLink key={item.name} to={item.href} end={item.href === "/admin"} className={({ isActive }) => isActive ? "active" : ""}>
                        <item.icon size={16} />
                        {item.name}
                    </NavLink>
                ))}
            </div>
            <div className='d-flex align-items-center gap-2'>
                <NavLink to="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem' }}>
                    Ver Tienda
                </NavLink>
                <button onClick={logout}>
                    <LogOut size={14} />
                    Cerrar Sesion
                </button>
            </div>
        </nav>
    )
}

export default NavarAdmin
