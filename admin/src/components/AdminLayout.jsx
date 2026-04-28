import { NavLink, Outlet } from 'react-router-dom';
import { FaHome, FaBox, FaTags, FaShoppingCart, FaUsers, FaEnvelope, FaSignOutAlt, FaStore } from 'react-icons/fa';

const links = [
  { to: '/', icon: <FaHome />, label: 'Dashboard', end: true },
  { to: '/products', icon: <FaBox />, label: 'Products' },
  { to: '/categories', icon: <FaTags />, label: 'Categories' },
  { to: '/orders', icon: <FaShoppingCart />, label: 'Orders' },
  { to: '/users', icon: <FaUsers />, label: 'Users' },
  { to: '/contacts', icon: <FaEnvelope />, label: 'Messages' },
];

export default function AdminLayout({ user, onLogout }) {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar__logo">Tajnora Admin</div>
        <nav className="sidebar__nav">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}>
              {link.icon}<span>{link.label}</span>
            </NavLink>
          ))}
          <a href="http://localhost:3000" target="_blank" rel="noopener" className="sidebar__link">
            <FaStore /><span>View Store</span>
          </a>
        </nav>
        <div className="sidebar__footer">
          <div style={{marginBottom:'0.5rem'}}><strong>{user.name}</strong></div>
          <button onClick={onLogout} className="sidebar__link" style={{width:'100%',color:'var(--admin-error)'}}>
            <FaSignOutAlt /><span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}
