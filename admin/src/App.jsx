import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Contacts from './pages/Contacts';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tajnora_token');
    if (token) {
      authAPI.getMe().then(res => {
        if (res.data.data.role === 'admin') setUser(res.data.data);
        else { localStorage.removeItem('tajnora_token'); }
      }).catch(() => localStorage.removeItem('tajnora_token')).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const handleLogin = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { user: u, token } = res.data.data;
    if (u.role !== 'admin') throw new Error('Admin access only');
    localStorage.setItem('tajnora_token', token);
    localStorage.setItem('tajnora_user', JSON.stringify(u));
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem('tajnora_token');
    localStorage.removeItem('tajnora_user');
    setUser(null);
  };

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'#c9a96e',fontSize:'1.25rem'}}>Loading...</div>;

  if (!user) return <LoginPage onLogin={handleLogin} />;

  return (
    <Routes>
      <Route path="/" element={<AdminLayout user={user} onLogout={handleLogout} />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="contacts" element={<Contacts />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
