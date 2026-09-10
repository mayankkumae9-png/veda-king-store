import React from 'react';
import { Leaf, Droplets, Sparkles } from 'lucide-react';

export const Ingredients = () => {
  return (
    <div className="bg-[#a3b18a]/10 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-[#344e41] sm:text-4xl">The Power of Nature</h2>
          <p className="mt-4 text-lg text-[#5c7062]">Active natural extracts proven to transform your hair health.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#eaf3ed] p-8 rounded-2xl shadow-sm text-center">
            <div className="mx-auto h-16 w-16 bg-[#a3b18a]/20 rounded-full flex items-center justify-center mb-6">
              <Leaf className="h-8 w-8 text-[#3a5a40]" />
            </div>
            <h3 className="text-xl font-bold text-[#344e41] mb-3">Bhringraj Extract</h3>
            <p className="text-gray-600">Known as the "King of Herbs" in Ayurveda, it deeply penetrates the scalp to stimulate hair follicles and prevent premature graying.</p>
          </div>
          
          <div className="bg-[#eaf3ed] p-8 rounded-2xl shadow-sm text-center">
            <div className="mx-auto h-16 w-16 bg-[#a3b18a]/20 rounded-full flex items-center justify-center mb-6">
              <Droplets className="h-8 w-8 text-[#3a5a40]" />
            </div>
            <h3 className="text-xl font-bold text-[#344e41] mb-3">Amla Oil</h3>
            <p className="text-gray-600">Rich in Vitamin C and antioxidants, Amla strengthens the roots, reduces hair fall, and adds a natural, healthy shine.</p>
          </div>
          
          <div className="bg-[#eaf3ed] p-8 rounded-2xl shadow-sm text-center">
            <div className="mx-auto h-16 w-16 bg-[#a3b18a]/20 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-[#3a5a40]" />
            </div>
            <h3 className="text-xl font-bold text-[#344e41] mb-3">Shikakai Pods</h3>
            <p className="text-gray-600">A natural cleanser that maintains the optimal pH balance of your scalp, gently washing away dirt without stripping natural oils.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
