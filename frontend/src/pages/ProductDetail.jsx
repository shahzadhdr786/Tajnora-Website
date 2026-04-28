import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaShoppingBag, FaHeart, FaMinus, FaPlus, FaChevronLeft, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import { productsAPI, reviewsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/Product/ProductCard';
import StarRating from '../components/UI/StarRating';
import Loading from '../components/UI/Loading';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productsAPI.getBySlug(slug);
        setProduct(res.data.data.product);
        setRelated(res.data.data.relatedProducts);
        setSelectedImage(0);
        setQuantity(1);
        // Fetch reviews
        const revRes = await reviewsAPI.getByProduct(res.data.data.product._id);
        setReviews(revRes.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <Loading />;
  if (!product) return <div className="container section" style={{textAlign:'center'}}><h2>Product not found</h2><Link to="/shop" className="btn btn-primary">Back to Shop</Link></div>;

  const discount = product.compareAtPrice > product.price ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;
  const images = product.images?.length > 0 ? product.images : [{ url: 'https://via.placeholder.com/600', alt: 'Product' }];

  return (
    <>
      <Helmet>
        <title>{product.name} | Tajnora</title>
        <meta name="description" content={product.shortDescription || product.description?.substring(0, 160)} />
      </Helmet>

      <div className="container" style={{padding:'2rem var(--container-padding)'}}>
        <Link to="/shop" style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',color:'var(--color-text-secondary)',marginBottom:'1.5rem',fontSize:'0.9rem'}}>
          <FaChevronLeft size={12} /> Back to Shop
        </Link>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',alignItems:'start'}} className="product-detail-grid">
          {/* Images */}
          <div>
            <div style={{borderRadius:'var(--radius-lg)',overflow:'hidden',background:'var(--color-bg-warm)',aspectRatio:'1',marginBottom:'1rem'}}>
              <img src={images[selectedImage]?.url} alt={images[selectedImage]?.alt || product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            {images.length > 1 && (
              <div style={{display:'flex',gap:'0.5rem'}}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} style={{
                    width:'70px',height:'70px',borderRadius:'var(--radius-md)',overflow:'hidden',
                    border: i === selectedImage ? '2px solid var(--color-accent)' : '2px solid var(--color-border-light)',
                    opacity: i === selectedImage ? 1 : 0.6
                  }}>
                    <img src={img.url} alt={img.alt} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && <Link to={`/category/${product.category.slug}`} style={{color:'var(--color-accent)',fontSize:'0.85rem',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.05em'}}>{product.category.name}</Link>}
            <h1 style={{fontFamily:'var(--font-heading)',fontSize:'1.75rem',margin:'0.5rem 0 1rem',lineHeight:1.3}}>{product.name}</h1>
            
            <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.25rem'}}>
              <StarRating rating={product.ratings?.average || 0} count={product.ratings?.count || 0} />
            </div>

            <div style={{display:'flex',alignItems:'baseline',gap:'0.75rem',marginBottom:'1.5rem'}}>
              <span style={{fontSize:'1.75rem',fontWeight:700,color:'var(--color-primary)'}}>₹{product.price?.toLocaleString()}</span>
              {product.compareAtPrice > product.price && (
                <>
                  <span style={{fontSize:'1.1rem',color:'var(--color-text-light)',textDecoration:'line-through'}}>₹{product.compareAtPrice?.toLocaleString()}</span>
                  <span className="badge badge-sale">{discount}% OFF</span>
                </>
              )}
            </div>

            <p style={{color:'var(--color-text-secondary)',lineHeight:1.7,marginBottom:'1.5rem'}}>{product.description}</p>

            {product.material && <p style={{fontSize:'0.9rem',marginBottom:'0.5rem'}}><strong>Material:</strong> {product.material}</p>}
            {product.stock > 0 ? (
              <p style={{color:'var(--color-success)',fontSize:'0.9rem',marginBottom:'1.5rem'}}>✓ In Stock ({product.stock} available)</p>
            ) : (
              <p style={{color:'var(--color-error)',fontSize:'0.9rem',marginBottom:'1.5rem'}}>✗ Out of Stock</p>
            )}

            {/* Quantity & Add to Cart */}
            <div style={{display:'flex',gap:'1rem',alignItems:'center',marginBottom:'2rem',flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',border:'1.5px solid var(--color-border)',borderRadius:'var(--radius-md)'}}>
                <button onClick={() => setQuantity(Math.max(1, quantity-1))} style={{padding:'0.75rem 1rem'}}><FaMinus size={12} /></button>
                <span style={{padding:'0.75rem 1.25rem',fontWeight:600,minWidth:'40px',textAlign:'center'}}>{quantity}</span>
                <button onClick={() => setQuantity(quantity+1)} style={{padding:'0.75rem 1rem'}}><FaPlus size={12} /></button>
              </div>
              <button className="btn btn-gold btn-lg" onClick={() => addItem(product, quantity)} disabled={product.stock === 0} style={{flex:1}}>
                <FaShoppingBag /> Add to Cart
              </button>
              <button className="btn btn-outline" style={{padding:'0.85rem'}}><FaHeart size={18} /></button>
            </div>

            {/* Features */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem',padding:'1.5rem',background:'var(--color-bg-warm)',borderRadius:'var(--radius-lg)'}}>
              <div style={{textAlign:'center',fontSize:'0.8rem'}}><FaTruck style={{color:'var(--color-accent)',marginBottom:'0.25rem'}} size={20} /><p>Free Shipping</p></div>
              <div style={{textAlign:'center',fontSize:'0.8rem'}}><FaShieldAlt style={{color:'var(--color-accent)',marginBottom:'0.25rem'}} size={20} /><p>Secure Payment</p></div>
              <div style={{textAlign:'center',fontSize:'0.8rem'}}><FaUndo style={{color:'var(--color-accent)',marginBottom:'0.25rem'}} size={20} /><p>Easy Returns</p></div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div style={{marginTop:'4rem'}}>
            <h2 className="section-title">Customer Reviews</h2>
            <div style={{display:'grid',gap:'1rem',maxWidth:'700px',margin:'0 auto'}}>
              {reviews.map(r => (
                <div key={r._id} className="card" style={{padding:'1.25rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                    <strong style={{fontSize:'0.9rem'}}>{r.user?.name || 'Customer'}</strong>
                    <StarRating rating={r.rating} size={12} />
                  </div>
                  <p style={{color:'var(--color-text-secondary)',fontSize:'0.9rem'}}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div style={{marginTop:'4rem'}}>
            <h2 className="section-title">You May Also Like</h2>
            <div className="product-grid stagger-children">{related.map(p => <ProductCard key={p._id} product={p} />)}</div>
          </div>
        )}
      </div>

      <style>{`@media(max-width:768px){.product-detail-grid{grid-template-columns:1fr!important;gap:2rem!important}}`}</style>
    </>
  );
}
