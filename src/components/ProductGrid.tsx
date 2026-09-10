import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const ProductGrid = () => {
  const { products, addToCart, setSelectedProduct } = useAppContext();

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-emerald-700 font-extrabold tracking-[0.2em] uppercase mb-2 text-xs md:text-sm">
            ✨ Welcome to the Veda King Family ✨
          </p>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#4a154b] tracking-wider leading-tight"
            style={{ textShadow: '2px 2px 0px #d4af37, 4px 4px 0px rgba(0,0,0,0.1)' }}
          >
            Experience True Hair Magic
          </h2>
        </div>
        <div className="flex justify-center">
          {products.map((product) => {
            const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
            return (
              <div key={product.id} className="w-full max-w-sm group relative flex flex-col bg-[#eaf3ed] border border-emerald-200/60 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Discount Tag */}
                <div className="absolute top-3 left-3 bg-[#4a154b] text-white text-[10px] tracking-wider font-bold px-3 py-1.5 rounded shadow-sm z-10 uppercase pointer-events-none">
                  {product.id === 'p-veda-main' ? `Save ₹${product.mrp - product.price} (${discount}% OFF)` : `UP TO ${discount}% OFF`}
                </div>
                
                <div 
                  className="relative aspect-square overflow-hidden bg-[#e1ece5] p-4 flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img 
                    src={product.imageUrl || undefined} 
                    alt={product.name} 
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-grow text-center">
                  <div className="flex justify-center items-center mb-3 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-[#d97706] fill-[#d97706]' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-sm text-gray-500 ml-1 font-medium">({product.reviews})</span>
                  </div>
                  
                  <h3 
                    className="text-base font-bold text-gray-900 mb-2 line-clamp-2 h-12 tracking-wide uppercase cursor-pointer hover:text-[#4a154b]"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-widest mb-4 leading-relaxed">
                    {product.ingredients || 'Natural Extracts'}
                  </p>
                  
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                    <span className="text-base text-gray-400 line-through">₹{product.mrp}</span>
                  </div>
                  
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-[#eaf3ed] text-black border-2 border-black font-bold py-3 text-[10px] sm:text-xs tracking-widest uppercase hover:bg-[#e1ece5] transition-colors flex justify-center items-center rounded-lg"
                    >
                      <ShoppingCart className="h-4 w-4 sm:mr-1.5 hidden sm:block" /> Add to Cart
                    </button>
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="w-full bg-black text-white font-bold py-3 text-[10px] sm:text-xs tracking-widest uppercase hover:bg-[#4a154b] transition-colors flex justify-center items-center rounded-lg"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
