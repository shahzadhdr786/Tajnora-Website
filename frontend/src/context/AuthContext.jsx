import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tajnora_token');
    const savedUser = localStorage.getItem('tajnora_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      authAPI.getMe().then(res => {
        setUser(res.data.data);
        localStorage.setItem('tajnora_user', JSON.stringify(res.data.data));
      }).catch(() => {
        logout();
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { user: userData, token } = res.data.data;
    localStorage.setItem('tajnora_token', token);
    localStorage.setItem('tajnora_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { user: userData, token } = res.data.data;
    localStorage.setItem('tajnora_token', token);
    localStorage.setItem('tajnora_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('tajnora_token');
    localStorage.removeItem('tajnora_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};
