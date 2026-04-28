import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <h3 className="footer__logo">Tajnora</h3>
            <p className="footer__desc">More than jewelry — a celebration of handcrafted elegance, conscious beauty, and stories that shine with you, every day.</p>
            <div className="footer__socials">
              <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <Link to="/" className="footer__link">Home</Link>
            <Link to="/shop" className="footer__link">Shop</Link>
            <Link to="/about" className="footer__link">About Us</Link>
            <Link to="/contact" className="footer__link">Contact</Link>
            <Link to="/search" className="footer__link">Search</Link>
          </div>

          {/* Collections */}
          <div className="footer__col">
            <h4 className="footer__heading">Collections</h4>
            <Link to="/category/bracelets" className="footer__link">Bracelets</Link>
            <Link to="/category/earrings" className="footer__link">Earrings</Link>
            <Link to="/category/rings" className="footer__link">Rings</Link>
            <Link to="/category/necklaces" className="footer__link">Necklaces</Link>
            <Link to="/category/tajbari-premium" className="footer__link">Tajbari Premium</Link>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__heading">Contact Us</h4>
            <div className="footer__contact-item"><FaEnvelope /><span>support@tajnora.com</span></div>
            <div className="footer__contact-item"><FaPhone /><span>+91 98765 43210</span></div>
            <div className="footer__contact-item"><FaMapMarkerAlt /><span>Mumbai, India</span></div>
          </div>
        </div>

        {/* Features bar */}
        <div className="footer__features">
          <div className="footer__feature"><strong>🏆 Premium Quality</strong><span>Lasting shine & fine detailing</span></div>
          <div className="footer__feature"><strong>🚚 Free Shipping</strong><span>On orders above ₹999</span></div>
          <div className="footer__feature"><strong>💰 COD Available</strong><span>Pay on delivery</span></div>
          <div className="footer__feature"><strong>🔒 Secure Payments</strong><span>100% secure gateway</span></div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Tajnora. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
