import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../AppContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity } = useAppContext();

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#eaf3ed] shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-100/60 bg-[#eaf3ed]">
          <h2 className="text-lg font-bold text-black uppercase tracking-widest flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" /> Cart
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-black transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#e1ece5]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <ShoppingBag className="h-16 w-16 mb-4 text-gray-300" />
              <p className="text-base font-bold uppercase tracking-widest text-black">Your cart is empty</p>
              <p className="text-sm mt-2">Discover our organic collection and treat your hair.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex space-x-4 bg-[#eaf3ed] p-4 rounded-lg border border-emerald-100/60 shadow-sm">
                  <img 
                    src={item.product.imageUrl || undefined} 
                    alt={item.product.name} 
                    className="w-20 h-20 object-cover rounded bg-[#e1ece5]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight uppercase tracking-wider">{item.product.name}</h3>
                      <p className="text-black font-extrabold mt-1">₹{item.product.price}</p>
                    </div>
                    <div className="flex items-center mt-3 border border-emerald-200/60 rounded w-fit">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-[#d4e3d9] text-black transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-black">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-[#d4e3d9] text-black transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-emerald-200/60 p-6 bg-[#eaf3ed]">
            <div className="flex justify-between text-base font-bold text-black mb-6 uppercase tracking-widest">
              <p>Subtotal</p>
              <p>₹{total}</p>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                onCheckout();
              }}
              className="w-full bg-black hover:bg-[#4a154b] text-white px-6 py-4 rounded-sm font-bold text-sm tracking-widest uppercase transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};
