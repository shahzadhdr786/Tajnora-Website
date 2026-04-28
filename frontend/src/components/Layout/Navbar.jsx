import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingBag, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'All Products' },
    { path: '/category/earrings', label: 'Earrings' },
    { path: '/category/bracelets', label: 'Bracelets' },
    { path: '/category/rings', label: 'Rings' },
    { path: '/category/tajbari-premium', label: 'Premium' },
  ];

  return (
    <header className="navbar" id="main-navbar">
      <div className="container navbar__inner">
        {/* Mobile menu toggle */}
        <button className="navbar__menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Logo */}
        <Link to="/" className="navbar__logo" id="navbar-logo">
          <span className="navbar__logo-text">Tajnora</span>
        </Link>

        {/* Navigation links */}
        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`} id="main-nav">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="navbar__link" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <button className="navbar__action-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search" id="search-toggle">
            <FaSearch size={16} />
          </button>

          {user ? (
            <div className="navbar__user-menu">
              <button className="navbar__action-btn" aria-label="Account">
                <FaUser size={16} />
              </button>
              <div className="navbar__dropdown">
                <span className="navbar__dropdown-name">{user.name}</span>
                <Link to="/about" className="navbar__dropdown-link">My Account</Link>
                {user.role === 'admin' && (
                  <a href="http://localhost:3001" className="navbar__dropdown-link" target="_blank" rel="noopener">Admin Panel</a>
                )}
                <button className="navbar__dropdown-link" onClick={logout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="navbar__action-btn" aria-label="Login" id="login-link">
              <FaUser size={16} />
            </Link>
          )}

          <button className="navbar__action-btn navbar__cart-btn" onClick={() => setIsOpen(true)} aria-label="Cart" id="cart-toggle">
            <FaShoppingBag size={16} />
            {totalItems > 0 && <span className="navbar__cart-count">{totalItems}</span>}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="navbar__search animate-fadeIn" id="search-bar">
          <form onSubmit={handleSearch} className="container navbar__search-form">
            <input type="text" placeholder="Search for jewelry..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus className="navbar__search-input" id="search-input" />
            <button type="submit" className="btn btn-gold btn-sm">Search</button>
            <button type="button" onClick={() => setSearchOpen(false)} className="navbar__search-close"><FaTimes /></button>
          </form>
        </div>
      )}
    </header>
  );
}
