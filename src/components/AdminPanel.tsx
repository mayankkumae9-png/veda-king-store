import React, { useState, useEffect } from 'react';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CustomerOrder {
  id: string;
  transactionId: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'COD' | 'UPI / Online';
  paymentStatus: 'Paid' | 'Pending Verification';
  orderStatus: 'New Order' | 'Packed' | 'Shipped' | 'Delivered';
  createdAt: string;
}

interface AdminDashboardProps {
  orders?: CustomerOrder[];
}

export const AdminPanel: React.FC<AdminDashboardProps> = ({ orders }) => {
  // Sirf real orders load honge (Props se ya localStorage se)
  const [orderList, setOrderList] = useState<CustomerOrder[]>(() => {
    if (orders && orders.length > 0) return orders;
    const saved = localStorage.getItem('veda_king_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // LocalStorage update sync
  useEffect(() => {
    if (orders && orders.length > 0) {
      setOrderList(orders);
    }
  }, [orders]);

  const saveOrders = (updated: CustomerOrder[]) => {
    setOrderList(updated);
    localStorage.setItem('veda_king_orders', JSON.stringify(updated));
  };

  // Order Delete Functionality
  const handleDeleteOrder = (id: string, name: string) => {
    const confirmDelete = window.confirm(`Kya aap sach me "${name}" ka order (${id}) delete karna chahte hain?`);
    if (confirmDelete) {
      const updated = orderList.filter(o => o.id !== id);
      saveOrders(updated);
    }
  };

  // Status Change
  const handleStatusChange = (id: string, newStatus: CustomerOrder['orderStatus']) => {
    const updated = orderList.map(o => o.id === id ? { ...o, orderStatus: newStatus } : o);
    saveOrders(updated);
  };

  // 1-Click Copy Full Address
  const copyAddress = (order: CustomerOrder) => {
    const text = `Name: ${order.customerName}\nPhone: ${order.phone} ${order.altPhone ? `(${order.altPhone})` : ''}\nAddress: ${order.address}\nLandmark: ${order.landmark || 'N/A'}\nCity/State: ${order.city}, ${order.state}\nPin: ${order.pincode}\nAmount: Rs.${order.totalAmount} (${order.paymentMethod})`;
    navigator.clipboard.writeText(text);
    alert('✅ Customer Address Copied!');
  };

  // Dynamic Statistics
  const totalRevenue = orderList.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalOrdersCount = orderList.length;
  const newOrdersCount = orderList.filter(o => o.orderStatus === 'New Order').length;
  const deliveredCount = orderList.filter(o => o.orderStatus === 'Delivered').length;

  const filteredOrders = orderList.filter(o => {
    const matchesFilter = filter === 'All' || o.orderStatus === filter;
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.phone.includes(searchTerm) ||
                          o.pincode.includes(searchTerm) ||
                          o.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 md:p-8 font-sans text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              👑 Veda King — Orders & Logistics Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">Real-time live customer orders aur shipping labels</p>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Search Name, Phone, PIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Live Orders</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalOrdersCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-500">Pending Orders</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{newOrdersCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Delivered Orders</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{deliveredCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-500">Total Sales Value</p>
            <p className="text-3xl font-black text-blue-600 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {['All', 'New Order', 'Packed', 'Shipped', 'Delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                filter === tab 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-5xl mb-3">📦</div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Abhi tak koi order nahi aaya hai</h3>
              <p className="text-sm text-slate-400 mt-1">Jaise hi customer website par jakar buy karega, order turant yahan show hone lagega.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const qrText = `CUSTOMER: ${order.customerName}\nPHONE: ${order.phone}\nADDRESS: ${order.address}\nLANDMARK: ${order.landmark || 'N/A'}\nPIN: ${order.pincode}, ${order.city}\nAMT: Rs.${order.totalAmount} (${order.paymentMethod})`;
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrText)}`;

              return (
                <div 
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  {/* Top Bar with Status and Delete Option */}
                  <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                        {order.id}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">🕒 {order.createdAt}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">Status:</span>
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as CustomerOrder['orderStatus'])}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none"
                      >
                        <option value="New Order">🟡 New Order</option>
                        <option value="Packed">📦 Packed</option>
                        <option value="Shipped">🚚 Shipped</option>
                        <option value="Delivered">🟢 Delivered</option>
                      </select>

                      {/* Delete Order Button */}
                      <button
                        onClick={() => handleDeleteOrder(order.id, order.customerName)}
                        className="text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 dark:border-red-900 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                        title="Delete this order"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {/* 3 Columns Layout */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Customer & Address Details */}
                    <div className="lg:col-span-5 bg-amber-50/40 dark:bg-slate-950 p-4 rounded-xl border border-amber-200/60 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                          📍 Full Shipping Address
                        </span>
                        <button 
                          onClick={() => copyAddress(order)}
                          className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2.5 py-1 rounded-md hover:bg-amber-200 transition-colors"
                        >
                          📋 Copy Full
                        </button>
                      </div>

                      <div className="space-y-1">
                        <p className="text-base font-black text-slate-900 dark:text-white">
                          👤 {order.customerName}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <a 
                            href={`tel:${order.phone}`} 
                            className="text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-1"
                          >
                            📞 {order.phone}
                          </a>
                          {order.altPhone && (
                            <span className="text-xs text-slate-500 font-mono">Alt: {order.altPhone}</span>
                          )}
                        </div>
                      </div>

                      {/* Full House/Street Address */}
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-400 uppercase font-semibold">Address / Gali / House No:</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-snug break-words">
                          {order.address}
                        </p>
                        {order.landmark && (
                          <p className="text-xs font-medium text-amber-800 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded">
                            🚩 Landmark: {order.landmark}
                          </p>
                        )}
                      </div>

                      {/* City & PIN */}
                      <div className="flex items-center justify-between text-xs font-bold bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-700 dark:text-slate-300">{order.city}, {order.state}</span>
                        <span className="text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-1 rounded tracking-widest font-mono">
                          PIN: {order.pincode}
                        </span>
                      </div>
                    </div>

                    {/* Products & Transaction Details */}
                    <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                          🛒 Ordered Products
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-1.5">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                                {item.name} <span className="text-amber-600 font-bold">× {item.quantity}</span>
                              </span>
                              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500 font-medium">Payment Mode:</span>
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${
                            order.paymentMethod === 'COD' 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                              : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                          }`}>
                            {order.paymentMethod}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Transaction ID:</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">{order.transactionId}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">Collectable Amount:</span>
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code & Slip Print */}
                    <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-center">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        📦 Delivery Slip QR
                      </span>
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                        <img 
                          src={qrUrl} 
                          alt="Shipping Address QR" 
                          className="w-28 h-28 object-contain"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        Scan karke courier person direct address dekh sakta hai
                      </p>

                      <button 
                        onClick={() => window.print()}
                        className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black rounded-lg hover:opacity-90 transition"
                      >
                        🖨️ Print Dispatch Slip
                      </button>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};