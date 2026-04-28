import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetch = () => { ordersAPI.getAll({ status: filter || undefined, limit: 50 }).then(r=>setOrders(r.data.data.orders)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(fetch, [filter]);

  const updateStatus = async (id, status) => {
    try { await ordersAPI.updateStatus(id, { status }); toast.success(`Order ${status}`); fetch(); }
    catch(err) { toast.error('Update failed'); }
  };

  const statusColor = { Pending:'warning', Confirmed:'info', Processing:'info', Shipped:'info', Delivered:'success', Cancelled:'error', Returned:'error' };
  const statuses = ['', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div>
      <div className="admin-header"><h1>Orders</h1>
        <select className="admin-input" style={{width:'auto',minWidth:'150px'}} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="">All Status</option>{statuses.slice(1).map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="admin-card" style={{overflowX:'auto'}}>
        <table className="admin-table">
          <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>{orders.map(o=>(
            <tr key={o._id}>
              <td style={{fontWeight:600,fontSize:'0.85rem'}}>{o.orderNumber}</td>
              <td><div style={{fontSize:'0.85rem'}}>{o.user?.name}</div><div style={{fontSize:'0.75rem',color:'var(--admin-text-secondary)'}}>{o.user?.email}</div></td>
              <td>{o.items?.length}</td>
              <td style={{fontWeight:600}}>₹{o.total?.toLocaleString()}</td>
              <td>{o.paymentMethod}</td>
              <td><span className={`admin-badge admin-badge--${statusColor[o.status]||'info'}`}>{o.status}</span></td>
              <td style={{fontSize:'0.8rem',color:'var(--admin-text-secondary)'}}>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td><select className="admin-input" style={{padding:'0.3rem',fontSize:'0.8rem',width:'auto'}} value={o.status} onChange={e=>updateStatus(o._id, e.target.value)}>
                {statuses.slice(1).map(s=><option key={s} value={s}>{s}</option>)}
              </select></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
