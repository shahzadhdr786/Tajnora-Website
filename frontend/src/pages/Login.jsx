import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Login | Tajnora</title></Helmet>
      <div className="section" style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'70vh'}}>
        <div className="card" style={{width:'100%',maxWidth:'420px',padding:'2.5rem'}}>
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <h1 style={{fontFamily:'var(--font-heading)',fontSize:'1.75rem',marginBottom:'0.5rem'}}>Welcome Back</h1>
            <p style={{color:'var(--color-text-secondary)',fontSize:'0.9rem'}}>Login to your Tajnora account</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" /></div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" /></div>
            <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={loading} style={{marginTop:'0.5rem'}}>{loading ? 'Logging in...' : 'Login'}</button>
          </form>
          <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'0.9rem',color:'var(--color-text-secondary)'}}>
            Don't have an account? <Link to="/register" style={{color:'var(--color-accent)',fontWeight:600}}>Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
