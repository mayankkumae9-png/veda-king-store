import React from 'react';
import { useAppContext } from '../AppContext';

export const Hero = () => {
  const { heroBannerUrl } = useAppContext();
  
  return (
    <div className="w-full bg-transparent pt-2 px-2 sm:px-4">
      {/* REPLACE BANNER POSTER SRC HERE */}
      <img 
        id="hero-banner" 
        src={heroBannerUrl || 'https://i.ibb.co/213pqNtr/Gemini-Generated-Image-e7j9d2e7j9d2e7j9.png'} 
        alt="VEDA KING Herbal Hair Oil Sale" 
        className="w-full h-auto max-h-[520px] object-cover sm:object-contain mx-auto rounded-2xl shadow-xl" 
      />
    </div>
  );
};
