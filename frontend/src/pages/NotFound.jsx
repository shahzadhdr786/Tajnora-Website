import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 - Page Not Found | Tajnora</title></Helmet>
      <div className="section" style={{textAlign:'center',minHeight:'60vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <h1 style={{fontFamily:'var(--font-heading)',fontSize:'6rem',background:'var(--gradient-gold)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>404</h1>
        <h2 style={{fontFamily:'var(--font-heading)',fontSize:'1.5rem',marginBottom:'1rem'}}>Page Not Found</h2>
        <p style={{color:'var(--color-text-secondary)',marginBottom:'2rem'}}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-gold btn-lg">Back to Home</Link>
      </div>
    </>
  );
}
