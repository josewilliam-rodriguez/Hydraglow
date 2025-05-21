import { Outlet } from "react-router-dom";
import NavBarAdmin from "../components/NavBarAdmin";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <NavBarAdmin />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;