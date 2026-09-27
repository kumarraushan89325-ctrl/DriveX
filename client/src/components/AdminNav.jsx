import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/cars', label: 'Cars' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/users', label: 'Users' },
];

export default function AdminNav() {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  if (!isAdmin || !pathname.startsWith('/admin')) return null;
  return (
    <div className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 text-sm">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-1.5 ${isActive ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
