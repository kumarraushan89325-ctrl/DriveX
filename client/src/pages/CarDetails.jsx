import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaGasPump, FaCogs, FaUsers, FaMapMarkerAlt, FaRoad } from 'react-icons/fa';
import api, { getErrorMessage } from '../services/api';
import Loader from '../components/Loader';
import BookingForm from '../components/BookingForm';
import { formatCurrency } from '../utils/format';

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [active, setActive] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/cars/${id}`);
        setCar(data.car);
      } catch (err) {
        setError(getErrorMessage(err, 'Car not found.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader />;
  if (error || !car) return <p className="px-4 py-16 text-center text-red-600">{error || 'Car not found.'}</p>;

  const images = car.images?.length
    ? car.images
    : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80'];

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.4fr_0.8fr]">
      <div>
        <img src={images[active]} alt={car.model} className="h-80 w-full rounded-3xl object-cover md:h-[420px]" />
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button key={img} type="button" onClick={() => setActive(i)} className="shrink-0">
                <img
                  src={img}
                  alt=""
                  className={`h-16 w-24 rounded-xl object-cover ${i === active ? 'ring-2 ring-accent-500' : ''}`}
                />
              </button>
            ))}
          </div>
        )}
        <div className="mt-6">
          <p className="text-sm uppercase tracking-wide text-slate-500">{car.brand}</p>
          <h1 className="font-display text-3xl font-bold">
            {car.model} <span className="text-xl text-slate-400">{car.year}</span>
          </h1>
          <p className="mt-2 text-2xl font-semibold text-accent-600">
            {formatCurrency(car.pricePerDay)} <span className="text-sm font-normal text-slate-500">/ day</span>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <span className="card flex items-center gap-2 p-3">
              <FaGasPump className="text-accent-500" /> {car.fuelType}
            </span>
            <span className="card flex items-center gap-2 p-3">
              <FaCogs className="text-accent-500" /> {car.transmission}
            </span>
            <span className="card flex items-center gap-2 p-3">
              <FaUsers className="text-accent-500" /> {car.seats} seats
            </span>
            <span className="card flex items-center gap-2 p-3">
              <FaRoad className="text-accent-500" /> {car.mileage}
            </span>
            <span className="card flex items-center gap-2 p-3">
              <FaMapMarkerAlt className="text-accent-500" /> {car.location}
            </span>
            <span className="card p-3">{car.category}</span>
          </div>
          <p className="mt-6 text-slate-600">{car.description}</p>
          <h2 className="mt-8 font-display text-xl font-semibold">Features</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {(car.features || []).map((f) => (
              <li key={f} className="rounded-xl bg-white px-4 py-2 text-sm shadow-card">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <BookingForm car={car} />
    </div>
  );
}
