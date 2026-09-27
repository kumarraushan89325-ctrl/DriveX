import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/format';

export default function ManageUsers() {
  const { push } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/users');
    setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this user and their bookings?')) return;
    try {
      await api.delete(`/users/${id}`);
      push('User deleted.');
      load();
    } catch (error) {
      push(getErrorMessage(error), 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Manage Users</h1>
      <div className="mt-6 overflow-x-auto card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3">
                  {u.role !== 'admin' && (
                    <button type="button" className="text-red-600" onClick={() => remove(u._id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
