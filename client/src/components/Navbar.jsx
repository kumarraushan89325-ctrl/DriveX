import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'text-accent-500' : 'text-slate-200 hover:text-white'
  }`;

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500 font-display text-lg font-bold">
            D
          </span>
          <span>
            <span className="block font-display text-lg font-bold leading-none">DriveNow</span>
            <span className="hidden text-[10px] tracking-wide text-slate-300 sm:block">Premium car rentals</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/cars" className={linkClass}>
            Cars
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!user && (
            <>
              <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
          {user && !isAdmin && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/my-bookings" className={linkClass}>
                My Bookings
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
              <button type="button" onClick={onLogout} className="btn-outline bg-transparent text-white">
                Logout
              </button>
            </>
          )}
          {isAdmin && (
            <>
              <NavLink to="/admin" className={linkClass}>
                Admin Dashboard
              </NavLink>
              <button type="button" onClick={onLogout} className="btn-outline bg-transparent text-white">
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open && (
        <div className="space-y-1 border-t border-white/10 px-4 py-3 md:hidden">
          <NavLink to="/" className="block py-2 text-white" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/cars" className="block py-2 text-white" onClick={() => setOpen(false)}>
            Cars
          </NavLink>
          <NavLink to="/about" className="block py-2 text-white" onClick={() => setOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" className="block py-2 text-white" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          {!user && (
            <>
              <Link to="/login" className="block py-2 text-white" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="block py-2 text-white" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
          {user && !isAdmin && (
            <>
              <Link to="/dashboard" className="block py-2 text-white" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <Link to="/my-bookings" className="block py-2 text-white" onClick={() => setOpen(false)}>
                My Bookings
              </Link>
              <Link to="/profile" className="block py-2 text-white" onClick={() => setOpen(false)}>
                Profile
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className="block py-2 text-white" onClick={() => setOpen(false)}>
              Admin Dashboard
            </Link>
          )}
          {user && (
            <button type="button" onClick={onLogout} className="block py-2 text-left text-white">
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
