import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use(c => { const t = localStorage.getItem('tajnora_token'); if(t) c.headers.Authorization=`Bearer ${t}`; return c; });

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => { api.get('/users').then(r=>setUsers(r.data.data.users)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(fetch, []);

  const toggleActive = async (id, isActive) => {
    try { await api.put(`/users/${id}`, { isActive: !isActive }); toast.success('Updated'); fetch(); }
    catch(err) { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete user?')) return;
    try { await api.delete(`/users/${id}`); toast.success('Deleted'); fetch(); }
    catch(err) { toast.error(err.response?.data?.message||'Failed'); }
  };

  return (
    <div>
      <div className="admin-header"><h1>Users</h1></div>
      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>{users.map(u=>(
            <tr key={u._id}>
              <td style={{fontWeight:500}}>{u.name}</td><td style={{color:'var(--admin-text-secondary)'}}>{u.email}</td>
              <td><span className={`admin-badge admin-badge--${u.role==='admin'?'warning':'info'}`}>{u.role}</span></td>
              <td><button onClick={()=>toggleActive(u._id, u.isActive)} className={`admin-badge admin-badge--${u.isActive?'success':'error'}`} style={{cursor:'pointer'}}>{u.isActive?'Active':'Inactive'}</button></td>
              <td style={{fontSize:'0.8rem',color:'var(--admin-text-secondary)'}}>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>{u.role!=='admin'&&<button className="admin-btn admin-btn--danger admin-btn--sm" onClick={()=>deleteUser(u._id)}><FaTrash /></button>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
