import { Outlet } from "react-router-dom";

// Sidebar and TopNav will be built in the Dashboard step
const DashboardLayout = () => (
  <div className="min-h-screen flex bg-surface">
    {/* Sidebar will go here */}
    <main className="flex-1 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;