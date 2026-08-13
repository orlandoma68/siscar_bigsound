import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import CarritoWidget from './CarritoWidget'
import Modalinicio from './Modalinicio'
import { CarritoContext } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import carritoimg from "../imagen/bigsound.png"
import { Home, Landmark, Search, Menu, X } from 'lucide-react'

const navegacion = [
  { name: "Home", href: "/", icon: Home },
  { name: "Contacto", href: "/contact", icon: Landmark },
  { name: "Nosotros", href: "/about", icon: Landmark }
]

const Navbar = () => {

  const { cantidadProductosCarrito } = useContext(CarritoContext)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchTermino, setSearchTermino] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTermino && searchTermino.trim()) {
      navigate(`/search/${searchTermino.trim()}`)
    }
  }

  return (
    <header>
      <div className='contenedor'>
        <nav>
          <div>
            <Link to="/">
              <img
                style={{ height: '50px', objectFit: 'contain' }}
                src={carritoimg}
                alt="Siscar"
              />
            </Link>
          </div>

          <div className='navlink d-none d-md-flex'>
            {navegacion.map((item) => (
              <NavLink key={item.name} to={item.href} className={({ isActive }) =>
                `d-flex align-items-center gap-1 ${isActive ? 'text-primary fw-medium' : ''}`
              }>
                <item.icon size={16} />
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className='navlink d-none d-md-flex'>
            <Modalinicio />
          </div>

          <form onSubmit={handleSearchSubmit} className='d-none d-md-flex align-items-center' style={{ gap: '0.25rem' }}>
            <input
              className='form-control'
              type="text"
              placeholder='Buscar producto...'
              value={searchTermino}
              onChange={(e) => setSearchTermino(e.target.value)}
              style={{ width: '200px', fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
            />
            <button className='btn btn-outline-primary' type='submit' style={{ padding: '0.375rem 0.625rem' }}>
              <Search size={16} />
            </button>
          </form>

          <div className='d-none d-md-flex align-items-center' style={{ gap: '0.5rem' }}>
            {user ? (
              <Link to="/admin" className='btn btn-primary btn-sm'>
                Mi Cuenta
              </Link>
            ) : (
              <Link to="/auth/login" className='btn btn-outline-primary btn-sm'>
                Iniciar Sesion
              </Link>
            )}
          </div>

          <div className='d-none d-md-block'>
            <CarritoWidget cantidadProductosCarrito={cantidadProductosCarrito} />
          </div>

          <button
            className='btn d-md-none'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '0.375rem' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className='d-md-none' style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '1rem'
        }}>
          <div className='d-flex flex-column gap-2'>
            {navegacion.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-2 py-2 px-3 rounded ${isActive ? 'bg-primary text-white' : ''}`
                }
                style={{ fontSize: '0.875rem' }}
              >
                <item.icon size={16} />
                {item.name}
              </NavLink>
            ))}

            <hr className='my-1' />

            <div className='px-3'>
              <Modalinicio />
            </div>

            <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className='d-flex gap-1 px-3'>
              <input
                className='form-control'
                type="text"
                placeholder='Buscar...'
                value={searchTermino}
                onChange={(e) => setSearchTermino(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              />
              <button className='btn btn-outline-primary' type='submit'>
                <Search size={16} />
              </button>
            </form>

            <div className='d-flex flex-column gap-2 px-3'>
              {user ? (
                <Link to="/admin" className='btn btn-primary btn-sm' onClick={() => setMobileMenuOpen(false)}>
                  Mi Cuenta
                </Link>
              ) : (
                <Link to="/auth/login" className='btn btn-outline-primary btn-sm' onClick={() => setMobileMenuOpen(false)}>
                  Iniciar Sesion
                </Link>
              )}
              <CarritoWidget cantidadProductosCarrito={cantidadProductosCarrito} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
