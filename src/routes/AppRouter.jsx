import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import Available from "./Available";
import Private from "./Private";
import '../index.css'


// Lazy loading de componentes
const NavBarAdmin = lazy(() => import("../components/NavBarAdmin"));
const ModalProductoAdmin = lazy(() => import("../components/ModalProductoAdmin"));
const AdminProductos = lazy(() => import('../components/AdminProductos'))

const AppRouter = () => {
  const loggedInUser = useSelector((state) => state.currentUser.loggedInUser);

  return (
    <BrowserRouter>
      {/* Renderizado condicional del navbar con Suspense */}
      <Suspense fallback={<NavBar />}>
        {loggedInUser?.role === "admin" ? <NavBarAdmin /> : <NavBar />}
      </Suspense>

      {/* Rutas principales */}
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/*" element={<Available />} />
          
          <Route element={<Private />}>
            <Route path="/modalAdmin" element={<ModalProductoAdmin />} />
            <Route path="/NavbarAdmin" element={<NavBarAdmin />} />
            <Route path="/AdminProductos" element={<AdminProductos/>}/>
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;