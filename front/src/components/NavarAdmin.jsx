import { LayoutDashboard, Package, User, LogOut, ShoppingBag, MessageSquare, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useContactosNoLeidos from '../js/useContactosNoLeidos'

const NavarAdmin = () => {

    const { logout, esAdmin } = useAuth()
    const { cantidad } = useContactosNoLeidos(esAdmin)

    const navegacion = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Productos", href: "/admin/listar", icon: Package, soloAdmin: true },
        { name: "Mis Pedidos", href: "/admin/pedidos", icon: ShoppingBag, soloAdmin: false },
        { name: "Contactos", href: "/admin/contactos", icon: MessageSquare, soloAdmin: true, badge: cantidad },
        { name: "Usuarios", href: "/admin/usuarios", icon: Users, soloAdmin: true },
        { name: "Perfil", href: "/admin/profile", icon: User }
    ]

    const items = navegacion.filter((item) => !item.soloAdmin || esAdmin)

    return (
        <nav className='admin-nav'>
            <div className='d-flex align-items-center gap-1'>
                <NavLink to="/admin" className='fw-bold me-3' style={{ color: 'white', fontSize: '1rem' }}>
                    BIGSOUND
                </NavLink>
                {items.map((item) => (
                    <NavLink key={item.name} to={item.href} end={item.href === "/admin"} className={({ isActive }) => isActive ? "active" : ""}>
                        <item.icon size={16} />
                        {item.name}
                        {item.badge > 0 && (
                            <span className='admin-nav-badge'>{item.badge}</span>
                        )}
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
