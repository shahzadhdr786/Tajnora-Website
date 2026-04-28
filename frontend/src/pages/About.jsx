import { Helmet } from 'react-helmet-async';
import { FaGem, FaHeart, FaAward, FaLeaf } from 'react-icons/fa';

export default function About() {
  return (
    <>
      <Helmet><title>About Us | Tajnora</title></Helmet>
      
      {/* Hero */}
      <div style={{background:'var(--gradient-hero)',color:'var(--color-white)',padding:'5rem 0',textAlign:'center'}}>
        <div className="container">
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(2rem,5vw,3.5rem)',marginBottom:'1rem'}}>Our Story</h1>
          <p style={{color:'rgba(255,255,255,0.65)',maxWidth:'600px',margin:'0 auto',fontSize:'1.1rem',lineHeight:1.7}}>
            More than jewelry — a celebration of handcrafted elegance, conscious beauty, and stories that shine with you, every day.
          </p>
        </div>
      </div>

      {/* Values */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose Tajnora?</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))',gap:'2rem',marginTop:'2rem'}}>
            {[
              { icon: <FaGem size={32} />, title: 'Premium Quality', desc: 'Every piece is crafted with high-quality materials ensuring lasting shine and fine detailing that stands the test of time.' },
              { icon: <FaHeart size={32} />, title: 'Handcrafted with Love', desc: 'Our artisans pour their passion into every creation, making each piece unique and special.' },
              { icon: <FaAward size={32} />, title: 'Anti-Tarnish Coating', desc: 'Our signature anti-tarnish finish keeps your jewelry looking new, piece after piece.' },
              { icon: <FaLeaf size={32} />, title: 'Conscious Beauty', desc: 'We believe in sustainable practices and ethical sourcing for all our materials.' }
            ].map((v, i) => (
              <div key={i} className="card" style={{padding:'2rem',textAlign:'center'}}>
                <div style={{color:'var(--color-accent)',marginBottom:'1rem'}}>{v.icon}</div>
                <h3 style={{fontFamily:'var(--font-heading)',marginBottom:'0.75rem'}}>{v.title}</h3>
                <p style={{color:'var(--color-text-secondary)',fontSize:'0.9rem',lineHeight:1.7}}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{background:'var(--color-bg-warm)',padding:'4rem 0'}}>
        <div className="container" style={{maxWidth:'700px',textAlign:'center'}}>
          <h2 className="section-title">Our Mission</h2>
          <p style={{fontSize:'1.05rem',lineHeight:1.8,color:'var(--color-text-secondary)'}}>
            At Tajnora, we believe that everyone deserves to feel elegant and confident. Our mission is to make premium quality jewelry accessible and affordable, without compromising on design or craftsmanship. Each piece in our collection is thoughtfully designed to complement your personal style and celebrate the moments that matter most.
          </p>
        </div>
      </section>
    </>
  );
}
