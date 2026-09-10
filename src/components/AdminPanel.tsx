import React, { useState } from 'react';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city?: string;
  pincode: string;
  totalAmount: number;
  paymentMethod: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  createdAt: string;
}

interface AdminPanelProps {
  orders?: Order[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ orders = [] }) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Delivered'>('All');

  // Dummy fallback data agar orders khali hon
  const displayOrders: Order[] = orders.length > 0 ? orders : [
    {
      id: 'ORD-9821',
      customerName: 'Rahul Verma',
      phone: '9876543210',
      address: 'House No. 45, Near Hanuman Mandir, Sector 12',
      city: 'Kanpur',
      pincode: '208001',
      totalAmount: 1499,
      paymentMethod: 'Cash on Delivery (COD)',
      status: 'Pending',
      createdAt: 'Today, 2:30 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Order Management</h1>
            <p className="text-sm text-gray-500">Track and dispatch customer orders cleanly</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Orders: {displayOrders.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayOrders.map((order) => {
            // QR Code me pura address format karke bhejna taaki scanner me clean dikhe
            const qrPayload = `Customer: ${order.customerName}\nPhone: ${order.phone}\nAddress: ${order.address}, ${order.city || ''}\nPincode: ${order.pincode}\nAmount: Rs.${order.totalAmount} (${order.paymentMethod})`;
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrPayload)}`;

            return (
              <div 
                key={order.id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Order ID</span>
                    <h3 className="font-bold text-gray-900 dark:text-white">{order.id}</h3>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{order.createdAt}</p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Saaf Address Box */}
                  <div className="sm:col-span-2 space-y-2">
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs uppercase font-bold text-gray-500 tracking-wider">Delivery Address</p>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mt-1">👤 {order.customerName}</h4>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">📞 {order.phone}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed bg-white dark:bg-gray-800 p-2 rounded border border-dashed border-gray-300 dark:border-gray-600">
                        {order.address}
                      </p>
                      <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mt-2">
                        City: <span className="font-normal">{order.city || 'N/A'}</span> | Pincode: <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{order.pincode}</span>
                      </p>
                    </div>

                    {/* Payment Info */}
                    <div className="flex justify-between items-center px-1 text-sm">
                      <span className="text-gray-500">Payment:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center px-1 text-sm">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-bold text-green-600">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-1 bg-white rounded shadow-sm">
                      <img 
                        src={qrImageUrl} 
                        alt="Shipping Address QR" 
                        className="w-28 h-28 object-contain" 
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 mt-2 text-center">
                      📱 Scan to Copy Address
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(`${order.customerName}\n${order.phone}\n${order.address}\n${order.city || ''} - ${order.pincode}`)}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-white rounded text-xs font-medium transition-all"
                  >
                    📋 Copy Address
                  </button>
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-all">
                    Mark as Dispatched
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};