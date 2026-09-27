import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/format';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my').then(({ data }) => setBookings(data.bookings || [])).finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter((b) => ['Pending', 'Confirmed'].includes(b.bookingStatus));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Hello, {user?.name?.split(' ')[0]}</h1>
      <p className="mt-1 text-slate-500">Manage trips, bookings and your profile.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Total bookings</p>
          <p className="mt-1 text-3xl font-bold">{bookings.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Active trips</p>
          <p className="mt-1 text-3xl font-bold">{upcoming.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Account</p>
          <p className="mt-1 font-semibold">{user?.email}</p>
        </div>
      </div>
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent bookings</h2>
          <Link to="/my-bookings" className="text-sm font-semibold text-accent-600">
            View all
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : bookings.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            No bookings yet. <Link to="/cars" className="font-semibold text-accent-600">Browse cars</Link>
          </div>
        ) : (
          <div className="overflow-x-auto card">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Car</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b._id} className="border-t">
                    <td className="px-4 py-3">{b.carId ? `${b.carId.brand} ${b.carId.model}` : 'Car removed'}</td>
                    <td className="px-4 py-3">
                      {formatDate(b.pickupDate)} – {formatDate(b.returnDate)}
                    </td>
                    <td className="px-4 py-3">{formatCurrency(b.totalAmount)}</td>
                    <td className="px-4 py-3">{b.bookingStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
