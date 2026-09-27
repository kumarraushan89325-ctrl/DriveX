import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/format';

export default function ManageCars() {
  const { push } = useToast();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/cars');
    setCars(data.cars || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (car) => {
    try {
      await api.put(`/cars/${car._id}`, { isAvailable: !car.isAvailable });
      load();
    } catch (error) {
      push(getErrorMessage(error), 'error');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this car?')) return;
    try {
      await api.delete(`/cars/${id}`);
      push('Car deleted.');
      load();
    } catch (error) {
      push(getErrorMessage(error), 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Manage Cars</h1>
        <Link to="/admin/cars/new" className="btn-primary">Add Car</Link>
      </div>
      <div className="mt-6 overflow-x-auto card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">Car</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Available</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id} className="border-t">
                <td className="px-4 py-3">{car.brand} {car.model}</td>
                <td className="px-4 py-3">{formatCurrency(car.pricePerDay)}</td>
                <td className="px-4 py-3">{car.location}</td>
                <td className="px-4 py-3">
                  <button type="button" className="text-accent-600" onClick={() => toggle(car)}>
                    {car.isAvailable ? 'Yes' : 'No'}
                  </button>
                </td>
                <td className="space-x-3 px-4 py-3">
                  <Link to={`/admin/cars/${car._id}/edit`} className="text-accent-600">Edit</Link>
                  <button type="button" className="text-red-600" onClick={() => remove(car._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
