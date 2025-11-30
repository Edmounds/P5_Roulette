import React from 'react';

const SpinButton = ({ isSpinning, onClick }) => (
  <button
    onClick={onClick}
    disabled={isSpinning}
    className={`
      mt-16 relative group
      transform rotate-2 hover:rotate-0 transition-all duration-200 active:scale-95 z-20
    `}
  >
    <div
      className={`
        absolute inset-0 bg-black transform skew-x-12 translate-x-2 translate-y-2
        ${isSpinning ? 'opacity-50' : 'opacity-100'}
      `}
    ></div>
    <div
      className={`
        relative px-12 py-6 bg-[#E60012] border-4 border-black text-white
        clip-polygon font-black text-4xl tracking-widest
        ${isSpinning ? 'cursor-not-allowed grayscale' : 'cursor-pointer hover:bg-white hover:text-[#E60012]'}
      `}
    >
      {isSpinning ? '洗牌中...' : '开始处刑'}
    </div>
  </button>
);

export default SpinButton;
