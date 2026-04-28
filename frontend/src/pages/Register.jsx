import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Register | Tajnora</title></Helmet>
      <div className="section" style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'70vh'}}>
        <div className="card" style={{width:'100%',maxWidth:'420px',padding:'2.5rem'}}>
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <h1 style={{fontFamily:'var(--font-heading)',fontSize:'1.75rem',marginBottom:'0.5rem'}}>Create Account</h1>
            <p style={{color:'var(--color-text-secondary)',fontSize:'0.9rem'}}>Join Tajnora today</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" required minLength={6} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" required value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} /></div>
            <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
          </form>
          <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'0.9rem',color:'var(--color-text-secondary)'}}>
            Already have an account? <Link to="/login" style={{color:'var(--color-accent)',fontWeight:600}}>Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}
