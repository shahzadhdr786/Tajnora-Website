import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import StarRating from '../UI/StarRating';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discount = product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div className="product-card card">
      <Link to={`/product/${product.slug}`} className="product-card__image-wrap">
        <img src={imageUrl} alt={product.name} className="product-card__image" loading="lazy" />
        <div className="product-card__badges">
          {discount > 0 && <span className="badge badge-sale">{discount}% OFF</span>}
          {product.isNewArrival && <span className="badge badge-new">NEW</span>}
          {product.isBestSeller && <span className="badge badge-gold">BESTSELLER</span>}
        </div>
        <div className="product-card__overlay">
          <span>View Details</span>
        </div>
      </Link>
      <div className="product-card__info">
        <Link to={`/product/${product.slug}`}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>
        {product.ratings?.count > 0 && (
          <StarRating rating={product.ratings.average} count={product.ratings.count} size={12} />
        )}
        <div className="product-card__bottom">
          <div className="price">
            <span className="price-current">₹{product.price?.toLocaleString()}</span>
            {product.compareAtPrice > product.price && (
              <span className="price-original">₹{product.compareAtPrice?.toLocaleString()}</span>
            )}
          </div>
          <button className="product-card__add-btn" onClick={(e) => { e.preventDefault(); addItem(product); }}
            title="Add to Cart" aria-label="Add to cart">
            <FaShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
