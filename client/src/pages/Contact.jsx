import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { push } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      push('Please fill in all fields.', 'error');
      return;
    }
    push('Message sent. Our team will get back to you shortly.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2">
      <div>
        <h1 className="font-display text-4xl font-bold">Contact</h1>
        <p className="mt-3 text-slate-600">Questions about a booking, a corporate account or a partnership?</p>
        <div className="mt-6 space-y-2 text-sm text-slate-600">
          <p>Email: sahm7574@Gmail.com</p>
          <p>Phone: +91 62042 94942</p>
          <p>Phone: +91 73718 89751</p>
          <p>Hours: 24/7 roadside · 8am–10pm bookings</p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="card space-y-4 p-6">
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea className="input min-h-32" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="btn-primary w-full" type="submit">
          Send message
        </button>
      </form>
    </div>
  );
}
