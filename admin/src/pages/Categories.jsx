import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', description:'', sortOrder:0 });

  const fetch = () => { categoriesAPI.getAll().then(r=>setCategories(r.data.data)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(fetch, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await categoriesAPI.update(editing, form); toast.success('Updated!'); }
      else { await categoriesAPI.create(form); toast.success('Created!'); }
      setShowModal(false); fetch();
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await categoriesAPI.delete(id); toast.success('Deleted'); fetch(); }
    catch(err) { toast.error(err.response?.data?.message||'Delete failed'); }
  };

  return (
    <div>
      <div className="admin-header"><h1>Categories</h1>
        <button className="admin-btn admin-btn--primary" onClick={()=>{setEditing(null);setForm({name:'',description:'',sortOrder:0});setShowModal(true);}}><FaPlus /> Add Category</button>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Products</th><th>Order</th><th>Actions</th></tr></thead>
          <tbody>{categories.map(c=>(
            <tr key={c._id}><td style={{fontWeight:500}}>{c.name}</td><td style={{color:'var(--admin-text-secondary)'}}>{c.slug}</td><td>{c.productCount||0}</td><td>{c.sortOrder}</td>
              <td><div style={{display:'flex',gap:'0.5rem'}}>
                <button className="admin-btn admin-btn--outline admin-btn--sm" onClick={()=>{setEditing(c._id);setForm({name:c.name,description:c.description||'',sortOrder:c.sortOrder||0});setShowModal(true);}}><FaEdit /></button>
                <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={()=>handleDelete(c._id)}><FaTrash /></button>
              </div></td></tr>
          ))}</tbody>
        </table>
      </div>
      {showModal && (
        <div className="admin-modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="admin-modal" onClick={e=>e.stopPropagation()}>
            <div className="admin-modal__header"><h3>{editing?'Edit':'Add'} Category</h3><button onClick={()=>setShowModal(false)}><FaTimes color="#94a3b8" /></button></div>
            <form onSubmit={handleSubmit}><div className="admin-modal__body">
              <div className="admin-form-group"><label className="admin-label">Name *</label><input className="admin-input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div className="admin-form-group"><label className="admin-label">Description</label><textarea className="admin-input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
              <div className="admin-form-group"><label className="admin-label">Sort Order</label><input className="admin-input" type="number" value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:Number(e.target.value)})} /></div>
            </div><div className="admin-modal__footer"><button type="button" className="admin-btn admin-btn--outline" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="admin-btn admin-btn--primary">{editing?'Update':'Create'}</button></div></form>
          </div>
        </div>
      )}
    </div>
  );
}
