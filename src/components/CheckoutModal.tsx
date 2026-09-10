import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Lock, ChevronLeft, CreditCard, ShoppingBag, User, MapPin } from 'lucide-react';
import { useAppContext } from '../AppContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const { cart, orders, setOrders, clearCart, razorpayKey, updateQuantity, storeSettings } = useAppContext();
  const [isSuccess, setIsSuccess] = useState<{orderId: string, estimatedDate: string, paymentId: string} | null>(null);
  const [selectedUpi, setSelectedUpi] = useState<string>('gpay');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const sliderImages = storeSettings?.checkoutSliderImages && storeSettings.checkoutSliderImages.length > 0 
    ? storeSettings.checkoutSliderImages 
    : ['https://i.ibb.co/sp7dDgpD/photo-2026-09-09-21-39-49.jpg'];

  useEffect(() => {
    if (sliderImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [sliderImages.length]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const customerDetails = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      pinCode: formData.get('pincode') as string,
    };

    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    let upiMethod = '';
    if (selectedUpi === 'gpay') upiMethod = 'google_pay';
    else if (selectedUpi === 'phonepe') upiMethod = 'phonepe';
    else if (selectedUpi === 'paytm') upiMethod = 'paytm';
    
    const options: any = {
      key: razorpayKey || 'rzp_live_TZxxLG9OOpt6BJ',
      amount: total * 100, 
      currency: "INR",
      name: "VEDA KING",
      description: "Care Herbal Hair Oil Purchase",
      image: "https://i.ibb.co/LXp3p0d1/photo-2026-09-09-11-32-37.jpg",
      handler: function (response: any) {
        const paymentAppLabel = selectedUpi === 'gpay' ? 'GPay' : selectedUpi === 'phonepe' ? 'PhonePe' : selectedUpi === 'paytm' ? 'Paytm' : 'Other UPI';
        
        const now = new Date();
        const formattedTimestamp = now.toLocaleString('en-IN', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit', hour12: true 
        });

        const newOrder = {
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          date: now.toISOString(),
          paymentTimestamp: formattedTimestamp,
          customerName: customerDetails.name,
          phone: customerDetails.phone,
          address: customerDetails.address,
          pinCode: customerDetails.pinCode,
          paymentMethod: 'UPI',
          paymentApp: paymentAppLabel,
          razorpayPaymentId: response.razorpay_payment_id,
          items: [...cart],
          totalPrice: total,
          status: 'Processing' as const
        };

        setOrders([newOrder, ...orders]);
        clearCart();
        
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        
        setIsSuccess({
          orderId: newOrder.id,
          estimatedDate: deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
          paymentId: response.razorpay_payment_id
        });
      },
      prefill: {
        name: customerDetails.name,
        contact: customerDetails.phone,
      },
      theme: {
        color: "#059669"
      }
    };
    
    if (upiMethod) {
       options.config = {
           display: {
               blocks: {
                   banks: {
                       name: 'Pay via UPI',
                       instruments: [{ method: 'upi' }]
                   }
               },
               sequence: ['block.banks'],
               preferences: { show_default_blocks: true },
           }
       };
    }

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      alert('Payment Failed! Reason: ' + response.error.description);
    });
    rzp.open();
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-[#e1ece5] z-[100] flex items-center justify-center p-4">
        <div className="bg-[#eaf3ed] rounded-2xl shadow-xl max-w-lg w-full p-10 text-center animate-in zoom-in-95 duration-500">
          <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Order Confirmed</h2>
          <p className="text-gray-500 mb-8">Thank you for your purchase. Your order <span className="font-bold text-gray-900">{isSuccess.orderId}</span> is confirmed.</p>
          
          <div className="bg-[#e1ece5] border border-emerald-100/60 p-6 rounded-xl text-left mb-8 space-y-4">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Razorpay Payment ID</p>
              <p className="text-sm font-mono text-gray-900 bg-[#eaf3ed] border border-emerald-200/60 px-3 py-1.5 rounded-md inline-block">{isSuccess.paymentId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Estimated Delivery</p>
              <p className="text-sm font-semibold text-gray-900">{isSuccess.estimatedDate}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-black text-white py-4 rounded-lg font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#eaf3ed] z-[100] flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
      
      {/* Close button (Mobile absolute, Desktop inline) */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 md:hidden p-2 bg-[#d4e3d9] rounded-full z-50 text-gray-500 hover:text-black"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Right Column: Order Summary (Shows first on mobile, right on desktop) */}
      <div className="w-full md:w-[45%] lg:w-[40%] md:order-2 bg-[#f4f7f5] border-b md:border-b-0 md:border-l border-emerald-200/60 p-6 md:p-10 lg:p-12 overflow-y-auto hidden md:block relative">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl -z-0"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-yellow-100/50 rounded-full mix-blend-multiply filter blur-3xl -z-0"></div>
        
        <div className="max-w-md mx-auto relative z-10">
          <h2 className="text-xl font-extrabold text-emerald-950 mb-6 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-3 text-emerald-600" /> Order Summary
          </h2>
          
          <div className="space-y-4 mb-8">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 relative bg-[#eaf3ed] p-4 rounded-2xl border border-emerald-100 shadow-sm">
                <div className="relative">
                  <div className="w-16 h-16 bg-[#e1ece5] rounded-xl border border-emerald-100/60 overflow-hidden flex-shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">{item.product.name}</h3>
                  <div className="flex items-center mt-3 space-x-3">
                    <div className="flex items-center border border-emerald-200/60 rounded-lg bg-[#e1ece5]">
                      <button type="button" onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="px-2.5 py-1 text-gray-500 hover:text-black transition-colors font-medium">−</button>
                      <input type="number" readOnly value={item.quantity} className="w-6 text-center text-xs font-bold bg-transparent outline-none p-0 border-none pointer-events-none" />
                      <button type="button" onClick={() => updateQuantity(item.product.id, Math.min(10, item.quantity + 1))} className="px-2.5 py-1 text-gray-500 hover:text-black transition-colors font-medium">+</button>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900 text-right">
                  <div className="text-gray-400 line-through text-xs font-normal mb-1">₹{item.product.mrp * item.quantity}</div>
                  <span className="text-emerald-700">₹{item.product.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#eaf3ed] rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold text-gray-900">₹{total}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">Discount</span>
              <span className="font-bold text-emerald-600">- ₹{cart.reduce((acc, item) => acc + (item.product.mrp - item.product.price) * item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 border-b border-emerald-100/60 pb-4">
              <span className="font-medium">Shipping</span>
              <span className="font-bold text-emerald-600 uppercase tracking-wider text-xs bg-emerald-50 px-2 py-0.5 rounded">Free</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-extrabold text-gray-900">Total</span>
              <span className="text-2xl font-black text-emerald-800">
                <span className="text-xs text-gray-500 font-bold mr-1 uppercase align-middle">INR</span>₹{total}
              </span>
            </div>
          </div>

          <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start space-x-3 shadow-sm">
             <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
             <p className="text-xs text-emerald-800/90 leading-relaxed font-semibold">
               128-bit SSL encrypted secure checkout. We strictly process prepaid orders to ensure contactless and faster priority delivery.
             </p>
          </div>
        </div>
      </div>

      {/* Left Column: Checkout Form */}
      <div className="flex-1 md:order-1 bg-[#eaf3ed] overflow-y-auto">
        <div className="max-w-xl mx-auto px-6 py-8 md:px-10 md:py-12 lg:px-16 lg:py-12 md:mr-0 lg:mr-8">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-black tracking-widest text-emerald-950 uppercase logo-3d">
              VEDA KING
            </h1>
          </div>

          <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-8 font-medium">
             <span className="hover:text-emerald-700 cursor-pointer transition-colors" onClick={onClose}>Store</span>
             <span className="text-gray-300">›</span>
             <span className="hover:text-emerald-700 cursor-pointer transition-colors" onClick={onClose}>Cart</span>
             <span className="text-gray-300">›</span>
             <span className="text-gray-900 font-bold bg-[#d4e3d9] px-2 py-1 rounded">Checkout</span>
          </nav>
          
          <div className="mb-8">
            <button onClick={onClose} className="flex items-center text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group">
              <ChevronLeft className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" /> Back to Product
            </button>
          </div>

          {/* Mobile Summary Toggle */}
          <div className="md:hidden bg-[#f4f7f5] rounded-2xl p-5 mb-8 flex justify-between items-center border border-emerald-100 shadow-sm">
            <div className="flex items-center font-extrabold text-emerald-950 text-sm">
               <ShoppingBag className="w-4 h-4 mr-2 text-emerald-600" /> Order Total
            </div>
            <span className="text-xl font-black text-emerald-800">₹{total}</span>
          </div>

          {/* Slider */}
          <div className="mb-8 rounded-2xl overflow-hidden border border-emerald-100/60 shadow-sm bg-[#d4e3d9] relative h-48 sm:h-64">
            {sliderImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`Slide ${idx}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`} 
              />
            ))}
            {sliderImages.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                {sliderImages.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-4' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Contact */}
            <section className="bg-[#eaf3ed] p-6 rounded-3xl border border-emerald-100/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center mb-5">
                 <div className="w-8 h-8 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mr-3 border border-emerald-100">
                    <User className="w-4 h-4" />
                 </div>
                 <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Contact Info</h2>
              </div>
              <div className="relative w-full">
                <input required name="phone" id="phone" type="tel" className="block px-4 pb-2.5 pt-6 w-full text-sm font-semibold text-gray-900 bg-[#f1f8f4] border border-emerald-200/60 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-[#eaf3ed] peer transition-all shadow-sm" placeholder=" " />
                <label htmlFor="phone" className="absolute text-sm font-medium text-gray-500 duration-300 transform -translate-y-3 scale-[0.85] top-4 z-10 origin-[0] left-4 peer-focus:text-emerald-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:-translate-y-3 pointer-events-none">Mobile phone number</label>
              </div>
            </section>

            {/* Shipping */}
            <section className="bg-[#eaf3ed] p-6 rounded-3xl border border-emerald-100/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center mb-5">
                 <div className="w-8 h-8 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mr-3 border border-emerald-100">
                    <MapPin className="w-4 h-4" />
                 </div>
                 <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Delivery Address</h2>
              </div>
              <div className="space-y-4">
                <div className="relative w-full">
                  <input required name="name" id="name" type="text" className="block px-4 pb-2.5 pt-6 w-full text-sm font-semibold text-gray-900 bg-[#f1f8f4] border border-emerald-200/60 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-[#eaf3ed] peer transition-all shadow-sm" placeholder=" " />
                  <label htmlFor="name" className="absolute text-sm font-medium text-gray-500 duration-300 transform -translate-y-3 scale-[0.85] top-4 z-10 origin-[0] left-4 peer-focus:text-emerald-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:-translate-y-3 pointer-events-none">Full name</label>
                </div>
                
                <div className="relative w-full">
                  <textarea required name="address" id="address" rows={3} className="block px-4 pb-2.5 pt-6 w-full text-sm font-semibold text-gray-900 bg-[#f1f8f4] border border-emerald-200/60 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-[#eaf3ed] peer transition-all shadow-sm resize-none" placeholder=" "></textarea>
                  <label htmlFor="address" className="absolute text-sm font-medium text-gray-500 duration-300 transform -translate-y-3 scale-[0.85] top-4 z-10 origin-[0] left-4 peer-focus:text-emerald-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:-translate-y-3 pointer-events-none">Address (House No, Building, Street, Area)</label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative w-full">
                    <input required name="pincode" id="pincode" type="text" className="block px-4 pb-2.5 pt-6 w-full text-sm font-semibold text-gray-900 bg-[#f1f8f4] border border-emerald-200/60 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-[#eaf3ed] peer transition-all shadow-sm" placeholder=" " />
                    <label htmlFor="pincode" className="absolute text-sm font-medium text-gray-500 duration-300 transform -translate-y-3 scale-[0.85] top-4 z-10 origin-[0] left-4 peer-focus:text-emerald-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:-translate-y-3 pointer-events-none">PIN code</label>
                  </div>
                  
                  <div className="relative w-full">
                    <input disabled type="text" defaultValue="India" className="block px-4 py-4 w-full text-sm font-bold text-gray-500 bg-[#d4e3d9] border border-emerald-200/60 rounded-xl cursor-not-allowed shadow-sm" />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-[#eaf3ed] p-6 rounded-3xl border border-emerald-100/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-5">
                 <div className="flex items-center">
                   <div className="w-8 h-8 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mr-3 border border-emerald-100">
                      <CreditCard className="w-4 h-4" />
                   </div>
                   <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Payment Method</h2>
                 </div>
              </div>
              
              <div className="border-2 border-emerald-500 rounded-2xl overflow-hidden bg-emerald-50/10 shadow-sm relative">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-widest uppercase">Safe & Secure</div>
                
                <div className="p-5 border-b border-emerald-100 bg-emerald-50/70 flex flex-col items-start justify-between">
                   <div className="flex items-center mb-1">
                      <Lock className="w-5 h-5 text-emerald-700 mr-2" />
                      <span className="font-extrabold text-emerald-950 text-base tracking-wide">All UPI Apps Supported</span>
                   </div>
                   <div className="text-[11px] text-emerald-700 font-bold pl-7 uppercase tracking-widest">
                     Instant • Zero Fees • 100% Encrypted
                   </div>
                </div>
                
                <div className="p-5 bg-[#eaf3ed]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <label className={`relative flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${selectedUpi === 'gpay' ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-sm' : 'border-emerald-200/60 hover:border-emerald-200 hover:bg-[#e1ece5]'}`}>
                        <input type="radio" name="upi_method" value="gpay" checked={selectedUpi === 'gpay'} onChange={() => setSelectedUpi('gpay')} className="hidden" />
                        <span className="text-3xl mb-2 drop-shadow-sm">📱</span>
                        <span className="text-xs font-bold text-gray-900">GPay</span>
                        {selectedUpi === 'gpay' && <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>}
                    </label>
                    <label className={`relative flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${selectedUpi === 'phonepe' ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-sm' : 'border-emerald-200/60 hover:border-emerald-200 hover:bg-[#e1ece5]'}`}>
                        <input type="radio" name="upi_method" value="phonepe" checked={selectedUpi === 'phonepe'} onChange={() => setSelectedUpi('phonepe')} className="hidden" />
                        <span className="text-3xl mb-2 drop-shadow-sm">🟣</span>
                        <span className="text-xs font-bold text-gray-900">PhonePe</span>
                        {selectedUpi === 'phonepe' && <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>}
                    </label>
                    <label className={`relative flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${selectedUpi === 'paytm' ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-sm' : 'border-emerald-200/60 hover:border-emerald-200 hover:bg-[#e1ece5]'}`}>
                        <input type="radio" name="upi_method" value="paytm" checked={selectedUpi === 'paytm'} onChange={() => setSelectedUpi('paytm')} className="hidden" />
                        <span className="text-[12px] bg-[#002970] text-[#00b9f5] font-black px-2 py-0.5 rounded mb-2 mt-1 shadow-sm">Paytm</span>
                        <span className="text-xs font-bold text-gray-900">Paytm</span>
                        {selectedUpi === 'paytm' && <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>}
                    </label>
                    <label className={`relative flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${selectedUpi === 'other' ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-sm' : 'border-emerald-200/60 hover:border-emerald-200 hover:bg-[#e1ece5]'}`}>
                        <input type="radio" name="upi_method" value="other" checked={selectedUpi === 'other'} onChange={() => setSelectedUpi('other')} className="hidden" />
                        <span className="text-3xl mb-2 drop-shadow-sm">⚡</span>
                        <span className="text-xs font-bold text-gray-900 text-center">Any UPI</span>
                        {selectedUpi === 'other' && <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>}
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              className="w-full bg-black hover:bg-emerald-950 text-white py-5 px-6 rounded-2xl font-extrabold tracking-[0.15em] text-lg shadow-2xl shadow-emerald-900/20 transition-all flex items-center justify-center group border border-gray-800"
            >
              <Lock className="w-5 h-5 mr-3 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              BUY NOW • ₹{total}
            </button>
            
          </form>
          
          <div className="mt-10 border-t border-emerald-100/60 pt-8 flex flex-col items-center space-y-5">
             <div className="flex items-center space-x-6 text-gray-400">
               <span className="text-xs font-bold hover:text-gray-700 cursor-pointer transition-colors">Shipping Policy</span>
               <span className="text-xs font-bold hover:text-gray-700 cursor-pointer transition-colors">Terms of Service</span>
             </div>
             <p className="text-[11px] font-bold text-gray-400 flex items-center uppercase tracking-widest">
               Secured by <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-3 ml-2 opacity-60 grayscale hover:grayscale-0 transition-all" />
             </p>
          </div>

        </div>
      </div>

    </div>
  );
};
