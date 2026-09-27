import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import { LOCATIONS } from '../utils/format';

export default function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const [form, setForm] = useState(null);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/cars/${id}`).then(({ data }) => {
      const car = data.car;
      setForm({
        ...car,
        features: (car.features || []).join(', '),
      });
    });
  }, [id]);

  if (!form) return <Loader />;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      ['brand', 'model', 'year', 'pricePerDay', 'category', 'fuelType', 'transmission', 'seats', 'mileage', 'location', 'description', 'features', 'isAvailable'].forEach((key) => {
        data.append(key, form[key]);
      });
      [...files].forEach((file) => data.append('images', file));
      await api.put(`/cars/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      push('Car updated.');
      navigate('/admin/cars');
    } catch (error) {
      push(getErrorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Edit Car</h1>
      <form onSubmit={onSubmit} className="card mt-6 grid gap-4 p-6 md:grid-cols-2">
        {['brand', 'model', 'year', 'pricePerDay', 'mileage', 'seats'].map((field) => (
          <input key={field} className="input" name={field} value={form[field]} onChange={onChange} required />
        ))}
        <select className="input" name="category" value={form.category} onChange={onChange}>
          {['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Convertible', 'Pickup'].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="input" name="fuelType" value={form.fuelType} onChange={onChange}>
          {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="input" name="transmission" value={form.transmission} onChange={onChange}>
          <option>Automatic</option>
          <option>Manual</option>
        </select>
        <select className="input" name="location" value={form.location} onChange={onChange}>
          {LOCATIONS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <textarea className="input md:col-span-2" name="description" value={form.description} onChange={onChange} />
        <input className="input md:col-span-2" name="features" value={form.features} onChange={onChange} />
        <input className="md:col-span-2" type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isAvailable" checked={!!form.isAvailable} onChange={onChange} />
          Available
        </label>
        <button className="btn-primary md:col-span-2" disabled={saving}>
          {saving ? 'Saving...' : 'Update car'}
        </button>
      </form>
    </div>
  );
}
