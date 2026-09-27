import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaCar, FaHeadset, FaRupeeSign, FaSearch, FaCheckCircle, FaCreditCard } from 'react-icons/fa';
import SearchBox from '../components/SearchBox';
import CarCard from '../components/CarCard';
import Loader from '../components/Loader';
import { useCars } from '../context/CarContext';

const features = [
  { icon: FaCalendarCheck, title: 'Easy Booking', text: 'Reserve in a few clicks with instant availability checks.' },
  { icon: FaCar, title: 'Wide Range of Cars', text: 'From compact sedans to luxury SUVs, choose what fits the trip.' },
  { icon: FaRupeeSign, title: 'Affordable Prices', text: 'Transparent daily rates, taxes included in your quote.' },
  { icon: FaHeadset, title: '24/7 Support', text: 'Roadside help and booking assistance whenever you need it.' },
];

const reviews = [
  { name: 'Priya S.', city: 'Mumbai', quote: 'Picked up a Creta at the airport with zero hassle. Clean car, fair price.' },
  { name: 'Rahul K.', city: 'Delhi', quote: 'The Thar made our weekend trip. Booking and cancellation were both straightforward.' },
  { name: 'Ananya M.', city: 'Bangalore', quote: 'Loved the BMW for a client meeting. Professional service from start to finish.' },
];

export default function Home() {
  const { cars, loading, fetchCars } = useCars();

  useEffect(() => {
    fetchCars({ sort: 'popular' });
  }, []);

  const popular = cars.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-accent-400">DriveNow</p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">Your Journey Starts Here.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Find, compare and book your perfect car in just a few clicks.
          </p>
          <div className="mt-8 max-w-5xl text-navy-900">
            <SearchBox />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Popular Cars</h2>
            <p className="mt-1 text-slate-500">Most booked vehicles this month.</p>
          </div>
          <Link to="/cars" className="text-sm font-semibold text-accent-600">
            View all
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center font-display text-3xl font-bold">Why Choose Us?</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500/10 text-accent-600">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-10 text-center font-display text-3xl font-bold">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: FaSearch, step: 'Step 1', title: 'Search', text: 'Choose city and dates to see cars that are actually free.' },
            { icon: FaCheckCircle, step: 'Step 2', title: 'Choose Your Car', text: 'Compare specs, prices and features side by side.' },
            { icon: FaCreditCard, step: 'Step 3', title: 'Book & Pay', text: 'Confirm your reservation and hit the road.' },
          ].map((item) => (
            <div key={item.step} className="card p-6 text-center">
              <item.icon className="mx-auto text-accent-500" size={28} />
              <p className="mt-3 text-xs uppercase tracking-widest text-slate-400">{item.step}</p>
              <h3 className="mt-1 font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center font-display text-3xl font-bold">Customer Reviews</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <blockquote key={r.name} className="rounded-2xl bg-white/5 p-6">
                <p className="text-slate-100">“{r.quote}”</p>
                <footer className="mt-4 text-sm text-slate-300">
                  {r.name} · {r.city}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="overflow-hidden rounded-3xl bg-accent-500 px-8 py-12 text-center text-white md:px-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Ready for your next adventure?</h2>
          <p className="mt-3 text-blue-100">Thousands of trips start with DriveNow every month.</p>
          <Link to="/cars" className="btn-outline mt-6 bg-white text-navy-900">
            Book a Car
          </Link>
        </div>
      </section>
    </div>
  );
}
