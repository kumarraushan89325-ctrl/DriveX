import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/format';
import { FaGasPump, FaCogs, FaUsers, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

export default function CarCard({ car }) {
  const navigate = useNavigate();
  const image = car.images?.[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80';

  return (
    <article className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          className={`badge absolute left-3 top-3 ${
            car.isAvailable ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'
          }`}
        >
          {car.isAvailable ? 'Available' : 'Unavailable'}
        </span>
        <span className="absolute bottom-3 right-3 rounded-lg bg-navy-900/90 px-2.5 py-1 text-sm font-semibold text-white">
          {formatCurrency(car.pricePerDay)}
          <span className="text-xs font-normal text-slate-300"> /day</span>
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">{car.brand}</p>
            <h3 className="font-display text-lg font-semibold">
              {car.model} <span className="text-sm font-medium text-slate-400">{car.year}</span>
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500">
            <FaStar /> {car.rating?.toFixed(1) || '4.5'}
          </span>
        </div>
        <p className="flex items-center gap-1 text-sm text-slate-500">
          <FaMapMarkerAlt className="text-accent-500" /> {car.location}
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
            <FaGasPump /> {car.fuelType}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
            <FaCogs /> {car.transmission}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
            <FaUsers /> {car.seats} seats
          </span>
        </div>
        <div className="flex gap-2 pt-1">
          <Link to={`/cars/${car._id}`} className="btn-outline flex-1 text-center">
            View Details
          </Link>
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={() => navigate(`/cars/${car._id}#book`)}
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}
