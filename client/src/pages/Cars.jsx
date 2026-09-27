import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import CarCard from '../components/CarCard';
import Loader from '../components/Loader';
import SearchBox from '../components/SearchBox';

const brands = ['Toyota', 'Honda', 'Hyundai', 'Mahindra', 'Tata', 'BMW', 'Mercedes-Benz', 'Audi'];
const fuels = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const transmissions = ['Automatic', 'Manual'];
const seats = ['4', '5', '7'];
const types = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Convertible', 'Pickup'];

export default function Cars() {
  const [params] = useSearchParams();
  const { cars, loading, filters, setFilters, fetchCars } = useCars();

  useEffect(() => {
    const next = {
      location: params.get('location') || '',
      pickupDate: params.get('pickupDate') || '',
      returnDate: params.get('returnDate') || '',
    };
    setFilters((prev) => ({ ...prev, ...next }));
    fetchCars(next);
  }, [params]);

  const update = (patch) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    fetchCars(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Our Fleet</h1>
      <p className="mt-1 text-slate-500">Search, filter and book a car that fits your trip.</p>
      <div className="mt-6">
        <SearchBox
          compact
          initial={{
            location: filters.location,
            pickupDate: filters.pickupDate,
            returnDate: filters.returnDate,
          }}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit space-y-4 p-4">
          <h2 className="font-semibold">Filters</h2>
          <input
            className="input"
            placeholder="Search by brand or model..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
          />
          <label className="block text-sm">
            Brand
            <select className="input mt-1" value={filters.brand} onChange={(e) => update({ brand: e.target.value })}>
              <option value="">All</option>
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              type="number"
              placeholder="Min ₹"
              value={filters.minPrice}
              onChange={(e) => update({ minPrice: e.target.value })}
            />
            <input
              className="input"
              type="number"
              placeholder="Max ₹"
              value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: e.target.value })}
            />
          </div>
          <label className="block text-sm">
            Fuel type
            <select className="input mt-1" value={filters.fuelType} onChange={(e) => update({ fuelType: e.target.value })}>
              <option value="">All</option>
              {fuels.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Transmission
            <select
              className="input mt-1"
              value={filters.transmission}
              onChange={(e) => update({ transmission: e.target.value })}
            >
              <option value="">All</option>
              {transmissions.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Seats
            <select className="input mt-1" value={filters.seats} onChange={(e) => update({ seats: e.target.value })}>
              <option value="">All</option>
              {seats.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Car type
            <select className="input mt-1" value={filters.category} onChange={(e) => update({ category: e.target.value })}>
              <option value="">All</option>
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Availability
            <select
              className="input mt-1"
              value={filters.available}
              onChange={(e) => update({ available: e.target.value })}
            >
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </label>
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">{cars.length} cars found</p>
            <select className="input w-auto" value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
              <option value="price_asc">Price Low → High</option>
              <option value="price_desc">Price High → Low</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          {loading ? (
            <Loader />
          ) : cars.length === 0 ? (
            <div className="card p-10 text-center text-slate-500">No cars match your filters.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
