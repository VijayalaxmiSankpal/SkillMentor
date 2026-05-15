import { Outlet } from "react-router-dom";

const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Outlet />
  </div>
);

export default MainLayout;