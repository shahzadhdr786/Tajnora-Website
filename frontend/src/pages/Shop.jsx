import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/Product/ProductCard';
import Loading from '../components/UI/Loading';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sort') || '-createdAt';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productsAPI.getAll({ page: currentPage, limit: 12, sort: sortBy, category, minPrice, maxPrice }),
          categoriesAPI.getAll()
        ]);
        setProducts(prodRes.data.data.products);
        setPagination(prodRes.data.data.pagination);
        setCategories(catRes.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [currentPage, sortBy, category, minPrice, maxPrice]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <>
      <Helmet><title>Shop All Products | Tajnora</title></Helmet>
      <div className="section" style={{paddingTop:'2rem'}}>
        <div className="container">
          <h1 className="section-title">All Products</h1>
          
          {/* Filters */}
          <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginBottom:'2rem',justifyContent:'center'}}>
            <select value={sortBy} onChange={e => updateParam('sort', e.target.value)} className="form-input" style={{width:'auto',minWidth:'160px'}}>
              <option value="-createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-ratings.average">Top Rated</option>
              <option value="-soldCount">Best Selling</option>
            </select>
            <select value={category} onChange={e => updateParam('category', e.target.value)} className="form-input" style={{width:'auto',minWidth:'160px'}}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
            </select>
            <select value={maxPrice} onChange={e => updateParam('maxPrice', e.target.value)} className="form-input" style={{width:'auto',minWidth:'160px'}}>
              <option value="">All Prices</option>
              <option value="599">Under ₹599</option>
              <option value="999">Under ₹999</option>
              <option value="1999">Under ₹1999</option>
              <option value="2999">Under ₹2999</option>
            </select>
          </div>

          {loading ? <Loading /> : products.length === 0 ? (
            <div style={{textAlign:'center',padding:'4rem 0',color:'var(--color-text-secondary)'}}>
              <p style={{fontSize:'3rem'}}>🔍</p><p>No products found. Try different filters.</p>
            </div>
          ) : (
            <>
              <div className="product-grid stagger-children">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div style={{display:'flex',justifyContent:'center',gap:'0.5rem',marginTop:'3rem'}}>
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button key={i} onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', i+1); setSearchParams(p); }}
                      className={`btn ${currentPage === i+1 ? 'btn-gold' : 'btn-outline'} btn-sm`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
