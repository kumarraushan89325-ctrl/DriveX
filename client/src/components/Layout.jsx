import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminNav from './AdminNav';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <AdminNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
