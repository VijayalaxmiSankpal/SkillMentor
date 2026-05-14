import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import TopNav  from "../components/shared/TopNav";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;