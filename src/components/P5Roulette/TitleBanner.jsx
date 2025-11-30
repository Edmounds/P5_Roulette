import React from 'react';

const TitleBanner = () => (
  <div className="absolute top-8 left-8 z-20">
    <h1 className="text-6xl font-black italic text-white tracking-tighter transform -rotate-3 p5-title-shadow">
      命运 <span className="text-black bg-white px-2 transform skew-x-12 inline-block">轮盘</span>
    </h1>
    <div className="h-2 w-48 bg-black mt-2 transform -skew-x-12"></div>
  </div>
);

export default TitleBanner;
