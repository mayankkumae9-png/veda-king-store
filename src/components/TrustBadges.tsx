import React from 'react';
import { ShieldCheck, Truck } from 'lucide-react';

export const TrustBadges = () => {
  return (
    <div className="w-full bg-transparent border-y border-emerald-100/60 py-8 px-4 sm:px-6 lg:px-8 mt-2">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Badge 1 */}
          <div className="flex items-center justify-center sm:justify-start space-x-4 bg-transparent p-4 rounded-2xl shadow-sm border border-emerald-50 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 border-4 border-emerald-50">
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">ONLY PREPAID AVAILABLE</h3>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">100% Safe Online UPI Payment</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center justify-center sm:justify-start space-x-4 bg-transparent p-4 rounded-2xl shadow-sm border border-emerald-50 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 border-4 border-emerald-50">
              <Truck className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">ALL INDIA HOME DELIVERY</h3>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">Fast & Direct Doorstep Shipping</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
