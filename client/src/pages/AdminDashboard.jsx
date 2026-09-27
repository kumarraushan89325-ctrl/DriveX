import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import api from '../services/api';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/format';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/overview'),
      api.get('/bookings/stats'),
      api.get('/bookings'),
    ]).then(([o, s, b]) => {
      setOverview(o.data);
      setStats(s.data);
      setBookings((b.data.bookings || []).slice(0, 8));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const cards = [
    ['Total Cars', overview.totalCars],
    ['Total Users', overview.totalUsers],
    ['Total Bookings', overview.totalBookings],
    ['Total Revenue', formatCurrency(overview.totalRevenue)],
    ['Active Bookings', overview.activeBookings],
    ['Pending Bookings', overview.pendingBookings],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/admin/cars" className="btn-outline">Manage cars</Link>
          <Link to="/admin/cars/new" className="btn-primary">Add car</Link>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="card p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-4 font-semibold">Monthly bookings</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h2 className="mb-4 font-semibold">Monthly revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0b1b33" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="card mt-6 p-4">
        <h2 className="mb-4 font-semibold">Popular cars</h2>
        <div className="flex flex-wrap gap-2">
          {(stats.popularCars || []).map((c) => (
            <span key={c.name} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
              {c.name} · {c.count}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-8 overflow-x-auto card">
        <h2 className="px-4 pt-4 font-semibold">Recent bookings</h2>
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Car</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="px-4 py-3">{b.userId?.name}</td>
                <td className="px-4 py-3">{b.carId ? `${b.carId.brand} ${b.carId.model}` : '—'}</td>
                <td className="px-4 py-3">
                  {formatDate(b.pickupDate)} – {formatDate(b.returnDate)}
                </td>
                <td className="px-4 py-3">{formatCurrency(b.totalAmount)}</td>
                <td className="px-4 py-3">{b.bookingStatus}</td>
                <td className="px-4 py-3">
                  <Link to="/admin/bookings" className="text-accent-600">Manage</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
