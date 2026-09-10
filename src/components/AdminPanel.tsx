import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Product, StoreSettings } from '../types';
import { LayoutDashboard, ShoppingCart, Package, ArrowLeft, Image as ImageIcon, Trash2, CheckCircle, PackageSearch, Clock, Download, Settings, Edit, Plus, X } from 'lucide-react';

export const AdminPanel = () => {
  const { 
    products, addProduct, updateProduct, deleteProduct,
    orders, updateOrderStatus,
    storeSettings, setStoreSettings,
    setIsAdmin,
    razorpayKey, setRazorpayKey
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'settings'>('dashboard');

  // Settings State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(storeSettings);

  // Products State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // --- Metrics ---
  const prepaidOrders = orders?.filter(o => o.paymentMethod?.includes('Online') || o.paymentMethod?.includes('UPI')) || [];
  const totalRevenue = prepaidOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const totalOrdersCount = orders?.length || 0;
  const activeInventoryCount = products?.length || 0;

  // --- Export ---
  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Address', 'PIN Code', 'Amount', 'Payment App', 'Payment ID', 'Status', 'Items Ordered'];
    const csvContent = [
      headers.join(','),
      ...(orders || []).map(o => {
        const itemsStr = o.items.map(item => `${item.quantity}x ${item.product.name}`).join(' | ');
        return `"${o.id}","${o.paymentTimestamp || o.date}","${o.customerName}","${o.phone}","${o.address}","${o.pinCode}",${o.totalPrice},"${o.paymentApp || 'N/A'}","${o.razorpayPaymentId || 'N/A'}","${o.status}","${itemsStr}"`;
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'veda_king_orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSettings = () => {
    setStoreSettings(settingsForm);
    alert('Store settings updated successfully!');
  };

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const p: Product = {
      id: editingProduct?.id || `p-${Date.now()}`,
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      mrp: Number(formData.get('mrp')),
      category: formData.get('category') as string || 'Hair Care',
      imageUrl: formData.get('imageUrl') as string,
      rating: editingProduct?.rating || 5,
      reviews: editingProduct?.reviews || 0,
      ingredients: formData.get('ingredients') as string || '',
    };

    if (isAddingProduct) {
      addProduct(p);
      setIsAddingProduct(false);
    } else if (editingProduct) {
      updateProduct(p);
      setEditingProduct(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#e1ece5] overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-extrabold tracking-widest uppercase text-[#d4af37]">Admin Portal</h2>
          <p className="text-gray-400 text-xs mt-1 tracking-wider uppercase">Master Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'dashboard' ? 'bg-[#1a1a1a] text-white border-l-4 border-[#d4af37]' : 'text-gray-400 hover:bg-gray-900 hover:text-white border-l-4 border-transparent'}`}>
            <LayoutDashboard className="h-4 w-4 mr-3" /> Metrics
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-4 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'orders' ? 'bg-[#1a1a1a] text-white border-l-4 border-[#d4af37]' : 'text-gray-400 hover:bg-gray-900 hover:text-white border-l-4 border-transparent'}`}>
            <ShoppingCart className="h-4 w-4 mr-3" /> Orders
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center px-4 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'products' ? 'bg-[#1a1a1a] text-white border-l-4 border-[#d4af37]' : 'text-gray-400 hover:bg-gray-900 hover:text-white border-l-4 border-transparent'}`}>
            <Package className="h-4 w-4 mr-3" /> Products
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center px-4 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'settings' ? 'bg-[#1a1a1a] text-white border-l-4 border-[#d4af37]' : 'text-gray-400 hover:bg-gray-900 hover:text-white border-l-4 border-transparent'}`}>
            <Settings className="h-4 w-4 mr-3" /> Store Settings
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <button onClick={() => setIsAdmin(false)} className="w-full flex items-center px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-3" /> Back to Store
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#e1ece5] p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-extrabold text-black uppercase tracking-widest">
            {activeTab === 'dashboard' && 'Revenue & Sales Metrics'}
            {activeTab === 'orders' && 'Orders & Payments'}
            {activeTab === 'products' && 'Product Catalog'}
            {activeTab === 'settings' && 'Front-end Customizer'}
          </h1>
          {activeTab === 'orders' && (
            <button onClick={exportToCSV} className="flex items-center text-xs font-bold text-white bg-black hover:bg-[#4a154b] px-4 py-2 rounded uppercase tracking-widest transition-colors">
              <Download className="h-4 w-4 mr-2" /> Export to CSV
            </button>
          )}
          {activeTab === 'products' && !isAddingProduct && !editingProduct && (
            <button onClick={() => setIsAddingProduct(true)} className="flex items-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded uppercase tracking-widest transition-colors">
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </button>
          )}
        </div>

        {/* TAB 4: METRICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#eaf3ed] p-6 rounded-xl border border-emerald-200/60 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5 w-24 h-24 -mt-4 -mr-4 bg-emerald-500 rounded-full"></div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Revenue (Prepaid)</p>
                <h3 className="text-3xl font-extrabold text-emerald-700 mt-2">₹{totalRevenue}</h3>
              </div>
              <div className="bg-[#eaf3ed] p-6 rounded-xl border border-emerald-200/60 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5 w-24 h-24 -mt-4 -mr-4 bg-blue-500 rounded-full"></div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Orders</p>
                <h3 className="text-3xl font-extrabold text-black mt-2">{totalOrdersCount}</h3>
              </div>
              <div className="bg-[#eaf3ed] p-6 rounded-xl border border-emerald-200/60 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5 w-24 h-24 -mt-4 -mr-4 bg-purple-500 rounded-full"></div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Inventory Count</p>
                <h3 className="text-3xl font-extrabold text-black mt-2">{activeInventoryCount}</h3>
              </div>
            </div>
            
            <div className="bg-[#eaf3ed] p-8 rounded-xl border border-emerald-200/60 shadow-sm flex flex-col items-center justify-center h-64 text-center">
               <LayoutDashboard className="h-12 w-12 text-gray-200 mb-4" />
               <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Store is performing well!</p>
               <p className="text-gray-400 text-xs mt-2">More analytics modules will appear here.</p>
            </div>
          </div>
        )}

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-[#eaf3ed] rounded-xl shadow-sm border border-emerald-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-[#e1ece5] border-b border-emerald-200/60">
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Order / Date</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer Details</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Payment Info</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(orders || []).map((order) => (
                    <tr key={order?.id} className="hover:bg-[#e1ece5] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm text-black">{order?.id}</div>
                        <div className="text-[10px] font-semibold text-gray-500 mt-1 uppercase tracking-wider">{order?.paymentTimestamp || new Date(order?.date || '').toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-bold text-gray-800">{order?.customerName}</div>
                        <div className="text-xs text-gray-500 mt-1">{order?.phone}</div>
                        <div className="text-[10px] text-gray-500 mt-1 uppercase max-w-xs truncate">{order?.address}, PIN: {order?.pinCode}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-extrabold text-emerald-700">
                          ₹{order?.totalPrice} 
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded ml-1">PAID</span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-bold tracking-wider mt-1 font-mono">
                          Method: {order?.paymentApp ? `${order.paymentApp} ` : ''}{order?.paymentMethod}
                        </div>
                        <div className="text-[10px] text-gray-500 font-bold tracking-wider mt-1 font-mono">
                          RZP_ID: {order?.razorpayPaymentId || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                            ${order?.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                              order?.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {order?.status === 'Delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {order?.status === 'Shipped' && <PackageSearch className="w-3 h-3 mr-1" />}
                            {order?.status === 'Processing' && <Clock className="w-3 h-3 mr-1" />}
                            {order?.status}
                          </span>
                          <select 
                            value={order?.status} 
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as 'Processing'|'Shipped'|'Delivered')}
                            className="text-xs border border-gray-300 rounded p-1 bg-[#eaf3ed] outline-none"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!orders || orders.length === 0) && (
                    <tr><td colSpan={4} className="py-8 text-center text-gray-500">No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            {(isAddingProduct || editingProduct) ? (
              <div className="bg-[#eaf3ed] p-8 rounded-xl border border-emerald-200/60 shadow-sm max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-black uppercase tracking-widest flex items-center">
                    <Package className="h-5 w-5 mr-2 text-[#4a154b]" /> 
                    {isAddingProduct ? 'Add New Product' : 'Edit Product'}
                  </h3>
                  <button onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }} className="text-gray-400 hover:text-black">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Product Title</label>
                      <input name="name" required defaultValue={editingProduct?.name || ''} className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" placeholder="e.g. Veda King Natural Oil" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Category</label>
                      <input name="category" required defaultValue={editingProduct?.category || 'Hair Care'} className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Selling Price (₹)</label>
                      <input type="number" name="price" required defaultValue={editingProduct?.price || ''} className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">MRP (₹)</label>
                      <input type="number" name="mrp" required defaultValue={editingProduct?.mrp || ''} className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Image URL</label>
                      <input name="imageUrl" required defaultValue={editingProduct?.imageUrl || ''} className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm font-mono" placeholder="https://..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Description / Ingredients</label>
                      <textarea name="ingredients" required defaultValue={editingProduct?.ingredients || ''} rows={4} className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" placeholder="List benefits and ingredients..." />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-bold text-gray-700">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-black text-white rounded-md text-sm font-bold uppercase tracking-widest hover:bg-gray-800">
                      {isAddingProduct ? 'Create Product' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-[#eaf3ed] rounded-xl shadow-sm border border-emerald-200/60 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#e1ece5] border-b border-emerald-200/60">
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest w-20">Image</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Product Details</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Pricing</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(products || []).map((p) => (
                      <tr key={p?.id} className="hover:bg-[#e1ece5] transition-colors">
                        <td className="py-4 px-6">
                          <img src={p?.imageUrl} alt={p?.name} className="w-12 h-12 object-cover rounded-md border border-emerald-200/60" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-sm text-black">{p?.name}</div>
                          <div className="text-xs text-gray-500 mt-1">ID: {p?.id}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-sm text-emerald-700">₹{p?.price}</div>
                          <div className="text-xs text-gray-400 line-through mt-1">₹{p?.mrp}</div>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button onClick={() => setEditingProduct(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => { if(confirm('Delete product?')) deleteProduct(p.id); }} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!products || products.length === 0) && (
                      <tr><td colSpan={4} className="py-8 text-center text-gray-500">No products found in catalog.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-[#eaf3ed] p-8 rounded-xl border border-emerald-200/60 shadow-sm max-w-3xl">
              <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-[#4a154b]" /> Storefront Customizer
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Brand Name</label>
                  <input 
                    type="text" 
                    value={settingsForm?.brandName || ''} 
                    onChange={e => setSettingsForm({...settingsForm, brandName: e.target.value})} 
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a154b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Announcement Bar Text</label>
                  <input 
                    type="text" 
                    value={settingsForm?.announcementText || ''} 
                    onChange={e => setSettingsForm({...settingsForm, announcementText: e.target.value})} 
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a154b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Support Phone Number</label>
                  <input 
                    type="text" 
                    value={settingsForm?.supportPhone || ''} 
                    onChange={e => setSettingsForm({...settingsForm, supportPhone: e.target.value})} 
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a154b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span>Razorpay API Key (Key ID Only)</span>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono uppercase tracking-wider">LIVE/TEST</span>
                  </label>
                  <input 
                    type="text" 
                    value={razorpayKey || ''} 
                    onChange={e => setRazorpayKey(e.target.value)} 
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4a154b]"
                    placeholder="rzp_live_..."
                  />
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Never enter your Secret Key here. Only the Public Key ID.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Hero Banner Image URL</label>
                  <input 
                    type="text" 
                    value={settingsForm?.bannerUrl || ''} 
                    onChange={e => setSettingsForm({...settingsForm, bannerUrl: e.target.value})} 
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4a154b]"
                  />
                </div>
                
                {settingsForm?.bannerUrl && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Banner Live Preview</p>
                    <div className="rounded-xl overflow-hidden border border-emerald-200/60 shadow-sm bg-[#d4e3d9] p-2 max-w-md">
                      <img src={settingsForm.bannerUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Checkout Slider Images (Comma Separated URLs)</label>
                  <textarea 
                    value={(settingsForm?.checkoutSliderImages || []).join(',\n')} 
                    onChange={e => setSettingsForm({...settingsForm, checkoutSliderImages: e.target.value.split(',').map(url => url.trim()).filter(url => url !== '')})} 
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4a154b]"
                    placeholder="https://image1.jpg,&#10;https://image2.jpg"
                  />
                </div>

                <div className="pt-4 border-t border-emerald-100/60 flex justify-end">
                  <button onClick={handleSaveSettings} className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md text-xs font-bold uppercase tracking-widest transition-colors shadow-lg">
                    Save Store Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
