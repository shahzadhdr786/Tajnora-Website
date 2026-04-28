import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [form, setForm] = useState({ name: user?.name||'', email: user?.email||'', phone:'', street:'', city:'', state:'', zipCode:'', paymentMethod:'COD' });

  if (!items.length) return <div className="section" style={{textAlign:'center'}}><Helmet><title>Checkout | Tajnora</title></Helmet><h2>Cart is empty</h2><button className="btn btn-gold" onClick={()=>navigate('/shop')}>Shop Now</button></div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    setLoading(true);
    try {
      await ordersAPI.create({ items: items.map(i=>({product:i._id,quantity:i.quantity})), shippingAddress:{name:form.name,email:form.email,phone:form.phone,street:form.street,city:form.city,state:form.state,zipCode:form.zipCode}, paymentMethod:form.paymentMethod, couponCode:coupon });
      clearCart(); toast.success('Order placed!'); navigate('/');
    } catch(err) { toast.error(err.response?.data?.message||'Order failed'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Checkout | Tajnora</title></Helmet>
      <div className="section"><div className="container">
        <h1 className="section-title">Checkout</h1>
        <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:'2.5rem'}}>
          <form onSubmit={handleSubmit}>
            <h3 style={{fontFamily:'var(--font-heading)',marginBottom:'1rem'}}>Shipping</h3>
            {['name','email','phone','street','city','state','zipCode'].map(k=>(
              <div className="form-group" key={k}><label className="form-label">{k.charAt(0).toUpperCase()+k.slice(1)} *</label>
              <input className="form-input" required value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} type={k==='email'?'email':'text'}/></div>
            ))}
            <h3 style={{fontFamily:'var(--font-heading)',margin:'1rem 0'}}>Payment</h3>
            <div style={{display:'flex',gap:'1rem',marginBottom:'2rem'}}>
              {['COD','Online','UPI'].map(m=>(
                <label key={m} style={{padding:'0.75rem 1.25rem',border:form.paymentMethod===m?'2px solid var(--color-accent)':'2px solid var(--color-border)',borderRadius:'8px',cursor:'pointer'}}>
                  <input type="radio" name="pay" value={m} checked={form.paymentMethod===m} onChange={e=>setForm({...form,paymentMethod:e.target.value})} style={{marginRight:'0.5rem'}}/>{m}
                </label>
              ))}
            </div>
            <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={loading}>{loading?'Placing...':'Place Order'}</button>
          </form>
          <div className="card" style={{padding:'1.5rem',position:'sticky',top:'90px'}}>
            <h3 style={{fontFamily:'var(--font-heading)',marginBottom:'1rem'}}>Summary</h3>
            {items.map(i=><div key={i._id} style={{display:'flex',justifyContent:'space-between',padding:'0.4rem 0',fontSize:'0.85rem',borderBottom:'1px solid var(--color-border-light)'}}><span>{i.name} ×{i.quantity}</span><span>₹{(i.price*i.quantity).toLocaleString()}</span></div>)}
            <div style={{marginTop:'1rem',display:'flex',gap:'0.5rem'}}><input className="form-input" placeholder="Coupon" value={coupon} onChange={e=>setCoupon(e.target.value)} style={{fontSize:'0.85rem'}}/><button className="btn btn-outline btn-sm" type="button">Apply</button></div>
            <div style={{marginTop:'1rem',borderTop:'2px solid var(--color-border)',paddingTop:'0.75rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem'}}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.9rem'}}><span>Shipping</span><span>{shipping===0?'FREE':`₹${shipping}`}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:700,fontSize:'1.15rem',marginTop:'0.5rem'}}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div></div>
    </>
  );
}
