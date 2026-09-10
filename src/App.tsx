import React from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { Storefront } from './components/Storefront';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';

const AppContent = () => {
  const { isAdmin } = useAppContext();
  
  return (
    <div className="min-h-screen bg-[#fcfaf8] text-gray-800 font-sans selection:bg-[#3d5a40] selection:text-white relative">
      {isAdmin ? <AdminPanel /> : <Storefront />}
      <AdminLoginModal />

      {/* Developer Signature */}
      <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end pointer-events-none opacity-80 mix-blend-multiply">
        <span 
          className="text-[36px] leading-none text-emerald-800 -mb-2 pr-2" 
          style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive", textShadow: "1px 1px 0 #fff" }}
        >
          mayank
        </span>
        <span 
          className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900"
          style={{ textShadow: "1px 1px 0px #bbf7d0, 2px 2px 0px #86efac" }}
        >
          Developer: MAYANK BUDDHA
        </span>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
