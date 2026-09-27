import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h3 className="font-display text-xl font-bold text-white">DriveNow</h3>
          <p className="mt-2 text-sm">Book Your Perfect Ride, Anytime, Anywhere.</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Explore</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/cars">Fleet</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Support</h4>
          <p className="text-sm">hello@drivenow.com</p>
          <p className="text-sm">+91 1800 200 3300</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Cities</h4>
          <p className="text-sm">Mumbai · Delhi · Bangalore · Hyderabad · Pune · Chennai . Bihar .Uttar Pradesh</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} DriveNow. All rights reserved.
      </div>
    </footer>
  );
}
