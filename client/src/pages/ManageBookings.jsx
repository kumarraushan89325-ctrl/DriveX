import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/format';

export default function ManageBookings() {
  const { push } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/bookings');
    setBookings(data.bookings || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, patch) => {
    try {
      await api.put(`/bookings/${id}/status`, patch);
      push('Booking updated.');
      load();
    } catch (error) {
      push(getErrorMessage(error), 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Manage Bookings</h1>
      <div className="mt-6 overflow-x-auto card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Car</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="px-4 py-3">{b.userId?.name}</td>
                <td className="px-4 py-3">{b.carId ? `${b.carId.brand} ${b.carId.model}` : '—'}</td>
                <td className="px-4 py-3">{formatDate(b.pickupDate)} – {formatDate(b.returnDate)}</td>
                <td className="px-4 py-3">{formatCurrency(b.totalAmount)}</td>
                <td className="px-4 py-3">
                  <select className="input" value={b.bookingStatus} onChange={(e) => update(b._id, { bookingStatus: e.target.value })}>
                    {['Pending', 'Confirmed', 'Cancelled', 'Completed'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select className="input" value={b.paymentStatus} onChange={(e) => update(b._id, { paymentStatus: e.target.value })}>
                    {['Pending', 'Paid', 'Failed', 'Refunded'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {b.bookingStatus === 'Pending' && (
                    <div className="flex gap-2">
                      <button type="button" className="text-emerald-600" onClick={() => update(b._id, { bookingStatus: 'Confirmed', paymentStatus: 'Paid' })}>
                        Approve
                      </button>
                      <button type="button" className="text-red-600" onClick={() => update(b._id, { bookingStatus: 'Cancelled' })}>
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
