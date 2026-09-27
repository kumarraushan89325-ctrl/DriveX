import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/format';

export default function MyBookings() {
  const { push } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/bookings/my');
    setBookings(data.bookings || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      push('Booking cancelled.');
      load();
    } catch (error) {
      push(getErrorMessage(error), 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-slate-500">You have not booked a car yet.</div>
      ) : (
        <div className="mt-6 grid gap-4">
          {bookings.map((b) => (
            <article key={b._id} className="card flex flex-col gap-4 p-5 md:flex-row md:items-center">
              <img
                src={b.carId?.images?.[0]}
                alt=""
                className="h-28 w-full rounded-xl object-cover md:w-44"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{b.carId ? `${b.carId.brand} ${b.carId.model}` : 'Car unavailable'}</h2>
                <p className="text-sm text-slate-500">
                  {formatDate(b.pickupDate)} → {formatDate(b.returnDate)} · {b.totalDays} days
                </p>
                <p className="text-sm">
                  {b.pickupLocation} → {b.dropoffLocation}
                </p>
                <p className="mt-1 font-semibold">{formatCurrency(b.totalAmount)}</p>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <span className="badge bg-slate-100">{b.bookingStatus}</span>
                <Link to={`/bookings/${b._id}`} className="text-sm font-semibold text-accent-600">
                  View details
                </Link>
                {['Pending', 'Confirmed'].includes(b.bookingStatus) && (
                  <button type="button" className="text-sm text-red-600" onClick={() => cancel(b._id)}>
                    Cancel booking
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
