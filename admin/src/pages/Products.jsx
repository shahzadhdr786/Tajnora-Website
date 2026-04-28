import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { productsAPI, categoriesAPI, uploadAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', description:'', shortDescription:'', price:'', compareAtPrice:'', category:'', stock:'', material:'', tags:'', isFeatured:false, isNewArrival:false, isBestSeller:false, images:[] });

  const fetchData = async () => {
    try {
      const [p, c] = await Promise.all([productsAPI.getAll({ limit: 100 }), categoriesAPI.getAll()]);
      setProducts(p.data.data.products);
      setCategories(c.data.data);
    } catch(err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name:'', description:'', shortDescription:'', price:'', compareAtPrice:'', category: categories[0]?._id||'', stock:'10', material:'', tags:'', isFeatured:false, isNewArrival:false, isBestSeller:false, images:[] });
    setShowModal(true);
  };

  const openEdit = async (id) => {
    try {
      const res = await productsAPI.getById(id);
      const p = res.data.data;
      setEditing(p._id);
      setForm({ name:p.name, description:p.description, shortDescription:p.shortDescription||'', price:p.price, compareAtPrice:p.compareAtPrice||'', category:p.category?._id||p.category, stock:p.stock, material:p.material||'', tags:p.tags?.join(', ')||'', isFeatured:p.isFeatured, isNewArrival:p.isNewArrival, isBestSeller:p.isBestSeller, images:p.images||[] });
      setShowModal(true);
    } catch(err) { toast.error('Failed to load product'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price), compareAtPrice: Number(form.compareAtPrice)||0, stock: Number(form.stock), tags: form.tags ? form.tags.split(',').map(t=>t.trim()) : [] };
    try {
      if (editing) { await productsAPI.update(editing, data); toast.success('Updated!'); }
      else { await productsAPI.create(data); toast.success('Created!'); }
      setShowModal(false);
      fetchData();
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await productsAPI.delete(id); toast.success('Deleted'); fetchData(); }
    catch(err) { toast.error('Delete failed'); }
  };

  const handleImageUpload = async (e) => {
    const formData = new FormData();
    for (const file of e.target.files) formData.append('images', file);
    try {
      const res = await uploadAPI.productImages(formData);
      const newImages = res.data.data.map(f => ({ url: f.url, alt: '', isPrimary: form.images.length === 0 }));
      setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      toast.success('Uploaded!');
    } catch(err) { toast.error('Upload failed'); }
  };

  const f = (key, type='text') => ({ value: form[key], onChange: e => setForm({...form, [key]: type==='checkbox' ? e.target.checked : e.target.value}), type });

  if (loading) return <div style={{textAlign:'center',padding:'3rem',color:'var(--admin-text-secondary)'}}>Loading...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1>Products ({products.length})</h1>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}><FaPlus /> Add Product</button>
      </div>

      <div className="admin-card" style={{overflowX:'auto'}}>
        <table className="admin-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <img src={p.images?.[0]?.url||'https://via.placeholder.com/40'} style={{width:40,height:40,borderRadius:'6px',objectFit:'cover'}} alt="" />
                  <div><div style={{fontWeight:500,fontSize:'0.85rem'}}>{p.name}</div><div style={{fontSize:'0.75rem',color:'var(--admin-text-secondary)'}}>{p.slug}</div></div>
                </td>
                <td>{p.category?.name || '—'}</td>
                <td>₹{p.price?.toLocaleString()}</td>
                <td><span className={`admin-badge admin-badge--${p.stock>0?'success':'error'}`}>{p.stock}</span></td>
                <td>{p.isFeatured ? '⭐' : '—'}</td>
                <td>
                  <div style={{display:'flex',gap:'0.5rem'}}>
                    <button className="admin-btn admin-btn--outline admin-btn--sm" onClick={()=>openEdit(p._id)}><FaEdit /></button>
                    <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={()=>handleDelete(p._id)}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="admin-modal" onClick={e=>e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={()=>setShowModal(false)}><FaTimes color="#94a3b8" /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal__body">
                <div className="admin-form-group"><label className="admin-label">Name *</label><input className="admin-input" required {...f('name')} /></div>
                <div className="admin-form-group"><label className="admin-label">Description *</label><textarea className="admin-input" required {...f('description')} /></div>
                <div className="admin-form-group"><label className="admin-label">Short Description</label><input className="admin-input" {...f('shortDescription')} /></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
                  <div className="admin-form-group"><label className="admin-label">Price *</label><input className="admin-input" type="number" required {...f('price','number')} /></div>
                  <div className="admin-form-group"><label className="admin-label">Compare Price</label><input className="admin-input" type="number" {...f('compareAtPrice','number')} /></div>
                  <div className="admin-form-group"><label className="admin-label">Stock *</label><input className="admin-input" type="number" required {...f('stock','number')} /></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  <div className="admin-form-group"><label className="admin-label">Category *</label>
                    <select className="admin-input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required>
                      <option value="">Select</option>{categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="admin-form-group"><label className="admin-label">Material</label><input className="admin-input" {...f('material')} /></div>
                </div>
                <div className="admin-form-group"><label className="admin-label">Tags (comma-separated)</label><input className="admin-input" {...f('tags')} placeholder="gold, bracelet, premium" /></div>
                <div className="admin-form-group"><label className="admin-label">Images</label><input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{color:'var(--admin-text-secondary)'}} /></div>
                {form.images.length > 0 && <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1rem'}}>{form.images.map((img,i)=><img key={i} src={img.url} style={{width:60,height:60,objectFit:'cover',borderRadius:'6px'}} alt="" />)}</div>}
                <div style={{display:'flex',gap:'1.5rem'}}>
                  <label style={{display:'flex',alignItems:'center',gap:'0.4rem',fontSize:'0.85rem',cursor:'pointer'}}><input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})} /> Featured</label>
                  <label style={{display:'flex',alignItems:'center',gap:'0.4rem',fontSize:'0.85rem',cursor:'pointer'}}><input type="checkbox" checked={form.isNewArrival} onChange={e=>setForm({...form,isNewArrival:e.target.checked})} /> New Arrival</label>
                  <label style={{display:'flex',alignItems:'center',gap:'0.4rem',fontSize:'0.85rem',cursor:'pointer'}}><input type="checkbox" checked={form.isBestSeller} onChange={e=>setForm({...form,isBestSeller:e.target.checked})} /> Best Seller</label>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--outline" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
