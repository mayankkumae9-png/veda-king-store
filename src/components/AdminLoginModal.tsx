import React, { useState } from 'react';
import { Lock, X, LogIn } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const AdminLoginModal = () => {
  const { isAdminLoginOpen, setIsAdminLoginOpen, setIsAdmin } = useAppContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isAdminLoginOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'mayank#2026') {
      setIsAdmin(true);
      setIsAdminLoginOpen(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-[#eaf3ed] rounded-lg shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-end mb-2">
          <button onClick={() => setIsAdminLoginOpen(false)} className="text-gray-400 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-[#e1ece5] rounded-full flex items-center justify-center mb-4">
            <Lock className="h-5 w-5 text-black" />
          </div>
          <h2 className="text-xl font-bold text-black uppercase tracking-widest">Admin Access</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none"
              placeholder="Enter Passcode"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold uppercase tracking-wider text-center">Invalid Passcode</p>}

          <button 
            type="submit"
            className="w-full flex justify-center items-center bg-black hover:bg-gray-800 text-white py-3 rounded-sm font-bold tracking-widest uppercase transition-colors"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};
