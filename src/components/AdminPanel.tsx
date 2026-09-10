import React, { useState } from 'react';

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

export const AdminPanel: React.FC<AdminDashboardProps> = ({ orders = [] }) => {
  const [filter, setFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sample data agar backend se real orders abhi connect na hon
  const initialOrders: CustomerOrder[] = orders.length > 0 ? orders : [
    {
      id: 'VK-9842',
      transactionId: 'TXN-UPI-983271892',
      customerName: 'Aman Sharma',
      phone: '9876543210',
      altPhone: '9123456780',
      address: 'Flat No. 402, Royal Residency, Opp. City Mall, Main Bypass Road',
      landmark: 'Near Hanuman Mandir',
      city: 'Kanpur',
      state: 'Uttar Pradesh',
      pincode: '208001',
      items: [
        { name: 'Pure Roots Organic Shilajit Resin (20g)', quantity: 2, price: 999 }
      ],
      totalAmount: 1998,
      paymentMethod: 'UPI / Online',
      paymentStatus: 'Paid',
      orderStatus: 'New Order',
      createdAt: '10 Sep 2026, 04:15 PM'
    },
    {
      id: 'VK-9841',
      transactionId: 'COD-VERIFIED-492',
      customerName: 'Vikram Rajput',
      phone: '8765432109',
      address: 'Village & Post Rampur, Gali No. 3, House #14',
      landmark: 'Water Tank ke paas',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001',
      items: [
        { name: 'Veda King Ayurvedic Power Capsules (60 caps)', quantity: 1, price: 1299 }
      ],
      totalAmount: 1299,
      paymentMethod: 'COD',
      paymentStatus: 'Pending Verification',
      orderStatus: 'New Order',
      createdAt: '10 Sep 2026, 02:40 PM'
    }
  ];

  const [orderList, setOrderList] = useState<CustomerOrder[]>(initialOrders);

  // Statistics calculation
  const totalRevenue = orderList.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalOrdersCount = orderList.length;
  const newOrdersCount = orderList.filter(o => o.orderStatus === 'New Order').length;
  const deliveredCount = orderList.filter(o => o.orderStatus === 'Delivered').length;

  const handleStatusChange = (id: string, newStatus: CustomerOrder['orderStatus']) => {
    setOrderList(prev => prev.map(o => o.id === id ? { ...o, orderStatus: newStatus } : o));
  };

  const copyAddress = (order: CustomerOrder) => {
    const text = `Name: ${order.customerName}\nPhone: ${order.phone} ${order.altPhone ? `(${order.altPhone})` : ''}\nAddress: ${order.address}\nLandmark: ${order.landmark || 'N/A'}\nCity/State: ${order.city}, ${order.state}\nPin: ${order.pincode}\nAmount to Collect: Rs.${order.totalAmount} (${order.paymentMethod})`;
    navigator.clipboard.writeText(text);
    alert('✅ Address copied to clipboard!');
  };

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
            <p className="text-sm text-slate-500 mt-1">Live customer dispatches, payments, aur accurate delivery addresses</p>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Search by name, phone, PIN or Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalOrdersCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-500">New / Pending Orders</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{newOrdersCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Delivered Orders</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{deliveredCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-500">Total Sales Volume</p>
            <p className="text-3xl font-black text-blue-600 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Filter Navigation */}
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

        {/* Orders Card View */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 font-semibold">Koi order nahi mila.</p>
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
                  {/* Card Top Strip */}
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
                    </div>
                  </div>

                  {/* Main 3-Column Layout */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Column 1: FULL CLEAN ADDRESS (5 Cols) */}
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

                      {/* Exact Address Paragraph */}
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-400 uppercase font-semibold">Street / Flat / House / Gali:</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-snug break-words">
                          {order.address}
                        </p>
                        {order.landmark && (
                          <p className="text-xs font-medium text-amber-800 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded">
                            🚩 Landmark: {order.landmark}
                          </p>
                        )}
                      </div>

                      {/* City, State & Pincode Highlight */}
                      <div className="flex items-center justify-between text-xs font-bold bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-700 dark:text-slate-300">{order.city}, {order.state}</span>
                        <span className="text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-1 rounded tracking-widest font-mono">
                          PIN: {order.pincode}
                        </span>
                      </div>
                    </div>

                    {/* Column 2: PRODUCT & TRANSACTION DETAILS (4 Cols) */}
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

                      {/* Transaction and Payment Box */}
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500 font-medium">Payment Method:</span>
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

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Payment Status:</span>
                          <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}`}>
                            {order.paymentStatus}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">Total Collectable:</span>
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: COURIER LABEL QR & ACTIONS (3 Cols) */}
                    <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-center">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        📦 Delivery Slip QR
                      </span>
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                        <img 
                          src={qrUrl} 
                          alt="Courier Label QR" 
                          className="w-28 h-28 object-contain"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        Scan from mobile camera to grab delivery address directly
                      </p>

                      <button 
                        onClick={() => window.print()}
                        className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black rounded-lg hover:opacity-90 transition"
                      >
                        🖨️ Print Dispatch Label
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