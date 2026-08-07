import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthLayout = () => {

  const { user } = useAuth()

    if(user){
      return <Navigate to ='/admin' replace></Navigate>
    }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" >
      <Outlet/>
    </div>
  )
}

export default AuthLayout
