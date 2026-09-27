import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LOCATIONS, daysBetween, formatCurrency } from '../utils/format';

const TAX_RATE = 0.18;

export default function BookingForm({ car }) {
  const { user } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pickupLocation: car.location || '',
    dropoffLocation: car.location || '',
    pickupDate: '',
    returnDate: '',
  });
  const [availability, setAvailability] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const totalDays = useMemo(
    () => daysBetween(form.pickupDate, form.returnDate),
    [form.pickupDate, form.returnDate]
  );
  const subtotal = totalDays > 0 ? totalDays * car.pricePerDay : 0;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  useEffect(() => {
    const check = async () => {
      if (!form.pickupDate || !form.returnDate || totalDays < 1) {
        setAvailability(null);
        return;
      }
      try {
        const { data } = await api.get(`/cars/${car._id}/availability`, {
          params: { pickupDate: form.pickupDate, returnDate: form.returnDate },
        });
        setAvailability(data);
      } catch (error) {
        setAvailability({ available: false, message: getErrorMessage(error) });
      }
    };
    check();
  }, [car._id, form.pickupDate, form.returnDate, totalDays]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      push('Please log in to book a car.', 'info');
      navigate('/login', { state: { from: `/cars/${car._id}` } });
      return;
    }
    if (user.role === 'admin') {
      push('Admin accounts cannot create customer bookings.', 'error');
      return;
    }
    if (totalDays < 1) {
      push('Return date must be after pickup date.', 'error');
      return;
    }
    if (availability && !availability.available) {
      push(availability.message || 'This car is not available for the selected dates.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', { carId: car._id, ...form });
      push('Booking submitted. We will confirm shortly.');
      navigate(`/bookings/${data.booking._id}`);
    } catch (error) {
      push(getErrorMessage(error), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id="book" onSubmit={onSubmit} className="card space-y-4 p-5">
      <h3 className="font-display text-xl font-semibold">Reserve this car</h3>
      <label className="block text-sm font-medium">
        Pickup location
        <select name="pickupLocation" value={form.pickupLocation} onChange={onChange} className="input mt-1" required>
          {LOCATIONS.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Drop-off location
        <select name="dropoffLocation" value={form.dropoffLocation} onChange={onChange} className="input mt-1" required>
          {LOCATIONS.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Pickup date
          <input type="date" name="pickupDate" value={form.pickupDate} onChange={onChange} className="input mt-1" required />
        </label>
        <label className="block text-sm font-medium">
          Return date
          <input type="date" name="returnDate" value={form.returnDate} onChange={onChange} className="input mt-1" required />
        </label>
      </div>
      <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
        <div className="flex justify-between">
          <span>Number of days</span>
          <strong>{totalDays || '—'}</strong>
        </div>
        <div className="flex justify-between">
          <span>Price / day</span>
          <strong>{formatCurrency(car.pricePerDay)}</strong>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>
        <div className="flex justify-between">
          <span>Taxes (18%)</span>
          <strong>{formatCurrency(tax)}</strong>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-2 text-base">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
      {availability && (
        <p className={`text-sm ${availability.available ? 'text-emerald-600' : 'text-red-600'}`}>
          {availability.message}
        </p>
      )}
      <button type="submit" className="btn-primary w-full" disabled={submitting || !car.isAvailable}>
        {submitting ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  );
}
