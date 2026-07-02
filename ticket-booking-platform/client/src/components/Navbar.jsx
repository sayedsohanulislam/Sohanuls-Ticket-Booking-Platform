import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaBus,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive
      ? "bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-300"
      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
  }`;

export default function Navbar() {
  const { user, isAuthed, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-brand-700 dark:text-brand-300">
          <FaBus className="h-6 w-6" />
          <span>TicketBari</span>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/tickets" className={linkClass}>All Tickets</NavLink>
          {isAuthed && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={toggle}
            className="btn-ghost"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {!isAuthed ? (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                ) : (
                  <FaUserCircle className="h-8 w-8 text-slate-400" />
                )}
                <span className="text-sm font-medium">{user?.name}</span>
              </button>

              {menu && (
                <div
                  className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  onMouseLeave={() => setMenu(false)}
                >
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <FaUserAlt /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="btn-ghost md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Open menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/tickets" className={linkClass} onClick={() => setOpen(false)}>All Tickets</NavLink>
            {isAuthed && (
              <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
            )}
            <button onClick={toggle} className="btn-secondary mt-2">
              {theme === "dark" ? <FaSun /> : <FaMoon />} Toggle theme
            </button>
            {!isAuthed ? (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary flex-1" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary flex-1" onClick={() => setOpen(false)}>Register</Link>
              </div>
            ) : (
              <button onClick={handleLogout} className="btn-danger">Logout</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
