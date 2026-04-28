import { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart, FaUsers, FaTags, FaEnvelope, FaDollarSign } from 'react-icons/fa';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getStats().then(res => setStats(res.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'50vh',color:'var(--admin-text-secondary)'}}>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load stats</div>;

  const cards = [
    { icon: <FaDollarSign />, label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    { icon: <FaShoppingCart />, label: 'Total Orders', value: stats.totalOrders, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    { icon: <FaBox />, label: 'Products', value: stats.totalProducts, color: '#c9a96e', bg: 'rgba(201,169,110,0.15)' },
    { icon: <FaUsers />, label: 'Customers', value: stats.totalUsers, color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
    { icon: <FaTags />, label: 'Categories', value: stats.totalCategories, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { icon: <FaEnvelope />, label: 'Unread Messages', value: stats.unreadContacts, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  ];

  const statusColor = { Pending: 'warning', Confirmed: 'info', Shipped: 'info', Delivered: 'success', Cancelled: 'error' };

  return (
    <div>
      <div className="admin-header"><h1>Dashboard</h1></div>
      <div className="stats-grid">
        {cards.map((c, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card__icon" style={{background:c.bg,color:c.color}}>{c.icon}</div>
            <div><div className="stat-card__value">{c.value}</div><div className="stat-card__label">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* Order Status */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
        <div className="admin-card">
          <h3 style={{marginBottom:'1rem',fontSize:'1rem'}}>Orders by Status</h3>
          {Object.entries(stats.ordersByStatus || {}).map(([status, count]) => (
            <div key={status} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.5rem 0',borderBottom:'1px solid var(--admin-border)'}}>
              <span className={`admin-badge admin-badge--${statusColor[status] || 'info'}`}>{status}</span>
              <span style={{fontWeight:600}}>{count}</span>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h3 style={{marginBottom:'1rem',fontSize:'1rem'}}>Recent Orders</h3>
          {stats.recentOrders?.map(order => (
            <div key={order._id} style={{display:'flex',justifyContent:'space-between',padding:'0.5rem 0',borderBottom:'1px solid var(--admin-border)',fontSize:'0.85rem'}}>
              <div>
                <div style={{fontWeight:600}}>{order.orderNumber}</div>
                <div style={{color:'var(--admin-text-secondary)',fontSize:'0.8rem'}}>{order.user?.name}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:600}}>₹{order.total?.toLocaleString()}</div>
                <span className={`admin-badge admin-badge--${statusColor[order.status] || 'info'}`}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
