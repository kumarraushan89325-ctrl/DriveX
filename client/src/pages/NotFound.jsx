import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <p className="text-sm uppercase tracking-widest text-slate-400">404</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
