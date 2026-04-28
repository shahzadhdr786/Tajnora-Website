import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function Layout() {
  return (
    <>
      <div className="announcement-bar">
        <span>✨ Clearance Sale: Flat 70% off on all products | Use Code <strong>TAJBARI20</strong> for Extra 20% off ✨</span>
      </div>
      <Navbar />
      <main style={{ minHeight: '60vh' }}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
