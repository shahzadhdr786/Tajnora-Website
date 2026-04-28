import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('tajnora_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tajnora_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        toast.success('Cart updated');
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      toast.success('Added to cart');
      return [...prev, { _id: product._id, name: product.name, slug: product.slug, price: product.price, compareAtPrice: product.compareAtPrice, image: product.images?.[0]?.url || '', quantity }];
    });
  };

  const removeItem = (productId) => {
    setItems(prev => prev.filter(item => item._id !== productId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    setItems(prev => prev.map(item => item._id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => { setItems([]); };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, shipping, total }}>
      {children}
    </CartContext.Provider>
  );
};
