import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/Product/ProductCard';
import Loading from '../components/UI/Loading';

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          categoriesAPI.getBySlug(slug),
          productsAPI.getAll({ category: slug, limit: 50 })
        ]);
        setCategory(catRes.data.data);
        setProducts(prodRes.data.data.products);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [slug]);

  if (loading) return <Loading />;

  return (
    <>
      <Helmet><title>{category?.name || 'Category'} | Tajnora</title></Helmet>
      <div style={{background:'var(--gradient-hero)',color:'var(--color-white)',padding:'3rem 0',textAlign:'center'}}>
        <div className="container">
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(2rem,4vw,3rem)',marginBottom:'0.5rem'}}>{category?.name}</h1>
          <p style={{color:'rgba(255,255,255,0.6)',maxWidth:'500px',margin:'0 auto'}}>{category?.description || 'Explore our collection'}</p>
        </div>
      </div>
      <div className="section">
        <div className="container">
          {products.length === 0 ? (
            <div style={{textAlign:'center',padding:'3rem',color:'var(--color-text-secondary)'}}>
              <p style={{fontSize:'3rem'}}>📦</p><p>No products in this category yet.</p>
            </div>
          ) : (
            <div className="product-grid stagger-children">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
          )}
        </div>
      </div>
    </>
  );
}
