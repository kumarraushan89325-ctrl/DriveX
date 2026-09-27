import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';

export default function Login() {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      push('Welcome back.');
      const dest =
        location.state?.from || (user.role === 'admin' ? '/admin' : '/dashboard');
      navigate(dest, { replace: true });
    } catch (error) {
      push(getErrorMessage(error, 'Invalid email or password.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <h1 className="font-display text-3xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Access your DriveNow account.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          New here? <Link to="/register" className="font-semibold text-accent-600">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
