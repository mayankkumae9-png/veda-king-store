import React from 'react';
import { Lock } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const Footer = () => {
  const { setIsAdminLoginOpen } = useAppContext();

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-extrabold tracking-widest text-[#d4af37]">VEDA KING</span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
              Care Herbal Hair Oil | Nature + Science. 100% natural and organic herbal hair care. Inspired by ancient Ayurveda, crafted for modern lifestyle. Free from harsh chemicals and toxins.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">About</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ingredients</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li>
                <button 
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="flex items-center text-gray-500 hover:text-white transition-colors mt-4"
                >
                  <Lock className="h-3 w-3 mr-1" /> Admin Portal
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} VEDA KING. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
