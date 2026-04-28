import { useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(email, password);
      toast.success('Welcome, Admin!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f172a'}}>
      <div style={{width:'100%',maxWidth:'400px',padding:'2.5rem',background:'#1e293b',borderRadius:'12px',border:'1px solid #334155'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <h1 style={{fontSize:'1.75rem',fontWeight:700,background:'linear-gradient(135deg,#c9a96e,#f0d78c)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Tajnora Admin</h1>
          <p style={{color:'#94a3b8',fontSize:'0.9rem',marginTop:'0.5rem'}}>Sign in to your admin account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group"><label className="admin-label">Email</label><input className="admin-input" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@tajnora.com" /></div>
          <div className="admin-form-group"><label className="admin-label">Password</label><input className="admin-input" type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" /></div>
          <button type="submit" className="admin-btn admin-btn--primary" style={{width:'100%',padding:'0.8rem',fontSize:'0.95rem',marginTop:'0.5rem'}} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'0.8rem',color:'#475569'}}>Default: admin@tajnora.com / Admin@123456</p>
      </div>
    </div>
  );
}
