import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, CartItem, Review, StoreSettings } from './types';
import { initialProducts, initialOrders, initialReviews } from './data';

interface AppContextType {
  products: Product[];
  setProducts: (p: Product[]) => void;
  orders: Order[];
  setOrders: (o: Order[]) => void;
  reviews: Review[];
  setReviews: (r: Review[]) => void;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  
  // Admin Product CRUD
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Admin Order Status
  updateOrderStatus: (orderId: string, status: 'Processing' | 'Shipped' | 'Delivered') => void;
  
  // Admin Store Settings
  storeSettings: StoreSettings;
  setStoreSettings: (s: StoreSettings) => void;

  isCartOpen: boolean;
  setIsCartOpen: (v: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (v: boolean) => void;
  heroBannerUrl: string;
  setHeroBannerUrl: (url: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isCheckoutRoute: boolean;
  setIsCheckoutRoute: (v: boolean) => void;
  razorpayKey: string;
  setRazorpayKey: (key: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [products, setProductsState] = useState<Product[]>([]);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [reviews, setReviewsState] = useState<Review[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutRoute, setIsCheckoutRoute] = useState(false);
  const [heroBannerUrl, setHeroBannerUrlState] = useState<string>(() => {
    const newDefaultBanner = 'https://i.ibb.co/213pqNtr/Gemini-Generated-Image-e7j9d2e7j9d2e7j9.png';
    const oldDefaultBanner = 'https://i.ibb.co/mVhpF4wx/Gemini-Generated-Image-et0tcget0tcget0t.png';
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('veda_banner');
      if (!stored || stored === oldDefaultBanner) {
        localStorage.setItem('veda_banner', newDefaultBanner);
        return newDefaultBanner;
      }
      return stored;
    }
    return newDefaultBanner;
  });
  const [razorpayKey, setRazorpayKeyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('veda_rzp_key') || 'rzp_live_TZxxLG9OOpt6BJ';
    }
    return 'rzp_live_TZxxLG9OOpt6BJ';
  });

  const [storeSettings, setStoreSettingsState] = useState<StoreSettings>(() => {
    const defaultSettings: StoreSettings = {
      bannerUrl: 'https://i.ibb.co/213pqNtr/Gemini-Generated-Image-e7j9d2e7j9d2e7j9.png',
      announcementText: 'LIMITED TIME OFFER: GET FREE SHIPPING ON ALL PREPAID ORDERS!',
      supportPhone: '+91 98765 43210',
      brandName: 'VEDA KING',
      checkoutSliderImages: [
        'https://i.ibb.co/213pqNtr/Gemini-Generated-Image-e7j9d2e7j9d2e7j9.png'
      ]
    };
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('veda_store_settings');
      if (stored) return JSON.parse(stored);
    }
    return defaultSettings;
  });

  useEffect(() => {
    // FORCE CLEAR CACHE TO ENSURE 'OIL' IS SHOWN EVERYWHERE
    localStorage.removeItem('veda_products');
    
    const storedP = localStorage.getItem('veda_products');
    if (storedP) {
      const parsed = JSON.parse(storedP);
      if (!parsed.find((p: Product) => p.id === 'p-veda-main')) {
        setProductsState(initialProducts);
        localStorage.setItem('veda_products', JSON.stringify(initialProducts));
      } else {
        setProductsState(parsed);
      }
    }
    else { setProductsState(initialProducts); localStorage.setItem('veda_products', JSON.stringify(initialProducts)); }

    const storedO = localStorage.getItem('veda_orders');
    if (storedO) setOrdersState(JSON.parse(storedO));
    else { setOrdersState(initialOrders); localStorage.setItem('veda_orders', JSON.stringify(initialOrders)); }

    const storedR = localStorage.getItem('veda_reviews');
    if (storedR) setReviewsState(JSON.parse(storedR));
    else { setReviewsState(initialReviews); localStorage.setItem('veda_reviews', JSON.stringify(initialReviews)); }
  }, []);

  const setProducts = (p: Product[]) => { setProductsState(p); localStorage.setItem('veda_products', JSON.stringify(p)); };
  const setOrders = (o: Order[]) => { setOrdersState(o); localStorage.setItem('veda_orders', JSON.stringify(o)); };
  const setReviews = (r: Review[]) => { setReviewsState(r); localStorage.setItem('veda_reviews', JSON.stringify(r)); };
  
  // Keep backward compatibility for heroBannerUrl
  const setHeroBannerUrl = (url: string) => { 
    setHeroBannerUrlState(url); 
    localStorage.setItem('veda_banner', url); 
    setStoreSettings({...storeSettings, bannerUrl: url});
  };
  
  const setStoreSettings = (s: StoreSettings) => {
    setStoreSettingsState(s);
    localStorage.setItem('veda_store_settings', JSON.stringify(s));
    setHeroBannerUrlState(s.bannerUrl); // Keep in sync
  };

  const setRazorpayKey = (key: string) => { setRazorpayKeyState(key); localStorage.setItem('veda_rzp_key', key); };

  const addProduct = (p: Product) => setProducts([...products, p]);
  const updateProduct = (p: Product) => setProducts(products.map(prod => prod.id === p.id ? p : prod));
  const deleteProduct = (id: string) => setProducts(products.filter(prod => prod.id !== id));

  const updateOrderStatus = (orderId: string, status: 'Processing' | 'Shipped' | 'Delivered') => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };
  
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.product.id !== id));
  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{
      products, setProducts, orders, setOrders, reviews, setReviews, cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      addProduct, updateProduct, deleteProduct, updateOrderStatus, storeSettings, setStoreSettings,
      isCartOpen, setIsCartOpen, isAdmin, setIsAdmin, isAdminLoginOpen, setIsAdminLoginOpen,
      heroBannerUrl: storeSettings.bannerUrl || heroBannerUrl, setHeroBannerUrl, selectedProduct, setSelectedProduct, isCheckoutRoute, setIsCheckoutRoute, razorpayKey, setRazorpayKey
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
