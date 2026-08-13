import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'

import {Toaster} from "react-hot-toast"

import { AuthProvider } from './context/AuthContext'
import { CarritoContextProvider } from './context/CarritoContext'

//import Header from './components/Header'
import RootLayout from './layouts/RootLayout'
import PublicLayout from './layouts/PublicLayout'

import Listproducts from './components/Listproducts'
import Checkout from './components/Checkout'
import DasboardPage from './pages/admin/DasboardPage'
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'

import ProfilePage from './pages/admin/ProfilePage'
import AdminLayout from './layouts/AdminLayout'
import AuthLayout from './layouts/AuthLayout'
import LostPassPage from './pages/auth/LostPassPage'
import HomePage from './pages/Public/HomePage'
import SearchPage from './pages/Public/SearchPage'
import AboutPage from './pages/Public/AboutPage'
import NotFoundPage from './pages/Public/NotFoundPage'
import Itemdetailcontain from './components/Itemdetailcontain'
import Carrito from './components/Carrito'
import ContactPage from './pages/Public/ContactPage'
import ShowProductsPage from './pages/admin/ShowProductsPage'
import PedidosPage from './pages/admin/PedidosPage'
import ContactosPage from './pages/admin/ContactosPage'
import UsuariosPage from './pages/admin/UsuariosPage'
import { ProductoContextProvider } from './context/ProductoContext'

const App = () => {

  return ( 
    
      <Router>
        <ProductoContextProvider>
        <AuthProvider>
          <CarritoContextProvider>
            <Routes>
              {/* inicio de root  layout*/}
              <Route element={<RootLayout/>}>
                {/* inicio de ruta publica*/}
                <Route element={<PublicLayout/>}>
                    <Route index element={<HomePage />} />
                    <Route path='contact' element={<ContactPage />} />
                    <Route path='about' element={<AboutPage /> }/>
                    <Route path='category/:categoria' element={<Listproducts /> }/>
                    <Route path='search/:termino' element={<SearchPage />}/>
                    <Route path='item/:id' element ={<Itemdetailcontain />} />
                    <Route path='carrito' element ={<Carrito />} />
                    <Route path="checkout" element={<Checkout />} />
                </Route>

                {/* ruta Administracion*/}
                <Route path='admin' element={<AdminLayout />}>
                    <Route index element={<DasboardPage />}/>
                    <Route path='profile' element={<ProfilePage />}/>
                    <Route path='pedidos' element={<PedidosPage />}/>
                    <Route path='contactos' element={<ContactosPage />} />
                    <Route path='usuarios' element={<UsuariosPage />} />
                    <Route path='listar' element={<ShowProductsPage />} />
                </Route>

                {/* ruta autenticacion*/}
                <Route path='auth' element={<AuthLayout />}>
                    <Route path='login' element={<LoginPage/>}/>
                    <Route path='register' element={<RegisterPage />}/>                    
                    <Route path='lostpass' element={<LostPassPage />}/> 
                </Route>
              </Route>
              {/* fin de root layout*/}
              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </CarritoContextProvider>
        </AuthProvider>
        </ProductoContextProvider>
      <Toaster/>
    </Router>  
  )
}

export default App
