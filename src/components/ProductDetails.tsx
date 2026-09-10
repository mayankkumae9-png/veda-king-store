import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingCart, CheckCircle, ShieldCheck, Leaf } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Review } from '../types';

export const ProductDetails = () => {
  const { selectedProduct, setSelectedProduct, addToCart, reviews, setReviews, setIsCartOpen, setIsCheckoutRoute } = useAppContext();
  
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [comment, setComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const productImages = selectedProduct.id === 'p-veda-main' 
    ? [
        selectedProduct.imageUrl,
        'https://i.ibb.co/TNt4f41/photo-2026-09-09-11-32-36-2.jpg',
        'https://i.ibb.co/W4Z5RcqY/photo-2026-09-09-11-32-36.jpg'
      ]
    : [selectedProduct.imageUrl];

  const productReviews = reviews.filter(r => r.productId === selectedProduct.id && !r.isHidden).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const avgRating = productReviews.length > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1) : selectedProduct.rating;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !comment) return alert('Please fill all fields');
    
    const newReview: Review = {
      id: `r_${Date.now()}`,
      productId: selectedProduct.id,
      customerName: name,
      emailOrPhone: contact,
      rating,
      comment,
      date: new Date().toISOString()
    };
    
    setReviews([newReview, ...reviews]);
    setName('');
    setContact('');
    setComment('');
    setRating(5);
  };

  const discount = Math.round(((selectedProduct.mrp - selectedProduct.price) / selectedProduct.mrp) * 100);

  return (
    <div className="bg-transparent py-8 md:py-16 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => setSelectedProduct(null)}
          className="flex items-center text-sm font-bold tracking-widest uppercase text-gray-600 hover:text-[#4a154b] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Store
        </button>

        {/* Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          
          {/* Left: Image Showcase */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#e1ece5] rounded-2xl p-8 flex items-center justify-center relative aspect-square border border-emerald-100/60 shadow-sm group">
              <div className="absolute top-4 left-4 bg-[#4a154b] text-white text-xs tracking-widest font-bold px-3 py-1.5 rounded uppercase z-10">
                Save ₹{selectedProduct.mrp - selectedProduct.price} ({discount}% OFF)
              </div>
              
              {productImages.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? productImages.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent/80 hover:bg-transparent text-black p-2 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev === productImages.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent/80 hover:bg-transparent text-black p-2 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </>
              )}

              <img 
                src={productImages[currentImageIndex] || undefined} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover mix-blend-multiply rounded-xl shadow-lg transition-transform duration-500"
              />
            </div>
            
            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === idx ? 'border-[#4a154b] shadow-md ring-2 ring-[#4a154b] ring-offset-2' : 'border-emerald-200/60 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover bg-[#e1ece5] mix-blend-multiply" alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center mb-3 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(Number(avgRating)) ? 'text-[#d97706] fill-[#d97706]' : 'text-gray-300'}`} />
              ))}
              <span className="text-sm font-semibold ml-2 text-gray-700">{avgRating}/5 ({productReviews.length} Reviews)</span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              VEDA KING 100% NATURAL Ayurvedic Herbal Hair Oil
            </h1>
            
            <div className="flex items-end space-x-4 mb-4">
              <span className="text-4xl font-extrabold text-emerald-800">₹{selectedProduct.price}</span>
              <span className="text-xl text-gray-400 line-through mb-1">₹{selectedProduct.mrp}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">100% Ayurvedic</span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Chemical-Free</span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Dermatologically Tested</span>
            </div>

            <button 
              onClick={() => {
                addToCart(selectedProduct);
                setIsCartOpen(false);
                setIsCheckoutRoute(true);
              }}
              className="w-full bg-black text-white font-bold py-4 px-8 text-sm md:text-base tracking-[0.2em] uppercase hover:bg-[#4a154b] transition-colors flex justify-center items-center rounded-lg shadow-lg mb-10"
            >
              <ShoppingCart className="h-5 w-5 mr-3" /> BUY NOW
            </button>

            {/* Ayurvedic Benefits */}
            <div className="border-t border-emerald-100/60 pt-8">
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-extrabold text-emerald-900 mb-2 leading-tight">
                  वेद किंग हेयर ऑयल 100% natural
                </h3>
                <p className="text-sm font-semibold text-emerald-700 mb-6">
                  32 जड़ी-बूटियों से तैयार विशेष आयुर्वेदिक हेयर ऑयल
                </p>
                
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-xl mr-2">🌱</span> प्रमुख लाभ:
                </h4>
                
                <ul className="space-y-3 text-sm text-gray-800 font-medium leading-relaxed mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-emerald-600 flex-shrink-0" />
                    <span>बालों की जड़ों को मजबूत बनाने में सहायक</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-emerald-600 flex-shrink-0" />
                    <span>बालों का झड़ना और टूटना कम करने में मददगार</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-emerald-600 flex-shrink-0" />
                    <span>नए बालों के विकास में सहायक</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-emerald-600 flex-shrink-0" />
                    <span>बालों को घना, मुलायम और चमकदार बनाने में मदद करता है</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-emerald-600 flex-shrink-0" />
                    <span>रूसी, खुजली और डैंड्रफ से राहत देने में सहायक</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-emerald-600 flex-shrink-0" />
                    <span>कमजोर, पतले और रूखे बालों के लिए उपयोगी</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-emerald-600 flex-shrink-0" />
                    <span>पुरुषों एवं महिलाओं, सभी प्रकार के बालों के लिए उपयुक्त</span>
                  </li>
                </ul>

                <div className="bg-transparent p-4 rounded-xl border border-emerald-100">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">उपयोग की विधिः</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    कम से कम 1-2 घंटे या रातभर लगा रहने दें। इसके बाद हल्के शैम्पू से बाल धो लें।
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-emerald-100/60 pt-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-10 uppercase tracking-widest text-center">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Review Form */}
            <div className="lg:col-span-1 bg-[#e1ece5] p-6 rounded-xl border border-emerald-200/60 h-fit">
              <h3 className="text-lg font-bold mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Rating</label>
                  <div className="flex space-x-1 cursor-pointer">
                    {[1,2,3,4,5].map(star => (
                      <Star 
                        key={star} 
                        onClick={() => setRating(star)}
                        className={`h-6 w-6 transition-colors ${star <= rating ? 'text-[#d97706] fill-[#d97706]' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border border-gray-300 p-2.5 rounded text-sm focus:ring-[#4a154b] focus:border-[#4a154b]" placeholder="Your Name" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone / Email</label>
                  <input type="text" value={contact} onChange={e => setContact(e.target.value)} required className="w-full border border-gray-300 p-2.5 rounded text-sm focus:ring-[#4a154b] focus:border-[#4a154b]" placeholder="Contact details" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Comment</label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={4} className="w-full border border-gray-300 p-2.5 rounded text-sm focus:ring-[#4a154b] focus:border-[#4a154b] resize-none" placeholder="अपना अनुभव यहाँ लिखें..."></textarea>
                </div>
                
                <button type="submit" className="w-full bg-black text-white font-bold py-3 text-xs tracking-widest uppercase hover:bg-[#4a154b] transition-colors rounded">
                  Submit Review
                </button>
              </form>
            </div>
            
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {productReviews.length === 0 ? (
                <div className="text-center py-10 text-gray-500 italic">No reviews yet. Be the first to review!</div>
              ) : (
                productReviews.map(review => (
                  <div key={review.id} className="border-b border-emerald-100/60 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{review.customerName}</span>
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(review.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="flex space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-[#d97706] fill-[#d97706]' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
