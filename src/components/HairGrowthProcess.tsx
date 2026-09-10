import React from 'react';

export const HairGrowthProcess = () => {
  return (
    <div className="w-full bg-transparent py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        {/* 3D Bold Heading */}
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase mb-8 tracking-[0.05em] text-[#4a154b]"
          style={{
            textShadow: '2px 2px 0px #d4af37, 4px 4px 0px rgba(0,0,0,0.1)'
          }}
        >
          Hair Growth Process
        </h2>
        
        {/* Banner Image */}
        <div className="w-full flex justify-center mt-2 relative">
           {/* Decorative elements behind the image */}
           <div className="absolute inset-0 bg-gradient-to-r from-[#4a154b]/10 to-[#d4af37]/10 transform -skew-y-2 rounded-3xl scale-105 -z-10"></div>
           <img 
            src="https://i.ibb.co/Y4sGxf8B/Gemini-Generated-Image-by762cby762cby76.png" 
            alt="Hair Growth Process" 
            className="w-full h-auto max-w-5xl object-cover sm:object-contain rounded-2xl shadow-2xl border-4 border-white"
          />
        </div>
      </div>
    </div>
  );
};
