import React from 'react';

const ResultOverlay = ({ show, winner, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto" onClick={onClose}>
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-[200%] h-[50vh] bg-[#E60012] transform -rotate-12 absolute top-1/4 animate-slide-in-fast"></div>
        <div className="w-[200%] h-[20vh] bg-black transform rotate-6 absolute bottom-1/3 animate-slide-in-slow"></div>
      </div>

      <div className="relative z-10 text-center transform scale-150">
        <div className="text-3xl text-white font-bold bg-black px-4 py-1 inline-block transform -skew-x-12 mb-4 animate-bounce-custom">
          <span className="block transform skew-x-12">当选者是</span>
        </div>

        <div className="relative">
          <h1 className="text-9xl font-black text-black absolute top-2 left-2 w-full text-center select-none filter blur-sm">
            {winner}
          </h1>
          <h1 className="text-9xl font-black text-white stroke-black select-none animate-slam p5-winner-text">
            {winner}
          </h1>
        </div>

        <div className="mt-12 animate-pulse">
          <p className="text-2xl text-white bg-black px-6 py-2 inline-block transform skew-x-12 cursor-pointer border-2 border-[#E60012] hover:bg-white hover:text-red-600 transition-colors">
            <span className="block transform -skew-x-12">点击屏幕关闭</span>
          </p>
        </div>
      </div>

      <div className="absolute top-1/4 left-1/4 text-6xl text-yellow-400 animate-spin-slow">★</div>
      <div className="absolute bottom-1/4 right-1/4 text-8xl text-white animate-spin-reverse">★</div>
    </div>
  );
};

export default ResultOverlay;
