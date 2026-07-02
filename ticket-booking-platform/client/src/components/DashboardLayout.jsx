import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaUserAlt,
  FaTicketAlt,
  FaMoneyBillWave,
  FaPlus,
  FaInbox,
  FaChartLine,
  FaUsers,
  FaBullhorn,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-brand-600 text-white"
      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
  }`;

const menusByRole = {
  user: [
    { to: "/dashboard/profile", label: "User Profile", icon: <FaUserAlt /> },
    { to: "/dashboard/bookings", label: "My Booked Tickets", icon: <FaTicketAlt /> },
    { to: "/dashboard/transactions", label: "Transaction History", icon: <FaMoneyBillWave /> },
  ],
  vendor: [
    { to: "/dashboard/profile", label: "Vendor Profile", icon: <FaUserAlt /> },
    { to: "/dashboard/add-ticket", label: "Add Ticket", icon: <FaPlus /> },
    { to: "/dashboard/my-tickets", label: "My Added Tickets", icon: <FaTicketAlt /> },
    { to: "/dashboard/requests", label: "Requested Bookings", icon: <FaInbox /> },
    { to: "/dashboard/revenue", label: "Revenue Overview", icon: <FaChartLine /> },
  ],
  admin: [
    { to: "/dashboard/profile", label: "Admin Profile", icon: <FaUserAlt /> },
    { to: "/dashboard/manage-tickets", label: "Manage Tickets", icon: <FaTicketAlt /> },
    { to: "/dashboard/manage-users", label: "Manage Users", icon: <FaUsers /> },
    { to: "/dashboard/advertise", label: "Advertise Tickets", icon: <FaBullhorn /> },
  ],
};

export default function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = menusByRole[user?.role] || menusByRole.user;

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
      {/* Mobile toggle */}
      <button
        className="btn-secondary fixed bottom-6 right-6 z-40 shadow-lg md:hidden"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          open ? "block" : "hidden"
        } w-64 shrink-0 md:block`}
      >
        <div className="card sticky top-20 p-4">
          <div className="mb-4 flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-slate-800 dark:text-brand-300">
                <FaUserAlt />
              </div>
            )}
            <div>
              <div className="text-sm font-semibold">{user?.name}</div>
              <div className="text-xs capitalize text-slate-500 dark:text-slate-400">
                {user?.role}
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {it.icon} {it.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => navigate("/")}
            className="btn-secondary mt-4 w-full"
          >
            Back to site
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
