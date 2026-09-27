import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOCATIONS } from '../utils/format';

export default function SearchBox({ compact = false, initial = {} }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location: initial.location || '',
    dropoffLocation: initial.dropoffLocation || '',
    pickupDate: initial.pickupDate || '',
    returnDate: initial.returnDate || '',
  });
  const [error, setError] = useState('');

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (form.pickupDate && form.returnDate && form.returnDate <= form.pickupDate) {
      setError('Return date must be after pickup date.');
      return;
    }
    const params = new URLSearchParams();
    if (form.location) params.set('location', form.location);
    if (form.dropoffLocation) params.set('dropoff', form.dropoffLocation);
    if (form.pickupDate) params.set('pickupDate', form.pickupDate);
    if (form.returnDate) params.set('returnDate', form.returnDate);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`grid gap-3 ${compact ? '' : 'rounded-2xl bg-white p-4 shadow-card md:p-6'} md:grid-cols-5`}
    >
      <label className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
        Pickup location
        <select name="location" value={form.location} onChange={onChange} className="input mt-1">
          <option value="">Any city</option>
          {LOCATIONS.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </label>
      <label className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
        Drop-off location
        <select name="dropoffLocation" value={form.dropoffLocation} onChange={onChange} className="input mt-1">
          <option value="">Same as pickup</option>
          {LOCATIONS.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </label>
      <label className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
        Pickup date
        <input type="date" name="pickupDate" value={form.pickupDate} onChange={onChange} className="input mt-1" />
      </label>
      <label className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
        Return date
        <input type="date" name="returnDate" value={form.returnDate} onChange={onChange} className="input mt-1" />
      </label>
      <div className="flex flex-col justify-end">
        <button type="submit" className="btn-primary w-full py-2.5">
          Search Cars
        </button>
      </div>
      {error && <p className="text-sm text-red-600 md:col-span-5">{error}</p>}
    </form>
  );
}
