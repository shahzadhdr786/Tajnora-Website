import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaArrowRight, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/Product/ProductCard';
import Loading from '../components/UI/Loading';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productsAPI.getFeatured(8),
          categoriesAPI.getAll()
        ]);
        setFeatured(prodRes.data.data);
        setCategories(catRes.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const testimonials = [
    { name: 'Riya Sharma', text: 'Elegant Design! I purchased gold-plated earrings from Tajnora, and the design is absolutely stunning. It looks premium and goes perfectly with outfits.', rating: 5 },
    { name: 'Neha Verma', text: 'Affordable Luxury! The necklace I ordered looks luxurious and came in beautiful packaging. Great quality for the price!', rating: 5 },
    { name: 'Simran Kaur', text: 'Perfect for Gifting! Ordered a bracelet set for my friend—she loved it! Tajnora has become my go-to brand for gifts.', rating: 5 }
  ];

  const priceRanges = [
    { label: 'Under ₹599', max: 599, color: '#e8d5b7' },
    { label: 'Under ₹999', max: 999, color: '#d4c4a8' },
    { label: 'Under ₹1999', max: 1999, color: '#c9b896' },
    { label: 'Under ₹2999', max: 2999, color: '#bead87' }
  ];

  if (loading) return <Loading />;

  return (
    <>
      <Helmet>
        <title>Tajnora - Premium Handcrafted Jewelry | Gold Plated Bracelets, Earrings & Rings</title>
        <meta name="description" content="Shop premium handcrafted jewelry at Tajnora. Discover elegant 18K gold plated bracelets, earrings, rings and necklaces. Free shipping. COD available." />
      </Helmet>

      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero__bg" />
        <div className="container hero__content">
          <span className="hero__tag animate-fadeInUp">✨ New Collection 2024</span>
          <h1 className="hero__title animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            Discover Timeless<br /><span className="hero__title-accent">Elegance</span>
          </h1>
          <p className="hero__subtitle animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            Handcrafted jewelry that celebrates your unique style. Premium 18K gold plated pieces with anti-tarnish finish.
          </p>
          <div className="hero__cta animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <Link to="/shop" className="btn btn-gold btn-lg">Shop Now <FaArrowRight /></Link>
            <Link to="/category/tajbari-premium" className="btn btn-white btn-lg">Premium Collection</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" id="categories-section">
        <div className="container">
          <h2 className="section-title">~ Shop by Collection ~</h2>
          <div className="categories-grid stagger-children">
            {categories.slice(0, 4).map(cat => (
              <Link key={cat._id} to={`/category/${cat.slug}`} className="category-card">
                <div className="category-card__image-wrap">
                  <div className="category-card__placeholder">{cat.name[0]}</div>
                </div>
                <h3 className="category-card__name">{cat.name.toUpperCase()}</h3>
                <span className="category-card__link">Shop Now →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{background: 'var(--color-bg-warm)'}} id="featured-section">
        <div className="container">
          <h2 className="section-title">Discover Our Curated Collection</h2>
          <p className="section-subtitle">Handpicked pieces of fine jewelry for every occasion</p>
          <div className="product-grid stagger-children">
            {featured.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div style={{textAlign:'center', marginTop: '2.5rem'}}>
            <Link to="/shop" className="btn btn-primary btn-lg">View All Products <FaArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* Shop by Price */}
      <section className="section" id="price-section">
        <div className="container">
          <h2 className="section-title">Shop by Price</h2>
          <div className="price-grid stagger-children">
            {priceRanges.map((range, i) => (
              <Link key={i} to={`/shop?maxPrice=${range.max}`} className="price-card" style={{'--card-bg': range.color}}>
                <span className="price-card__label">{range.label}</span>
                <FaArrowRight className="price-card__arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner" id="cta-section">
        <div className="container cta-banner__content">
          <h2 className="cta-banner__title">Join Our Movement</h2>
          <p className="cta-banner__text">More than jewelry — a celebration of handcrafted elegance, conscious beauty, and stories that shine with you, every day.</p>
          <a href="https://instagram.com" target="_blank" rel="noopener" className="btn btn-gold btn-lg">Follow Our Journey on Instagram</a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" id="testimonials-section">
        <div className="container">
          <h2 className="section-title">Customer Testimonials</h2>
          <div className="testimonials-grid stagger-children">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card card">
                <FaQuoteLeft className="testimonial-card__quote" />
                <div className="stars" style={{marginBottom:'0.75rem'}}>
                  {[...Array(t.rating)].map((_, j) => <FaStar key={j} color="#d4af37" size={14} />)}
                </div>
                <p className="testimonial-card__text">{t.text}</p>
                <div className="testimonial-card__author">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
