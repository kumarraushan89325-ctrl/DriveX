import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';

export default function Register() {
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      push('Passwords do not match.', 'error');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      push('Account created. Welcome to DriveNow.');
      navigate('/dashboard');
    } catch (error) {
      push(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <h1 className="font-display text-3xl font-bold">Register</h1>
        <p className="mt-1 text-sm text-slate-500">Book cars faster with a DriveNow account.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {['name', 'email', 'phone', 'password', 'confirmPassword'].map((field) => (
            <input
              key={field}
              className="input"
              type={field.toLowerCase().includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
              placeholder={
                field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)
              }
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
            />
          ))}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          Already registered? <Link to="/login" className="font-semibold text-accent-600">Login</Link>
        </p>
      </div>
    </div>
  );
}
