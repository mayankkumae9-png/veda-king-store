import React, { useState } from 'react';
import { Search, MapPin, Zap, User, ShoppingBag, Menu, X, MessageCircle, Package } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const Header = () => {
  const { cart, setIsCartOpen, storeSettings, orders } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const customerOrders = orders.filter(o => o.phone === searchPhone);

  return (
    <>
    <header className="w-full bg-[#eaf3ed] flex flex-col z-40 shadow-sm sticky top-0">
      <div className="bg-[#4a154b] text-white text-[10px] md:text-sm font-bold text-center py-2.5 tracking-[0.15em] uppercase w-full">
        {storeSettings?.announcementText || 'LIMITED TIME OFFER: GET FREE SHIPPING ON ALL PREPAID ORDERS!'}
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-4 flex-1">
          <img src="https://i.ibb.co/991jSGh7/Gemini-Generated-Image-ekfz5gekfz5gekfz.png" alt="Logo" className="h-12 w-auto object-contain" />
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-10 pr-4 py-2.5 bg-[#d4e3d9] border-transparent rounded-full text-sm focus:outline-none focus:bg-[#eaf3ed] focus:border-gray-300 border w-64 transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        <div className="md:hidden flex items-center flex-1">
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-6 w-6 text-black" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
          <span className="text-3xl md:text-4xl font-extrabold tracking-[0.1em] logo-3d px-2">
            {storeSettings?.brandName || 'VEDA KING'}
          </span>
          <span className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-gray-600 mt-2 font-semibold text-center">
            Care Herbal Hair Oil | Nature + Science
          </span>
        </div>

        <div className="hidden md:flex items-center justify-end space-x-6 flex-1 text-xs font-bold tracking-wider text-gray-800 uppercase">
          <button onClick={() => setIsMyOrdersOpen(true)} className="flex items-center hover:text-[#4a154b] transition-colors">
            <Package className="h-4 w-4 mr-1.5" /> My Orders
          </button>
          <a href="https://wa.me/917503658376" target="_blank" rel="noopener noreferrer" className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors">
            <MessageCircle className="h-4 w-4 mr-1" /> Help
          </a>
          <button onClick={() => setIsCartOpen(true)} className="flex items-center hover:text-[#4a154b] transition-colors relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#4a154b] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-5 w-5 text-black hover:text-[#4a154b]" />
          </button>
        </div>
        
        <div className="md:hidden flex items-center justify-end flex-1 space-x-4">
          <button onClick={() => setIsCartOpen(true)} className="relative">
            <ShoppingBag className="h-6 w-6 text-black" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#4a154b] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="hidden md:flex justify-center items-center space-x-10 py-3 border-t border-emerald-100/60 text-xs font-bold uppercase text-gray-700 tracking-widest bg-[#eaf3ed] shadow-sm">
        <a href="#" className="hover:text-[#4a154b] transition-colors">Ayurvedic Hair Oil</a>
        <a href="#" className="hover:text-[#4a154b] transition-colors">Hair Growth Oil</a>
        <a href="#" className="hover:text-[#4a154b] transition-colors">Anti-Dandruff Oil</a>
        <a href="#" className="hover:text-[#4a154b] transition-colors text-[#d97706]">Natural Herbs</a>
        <a href="#" className="hover:text-[#4a154b] transition-colors">Bulk Order</a>
      </div>
    </header>

    {/* Menu Drawer */}
    {isMenuOpen && (
      <>
        <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-[#eaf3ed] z-[70] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
          <div className="p-4 flex justify-between items-center border-b border-emerald-100/60 bg-[#d4e3d9]">
            <span className="font-extrabold tracking-widest uppercase">Menu</span>
            <button onClick={() => setIsMenuOpen(false)}><X className="h-6 w-6" /></button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <button onClick={() => { setIsMenuOpen(false); setIsMyOrdersOpen(true); }} className="w-full text-left px-6 py-4 flex items-center space-x-3 hover:bg-[#d4e3d9] transition-colors font-bold uppercase tracking-wider text-sm border-b border-emerald-100/60">
              <Package className="h-5 w-5" />
              <span>My Orders</span>
            </button>
            <button onClick={() => { setIsMenuOpen(false); setIsCartOpen(true); }} className="w-full text-left px-6 py-4 flex items-center space-x-3 hover:bg-[#d4e3d9] transition-colors font-bold uppercase tracking-wider text-sm border-b border-emerald-100/60">
              <ShoppingBag className="h-5 w-5" />
              <span>Cart</span>
            </button>
            <a href="https://wa.me/917503658376" target="_blank" rel="noopener noreferrer" className="w-full text-left px-6 py-4 flex items-center space-x-3 hover:bg-[#d4e3d9] transition-colors font-bold uppercase tracking-wider text-sm border-b border-emerald-100/60 text-emerald-700">
              <MessageCircle className="h-5 w-5" />
              <span>Customer Help</span>
            </a>
          </div>
          <div className="p-4 bg-[#d4e3d9] text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Call us: +91 7503658376</p>
          </div>
        </div>
      </>
    )}

    {/* My Orders Modal */}
    {isMyOrdersOpen && (
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm">
        <div className="bg-[#eaf3ed] rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-emerald-100/60">
          <button onClick={() => setIsMyOrdersOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors">
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-extrabold uppercase tracking-widest text-center mb-2">Track Order</h2>
          <p className="text-xs text-center text-gray-500 font-semibold mb-6">Enter your phone number to see your orders</p>
          
          <input 
            type="tel"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full border border-emerald-200/60 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-bold bg-[#f1f8f4]"
          />

          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {searchPhone.length > 5 && customerOrders.length === 0 && (
              <p className="text-center text-sm font-bold text-red-500 bg-red-50 py-3 rounded-xl border border-red-100">No orders found for this number.</p>
            )}
            {customerOrders.map(order => (
              <div key={order.id} className="bg-[#f1f8f4] border border-emerald-100/60 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Order #{order.id.substring(0,6)}</span>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-sm ${order.status === 'Processing' ? 'bg-amber-100 text-amber-800' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm font-bold mt-2">₹{order.total}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
    </>
  );
};
