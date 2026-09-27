import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../services/api';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { push } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email, phone: form.phone };
      if (form.password) payload.password = form.password;
      await updateProfile(user._id, payload);
      push('Profile updated.');
      setForm((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      push(getErrorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Profile</h1>
      <form onSubmit={onSubmit} className="card mt-6 space-y-4 p-6">
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input
          className="input"
          type="password"
          placeholder="New password (optional)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn-primary w-full" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
