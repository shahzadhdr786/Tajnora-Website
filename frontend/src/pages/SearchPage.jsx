import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { productsAPI } from '../services/api';
import ProductCard from '../components/Product/ProductCard';
import Loading from '../components/UI/Loading';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      productsAPI.search(query).then(res => setProducts(res.data.data)).catch(console.error).finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <>
      <Helmet><title>Search: {query} | Tajnora</title></Helmet>
      <div className="section">
        <div className="container">
          <h1 className="section-title">{query ? `Search results for "${query}"` : 'Search Products'}</h1>
          {loading ? <Loading /> : products.length === 0 ? (
            <div style={{textAlign:'center',padding:'3rem',color:'var(--color-text-secondary)'}}>
              <p style={{fontSize:'3rem'}}>🔍</p>
              <p>{query ? 'No products found. Try a different search.' : 'Enter a search term above.'}</p>
            </div>
          ) : (
            <>
              <p style={{textAlign:'center',color:'var(--color-text-secondary)',marginBottom:'2rem'}}>{products.length} product(s) found</p>
              <div className="product-grid stagger-children">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
