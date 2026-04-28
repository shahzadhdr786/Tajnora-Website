import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.submit(form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Contact Us | Tajnora</title></Helmet>
      <div style={{background:'var(--gradient-hero)',color:'var(--color-white)',padding:'4rem 0',textAlign:'center'}}>
        <div className="container">
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(2rem,4vw,3rem)'}}>Get In Touch</h1>
          <p style={{color:'rgba(255,255,255,0.6)',marginTop:'0.75rem'}}>We'd love to hear from you</p>
        </div>
      </div>
      <div className="section">
        <div className="container" style={{display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:'3rem',maxWidth:'1000px'}}>
          {/* Info */}
          <div>
            <h2 style={{fontFamily:'var(--font-heading)',marginBottom:'1.5rem',fontSize:'1.5rem'}}>Contact Information</h2>
            {[
              { icon: <FaEnvelope />, label: 'Email', value: 'support@tajnora.com' },
              { icon: <FaPhone />, label: 'Phone', value: '+91 98765 43210' },
              { icon: <FaMapMarkerAlt />, label: 'Address', value: 'Mumbai, Maharashtra, India' }
            ].map((item, i) => (
              <div key={i} style={{display:'flex',gap:'1rem',alignItems:'flex-start',marginBottom:'1.5rem'}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:'var(--color-bg-warm)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--color-accent)',flexShrink:0}}>{item.icon}</div>
                <div><p style={{fontWeight:600,fontSize:'0.9rem'}}>{item.label}</p><p style={{color:'var(--color-text-secondary)',fontSize:'0.9rem'}}>{item.value}</p></div>
              </div>
            ))}
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="card" style={{padding:'2rem'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <div className="form-group"><label className="form-label">Name *</label><input className="form-input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Subject *</label><input className="form-input" required value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Message *</label><textarea className="form-input" rows={5} required value={form.message} onChange={e=>setForm({...form,message:e.target.value})} /></div>
            <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={loading}><FaPaperPlane /> {loading ? 'Sending...' : 'Send Message'}</button>
          </form>
        </div>
      </div>
      <style>{`@media(max-width:768px){.container[style]{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
