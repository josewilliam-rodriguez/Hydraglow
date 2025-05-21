import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Private = () => {
  const loggedInUser = useSelector((state) => state.currentUser.loggedInUser);

  // Manejar carga inicial
  if (loggedInUser === undefined) {
    return <div>Cargando...</div>; // Evita redirección prematura
  }

  return loggedInUser?.uid ? <Outlet /> : <Navigate to="/" />;
};

export default Private;