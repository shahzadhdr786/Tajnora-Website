import { Link } from 'react-router-dom';
import { FaTimes, FaPlus, FaMinus, FaTrash, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, subtotal, shipping, total, clearCart } = useCart();

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'cart-overlay--open' : ''}`} onClick={() => setIsOpen(false)} />
      <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`} id="cart-drawer">
        <div className="cart-drawer__header">
          <h3>Your Cart ({totalItems})</h3>
          <button onClick={() => setIsOpen(false)}><FaTimes size={18} /></button>
        </div>
        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <p style={{fontSize:'3rem'}}>🛍️</p>
            <p>Your cart is empty</p>
            <Link to="/shop" className="btn btn-gold" onClick={() => setIsOpen(false)}>Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map(item => (
                <div key={item._id} className="cart-item">
                  <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="cart-item__img" />
                  <div className="cart-item__info">
                    <Link to={`/product/${item.slug}`} className="cart-item__name" onClick={() => setIsOpen(false)}>{item.name}</Link>
                    <div className="cart-item__price">₹{item.price?.toLocaleString()}</div>
                    <div className="cart-item__controls">
                      <div className="cart-item__qty">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><FaMinus size={10} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><FaPlus size={10} /></button>
                      </div>
                      <button onClick={() => removeItem(item._id)} style={{color:'var(--color-error)'}}><FaTrash size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-drawer__footer">
              <div className="cart-drawer__row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="cart-drawer__row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="cart-drawer__row" style={{fontWeight:700,fontSize:'1.1rem',borderTop:'1px solid var(--color-border)',paddingTop:'0.75rem'}}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              <Link to="/checkout" className="btn btn-gold btn-block" onClick={() => setIsOpen(false)} style={{marginTop:'1rem'}}>Checkout <FaArrowRight /></Link>
              <button className="btn btn-outline btn-block btn-sm" onClick={clearCart} style={{marginTop:'0.5rem'}}>Clear Cart</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
