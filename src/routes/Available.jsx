import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('../components/Home'))
const Productos = lazy(() => import('../components/Productos'))
const Registro = lazy(() => import('../components/Registro'))

const Available = () => {
  const { loggedInUser } = useSelector(state => state.currentUser);
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/Productos" element={<Productos />} />
    <Route path="/Registro" element={!loggedInUser ? <Registro /> : <Navigate to="/" />} />
  </Routes>

  )
}

export default Available