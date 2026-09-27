import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/format';

export default function BookingDetails() {
  const { id } = useParams();
  const { push } = useToast();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get(`/bookings/${id}`);
      setBooking(data.booking);
    } catch (err) {
      setError(getErrorMessage(err, 'Booking not found.'));
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const cancel = async () => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      push('Booking cancelled.');
      load();
    } catch (err) {
      push(getErrorMessage(err), 'error');
    }
  };

  if (error) return <p className="px-4 py-16 text-center text-red-600">{error}</p>;
  if (!booking) return <Loader />;

  const car = booking.carId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/my-bookings" className="text-sm font-semibold text-accent-600">
        ← Back to bookings
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold">Booking details</h1>
      <div className="card mt-6 overflow-hidden">
        {car?.images?.[0] && <img src={car.images[0]} alt="" className="h-52 w-full object-cover" />}
        <div className="space-y-3 p-6 text-sm">
          <p className="text-lg font-semibold">{car ? `${car.brand} ${car.model}` : 'Car unavailable'}</p>
          <p>
            {formatDate(booking.pickupDate)} → {formatDate(booking.returnDate)} ({booking.totalDays} days)
          </p>
          <p>
            Pickup: {booking.pickupLocation} · Drop-off: {booking.dropoffLocation}
          </p>
          <p>Status: {booking.bookingStatus} · Payment: {booking.paymentStatus}</p>
          <div className="rounded-xl bg-slate-50 p-4">
            <p>Price/day: {formatCurrency(booking.pricePerDay)}</p>
            <p>Subtotal: {formatCurrency(booking.subtotal)}</p>
            <p>Tax: {formatCurrency(booking.tax)}</p>
            <p className="font-semibold">Total: {formatCurrency(booking.totalAmount)}</p>
          </div>
          {['Pending', 'Confirmed'].includes(booking.bookingStatus) && (
            <button type="button" className="btn-outline text-red-600" onClick={cancel}>
              Cancel booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
