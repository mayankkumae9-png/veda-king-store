import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Lock, CreditCard, ShoppingBag, User, MapPin } from 'lucide-react';
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
  const { cart, orders, setOrders, clearCart, razorpayKey } = useAppContext();
  const [isSuccess, setIsSuccess] = useState<{orderId: string, estimatedDate: string, paymentId: string} | null>(null);
  const [selectedUpi, setSelectedUpi] = useState<string>('gpay');
  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const customerDetails = {
      name: (formData.get('name') as string)?.trim() || '',
      phone: (formData.get('phone') as string)?.trim() || '',
      address: (formData.get('address') as string)?.trim() || '',
      pincode: (formData.get('pincode') as string)?.trim() || '',
    };

    if (!window.Razorpay) {
      alert("Razorpay payment gateway load nahi ho paya. Kripya internet check karein!");
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
      description: "Organic Herbal Purchase",
      image: "https://i.ibb.co/LXp3p0d1/photo-2026-09-09-11-32-37.jpg",
      handler: async function (response: any) {
        const paymentAppLabel = selectedUpi === 'gpay' ? 'GPay' : selectedUpi === 'phonepe' ? 'PhonePe' : selectedUpi === 'paytm' ? 'Paytm' : 'UPI';
        
        const now = new Date();
        const formattedTimestamp = now.toLocaleString('en-IN', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit', hour12: true 
        });

        const orderId = `VK-${Math.floor(1000 + Math.random() * 9000)}`;
        const productsSummary = cart.map(item => `${item.product.name} (Qty: ${item.quantity}) - ₹${item.product.price * item.quantity}`).join(', ');

        // --- WEB3FORMS DIRECT FORMDATA SUBMISSION ---
        try {
          const web3FormData = new FormData();
          web3FormData.append("access_key", "002550e8-0a94-453a-82a2-b56bf7c08a38");
          web3FormData.append("subject", `🚨 NAYA ORDER: ${orderId} (₹${total}) - ${customerDetails.name}`);
          web3FormData.append("from_name", "Veda King Store");
          web3FormData.append("Order ID", orderId);
          web3FormData.append("Customer Name", customerDetails.name);
          web3FormData.append("Phone Number", customerDetails.phone);
          web3FormData.append("Delivery Address", customerDetails.address);
          web3FormData.append("Pincode", customerDetails.pincode);
          web3FormData.append("Total Amount", `₹${total}`);
          web3FormData.append("Payment Mode", `UPI (${paymentAppLabel})`);
          web3FormData.append("Payment ID", response.razorpay_payment_id || 'N/A');
          web3FormData.append("Products Ordered", productsSummary);
          web3FormData.append("Date & Time", formattedTimestamp);

          // Web3Forms direct POST
          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: web3FormData
          });
        } catch (mailError) {
          console.error("Mail send error:", mailError);
        }

        // --- LOCAL STORAGE & REACT STATE UPDATE ---
        const newOrder: any = {
          id: orderId,
          transactionId: response.razorpay_payment_id || `TXN-${Date.now().toString().slice(-6)}`,
          customerName: customerDetails.name,
          phone: customerDetails.phone,
          address: customerDetails.address,
          city: 'India',
          state: '',
          pincode: customerDetails.pincode,
          items: cart.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price
          })),
          totalAmount: total,
          paymentMethod: `UPI (${paymentAppLabel})`,
          paymentStatus: 'Paid',
          orderStatus: 'New Order',
          createdAt: formattedTimestamp
        };

        const existingStoredOrders = JSON.parse(localStorage.getItem('veda_king_orders') || '[]');
        localStorage.setItem('veda_king_orders', JSON.stringify([newOrder, ...existingStoredOrders]));

        if (typeof setOrders === 'function') {
          (setOrders as any)([newOrder, ...(orders || [])]);
        }
        
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
      <div className="fixed inset-0 bg-slate-950/95 z-[100] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle className="h-11 w-11 text-emerald-600" />
          </div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-600">
            Payment successful
          </p>
          <h2 className="text-3xl font-black tracking-tight text-slate-950">Order Confirmed</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Thank you for your purchase. Your order
            <span className="mx-1 font-bold text-slate-900">{isSuccess.orderId}</span>
            has been confirmed.
          </p>

          <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-left">
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment ID</p>
              <p className="mt-1 break-all font-mono text-xs font-bold text-slate-800">{isSuccess.paymentId}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimated Delivery</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{isSuccess.estimatedDate}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-2xl bg-slate-950 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-emerald-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const discount = cart.reduce(
    (acc, item) => acc + (item.product.mrp - item.product.price) * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#f6f8f7]">
      <div className="min-h-screen px-3 py-3 sm:px-6 sm:py-6">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_25px_80px_-30px_rgba(15,23,42,0.35)]">

          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Premium checkout</p>
              <h1 className="mt-1 text-xl font-black tracking-[0.18em] text-slate-950 sm:text-2xl">VEDA KING</h1>
            </div>
            <button
              onClick={onClose}
              aria-label="Close checkout"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-950 hover:text-slate-950"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <main className="mx-auto max-w-4xl px-4 py-5 sm:px-8 sm:py-8">
            <div className="relative overflow-hidden rounded-[24px] bg-slate-100 shadow-sm">
              <img
                src="https://i.ibb.co/sp7dDgpD/photo-2026-09-09-21-39-49.jpg"
                alt="VEDA KING"
                className="h-52 w-full object-cover sm:h-72"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-white sm:bottom-7 sm:left-7">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">Secure checkout</p>
                <h2 className="mt-1 text-2xl font-black sm:text-3xl">Complete your order</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-5">
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">

                  {/* Contact */}
                  <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-950">Contact details</h3>
                        <p className="text-xs text-slate-400">We'll use this for delivery updates</p>
                      </div>
                    </div>

                    <input
                      required
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="Mobile phone number"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </section>

                  {/* Address */}
                  <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-950">Delivery address</h3>
                        <p className="text-xs text-slate-400">Where should we dispatch your parcel?</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder="Full name"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      />
                      <textarea
                        required
                        name="address"
                        rows={3}
                        placeholder="House No, Street, Landmark, Area"
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          required
                          name="pincode"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="PIN code"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                        />
                        <input
                          disabled
                          type="text"
                          value="India"
                          readOnly
                          className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-500 outline-none"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Payment */}
                  <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-950">Payment</h3>
                          <p className="text-xs text-slate-400">Choose your preferred UPI app</p>
                        </div>
                      </div>
                      <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 sm:flex">
                        <Lock className="h-3 w-3" /> Secure
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { id: 'gpay', label: 'Google Pay', icon: 'G' },
                        { id: 'phonepe', label: 'PhonePe', icon: 'P' },
                        { id: 'paytm', label: 'Paytm', icon: '₹' },
                        { id: 'other', label: 'Any UPI', icon: '⚡' },
                      ].map((upi) => (
                        <label
                          key={upi.id}
                          className={`relative cursor-pointer rounded-2xl border-2 p-4 text-center transition-all ${
                            selectedUpi === upi.id
                              ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                              : 'border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="upi_method"
                            value={upi.id}
                            checked={selectedUpi === upi.id}
                            onChange={() => setSelectedUpi(upi.id)}
                            className="sr-only"
                          />
                          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-black text-slate-900 shadow-sm">
                            {upi.icon}
                          </span>
                          <span className="mt-2 block text-[11px] font-black text-slate-800">{upi.label}</span>
                          {selectedUpi === upi.id && (
                            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          )}
                        </label>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                      Payments are securely processed through Razorpay.
                    </div>
                  </section>

                  {/* Mobile Pay */}
                  <div className="lg:hidden rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-300">Total payable</span>
                      <span className="text-2xl font-black">₹{total}</span>
                    </div>
                    <button
                      type="submit"
                      className="mt-4 flex w-full items-center justify-center rounded-2xl bg-emerald-500 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-emerald-400"
                    >
                      <Lock className="mr-2 h-4 w-4" /> Pay ₹{total}
                    </button>
                  </div>
                </form>
              </div>

              {/* Order Summary Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-5 rounded-[24px] bg-slate-950 p-6 text-white shadow-xl">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-black">Order summary</h3>
                  </div>

                  <div className="mt-5 space-y-3">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-3 rounded-2xl bg-white/5 p-3">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">{item.product.name}</p>
                          <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                            <span>Qty {item.quantity}</span>
                            <span className="font-bold text-white">₹{item.product.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span><span className="font-bold text-white">₹{total}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Discount</span><span className="font-bold text-emerald-400">− ₹{discount}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Shipping</span><span className="font-bold text-emerald-400">FREE</span>
                    </div>
                    <div className="flex items-end justify-between border-t border-white/10 pt-4">
                      <span className="font-black">Total</span>
                      <span className="text-3xl font-black">₹{total}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    form="checkout-form"
                    className="mt-5 flex w-full items-center justify-center rounded-2xl bg-emerald-500 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-emerald-400"
                  >
                    <Lock className="mr-2 h-4 w-4" /> Pay securely
                  </button>

                  <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Secured by Razorpay
                  </p>
                </div>
              </aside>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-2 border-t border-slate-100 pt-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:flex-row sm:gap-6">
              <span>Secure checkout</span>
              <span>•</span>
              <span>Fast delivery</span>
              <span>•</span>
              <span>UPI supported</span>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};