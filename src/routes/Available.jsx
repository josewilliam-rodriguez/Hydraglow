import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('../components/Home'))
const Productos = lazy(() => import('../components/Productos'))
const Registro = lazy(() => import('../components/Registro'))
const ModalDetailProduc = lazy(() => import('../components/ModalDetailProduc'))
const SliderHome = lazy (() => import('../components/SliderHome'))
const SobreNosotros = lazy (() => import('../components/SobreNosotros'))
const Available = () => {
  const { loggedInUser } = useSelector(state => state.currentUser);
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/Productos" element={<Productos />} />
    <Route path="/Registro" element={!loggedInUser ? <Registro /> : <Navigate to="/" />} />
    <Route path="/DetalleProductos/:id" element={<ModalDetailProduc />} />
    <Route path='/Promociones' element={<SliderHome/>}/>
    <Route path='/Nosotros' element={<SobreNosotros/>} />

  </Routes>

  )
}

export default Available