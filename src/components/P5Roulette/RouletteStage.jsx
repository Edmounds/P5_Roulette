import React from 'react';

const RouletteStage = ({ canvasRef, arrowState }) => (
  <div className="relative group">
    <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-black transform translate-x-4 translate-y-4 rotate-1 z-0 opacity-90"></div>

    <div
      className={`
        relative w-[500px] h-[500px] rounded-full border-[8px] border-black shadow-[0_0_0_4px_#ffffff] bg-black overflow-hidden z-10
        ${arrowState === 'impact' ? 'animate-shake' : ''}
      `}
    >
      <canvas ref={canvasRef} width={500} height={500} className="w-full h-full" />
    </div>

    <div
      className={`
        absolute top-1/2 right-0 z-30 pointer-events-none
        transform -translate-y-1/2
        transition-transform duration-100 ease-out
        ${arrowState === 'tension' ? 'translate-x-24' : ''}
        ${arrowState === 'impact' ? 'translate-x-2' : ''}
        ${arrowState === 'idle' ? 'translate-x-8' : ''}
      `}
    >
      <div className={arrowState === 'tension' ? 'animate-vibrate' : ''}>
        <div className="relative w-28 h-32 transform -rotate-2">
          <svg
            width="300"
            height="380"
            viewBox="0 0 300 380"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full filter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] transform -rotate-90 origin-center"
          >
            <defs>
              <polygon id="arrow-shape" points="150,20 240,120 190,120 200,350 100,350 110,120 60,120" />
            </defs>
            <use
              href="#arrow-shape"
              fill="#000000"
              stroke="#000000"
              strokeWidth="20"
              strokeLinejoin="round"
              transform="translate(-15, 15)"
            />
            <use
              href="#arrow-shape"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="15"
              strokeLinejoin="miter"
              strokeMiterlimit="10"
            />
            <use href="#arrow-shape" fill="#FF0000" />
          </svg>
        </div>

        {arrowState === 'impact' && (
          <div className="absolute top-1/2 left-full transform translate-y-2 translate-x-2 z-50 animate-weak-pop">
            <span className="relative block text-6xl font-black italic tracking-tighter select-none p5-weak-text">
              WEAK
            </span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full mix-blend-overlay animate-ping opacity-50 pointer-events-none"></div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default RouletteStage;
