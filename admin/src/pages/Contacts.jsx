import { useState, useEffect } from 'react';
import { FaTrash, FaEnvelopeOpen } from 'react-icons/fa';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => { contactAPI.getAll().then(r=>setContacts(r.data.data)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(fetch, []);

  const markRead = async (id) => { try { await contactAPI.markAsRead(id); fetch(); } catch(err) { toast.error('Failed'); } };
  const del = async (id) => { if(!confirm('Delete?'))return; try { await contactAPI.delete(id); toast.success('Deleted'); fetch(); } catch(err) { toast.error('Failed'); } };

  return (
    <div>
      <div className="admin-header"><h1>Contact Messages</h1></div>
      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{contacts.map(c=>(
            <tr key={c._id} style={{opacity: c.isRead ? 0.7 : 1}}>
              <td style={{fontWeight:c.isRead?400:600}}>{c.name}</td>
              <td style={{fontSize:'0.85rem'}}>{c.email}</td>
              <td>{c.subject}</td>
              <td style={{maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'0.85rem',color:'var(--admin-text-secondary)'}}>{c.message}</td>
              <td><span className={`admin-badge admin-badge--${c.isRead?'success':'warning'}`}>{c.isRead?'Read':'Unread'}</span></td>
              <td style={{fontSize:'0.8rem',color:'var(--admin-text-secondary)'}}>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td><div style={{display:'flex',gap:'0.5rem'}}>
                {!c.isRead && <button className="admin-btn admin-btn--outline admin-btn--sm" onClick={()=>markRead(c._id)}><FaEnvelopeOpen /></button>}
                <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={()=>del(c._id)}><FaTrash /></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
