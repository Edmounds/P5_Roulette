import React from 'react';

const MenuButtons = ({ isMusicPlaying, toggleMusic, onEdit }) => (
  <div className="absolute top-8 right-8 z-20 flex flex-col items-end space-y-4">
    <button
      onClick={toggleMusic}
      aria-label={isMusicPlaying ? '关闭背景音乐' : '播放背景音乐'}
      aria-pressed={isMusicPlaying}
      className={`
        relative w-16 h-16 rounded-full border-4 border-black text-3xl font-black
        flex items-center justify-center shadow-[6px_6px_0_#000] transition-transform duration-150
        ${isMusicPlaying ? 'bg-white text-[#E60012] rotate-6' : 'bg-black text-white -rotate-6'}
      `}
    >
      <span className="drop-shadow-[2px_2px_0_#000]">♪</span>
      <span
        className={`
          absolute -top-2 -right-2 px-1 py-0.5 text-xs font-black text-white border-2 border-black
          transform skew-x-12
          ${isMusicPlaying ? 'bg-[#E60012]' : 'bg-gray-500'}
        `}
      >
        {isMusicPlaying ? 'ON' : 'OFF'}
      </span>
      {!isMusicPlaying && (
        <span className="absolute inset-x-3 h-1 bg-[#E60012] transform rotate-45"></span>
      )}
    </button>
    <button 
      onClick={onEdit}
      className="group relative px-8 py-3 bg-black text-white font-bold text-xl transform skew-x-12 hover:bg-white hover:text-[#E60012] transition-colors duration-200 border-2 border-white"
    >
      <span className="block transform -skew-x-12 tracking-widest">编辑名单</span>
      <div className="absolute -left-2 top-0 w-2 h-full bg-[#E60012] group-hover:bg-black transition-colors"></div>
    </button>
  </div>
);

export default MenuButtons;
