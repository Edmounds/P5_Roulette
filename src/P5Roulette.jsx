import React, { useState, useEffect, useRef } from 'react';
import YAML from 'yaml';
import configSource from '../config.yaml?raw';
import bgmTrack from '../resource/Lyn - Wake Up, Get Up, Get Out There.flac';

const FALLBACK_NAMES = [
  "雨宫莲", "高卷杏", "坂本龙司",
  "喜多川祐介", "新岛真", "佐仓双叶",
  "奥村春", "明智吾郎"
];

const loadNamesFromConfig = () => {
  try {
    const parsed = YAML.parse(configSource);
    if (Array.isArray(parsed?.names)) {
      return parsed.names
        .map((name) => String(name).trim())
        .filter(Boolean);
    }
  } catch (error) {
    console.error('Failed to parse config.yaml:', error);
  }
  return [];
};

const DEFAULT_NAMES = (() => {
  const configNames = loadNamesFromConfig();
  return configNames.length ? configNames : FALLBACK_NAMES;
})();

const P5Roulette = () => {
  const [names, setNames] = useState(DEFAULT_NAMES);
  const [inputText, setInputText] = useState(DEFAULT_NAMES.join('\n'));
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  
  // 箭头状态控制 (idle:静止, tension:蓄力, impact:撞击)
  const [arrowState, setArrowState] = useState('idle');

  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const speedRef = useRef(0);
  const rotationRef = useRef(0);
  const hasImpactedRef = useRef(false);
  const audioRef = useRef(null);

  // 背景音乐控制，页面加载即尝试自动播放
  useEffect(() => {
    let isMounted = true;
    const audio = new Audio(bgmTrack);
    audio.loop = true;
    audio.volume = 0.7;
    audio.autoplay = true;
    audioRef.current = audio;

    const attemptAutoPlay = () => {
      audio.play()
        .then(() => {
          if (!isMounted) return;
          setIsMusicPlaying(true);
        })
        .catch(() => {
          if (!isMounted) return;
          setIsMusicPlaying(false);
        });
    };

    attemptAutoPlay();

    return () => {
      isMounted = false;
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => setIsMusicPlaying(false));
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  };

  // 监听画布绘制
  useEffect(() => {
    drawWheel();
  }, [names, rotation]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const saveSettings = () => {
    const newNames = inputText.split('\n').filter(name => name.trim() !== '');
    if (newNames.length > 0) {
      setNames(newNames);
    }
    setShowSettings(false);
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 20;
    const step = (2 * Math.PI) / names.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationRef.current);
    
    names.forEach((name, i) => {
      const startAngle = i * step;
      const endAngle = startAngle + step;
      
      // 1. 绘制扇形
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.lineTo(0, 0);
      ctx.closePath();

      // 交替颜色（仅黑/红循环）
      ctx.fillStyle = i % 2 === 0 ? '#000000' : '#E60012';

      // 2. 添加错位硬阴影 (P5风格: 黑色硬边)
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 1)'; 
      ctx.shadowBlur = 0; 
      ctx.shadowOffsetX = 8; 
      ctx.shadowOffsetY = 8; 
      ctx.fill();
      ctx.restore(); 

      // 3. 描边
      ctx.lineWidth = 3; 
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // 4. 绘制文字
      ctx.save();
      ctx.rotate(startAngle + step / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px "Arial Black", sans-serif';
      
      // 文字阴影增加层次感
      ctx.shadowColor = 'rgba(0,0,0,1)';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillText(name, radius - 20, 0);
      ctx.restore();
    });

    // 中心装饰
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#000000';
    ctx.fill();

    ctx.restore();
  };

  const animate = () => {
    if (speedRef.current > 0.002) { 
      rotationRef.current += speedRef.current;
      speedRef.current *= 0.985; 
      setRotation(rotationRef.current);

      // 箭头动画逻辑: 速度极慢时触发撞击
      // 降低阈值，使撞击时间更接近停止时间
      if (speedRef.current < 0.01 && !hasImpactedRef.current) {
         setArrowState('impact');
         hasImpactedRef.current = true;
      }

      requestRef.current = requestAnimationFrame(animate);
    } else {
      setIsSpinning(false);
      calculateWinner();
      setTimeout(() => setArrowState('idle'), 2000);
    }
  };

  const spin = () => {
    if (isSpinning) return;
    if (names.length < 2) {
      alert("请至少输入两个名字");
      return;
    }
    setShowResult(false);
    setIsSpinning(true);
    
    hasImpactedRef.current = false;
    setArrowState('tension'); 

    speedRef.current = 0.5 + Math.random() * 0.3;
    requestRef.current = requestAnimationFrame(animate);
  };

  const calculateWinner = () => {
    const totalRotation = rotationRef.current % (2 * Math.PI);
    const step = (2 * Math.PI) / names.length;
    let normalizedRotation = (2 * Math.PI - totalRotation) % (2 * Math.PI);
    if (normalizedRotation < 0) normalizedRotation += 2 * Math.PI;
    
    const winningIndex = Math.floor(normalizedRotation / step);
    setWinner(names[winningIndex]);
    
    setTimeout(() => {
        setShowResult(true);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] overflow-hidden relative font-sans select-none">
      {/* 动态背景 */}
      <div className="absolute inset-0 pointer-events-none opacity-20 p5-grid-bg"></div>
      <div className="absolute top-0 right-0 w-2/3 h-full bg-[#E60012] transform -skew-x-12 translate-x-32 z-0 shadow-2xl"></div>
      
      {/* 标题 */}
      <div className="absolute top-8 left-8 z-20">
        <h1 className="text-6xl font-black italic text-white tracking-tighter transform -rotate-3 p5-title-shadow">
          命运 <span className="text-black bg-white px-2 transform skew-x-12 inline-block">轮盘</span>
        </h1>
        <div className="h-2 w-48 bg-black mt-2 transform -skew-x-12"></div>
      </div>

      {/* 菜单按钮 */}
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
          onClick={() => setShowSettings(true)}
          className="group relative px-8 py-3 bg-black text-white font-bold text-xl transform skew-x-12 hover:bg-white hover:text-[#E60012] transition-colors duration-200 border-2 border-white"
        >
          <span className="block transform -skew-x-12 tracking-widest">编辑名单</span>
          <div className="absolute -left-2 top-0 w-2 h-full bg-[#E60012] group-hover:bg-black transition-colors"></div>
        </button>
      </div>

      {/* 主舞台 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        
        <div className="relative group">
            {/* 轮盘背后的黑色错位阴影 */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-black transform translate-x-4 translate-y-4 rotate-1 z-0 opacity-90"></div>

            {/* 轮盘主体 */}
            <div className={`
                relative w-[500px] h-[500px] rounded-full border-[8px] border-black shadow-[0_0_0_4px_#ffffff] bg-black overflow-hidden z-10
                ${arrowState === 'impact' ? 'animate-shake' : ''}
            `}>
              <canvas 
                ref={canvasRef} 
                width={500} 
                height={500}
                className="w-full h-full"
              />
            </div>

            {/* --- 动态指针系统 (SVG 箭头) --- */}
            {/* 容器位置调整：垂直居中，水平在右侧，往右移动 */}
            <div className={`
                absolute top-1/2 right-0 z-30 pointer-events-none
                transform -translate-y-1/2
                transition-transform duration-100 ease-out
                ${arrowState === 'tension' ? 'translate-x-24' : ''} 
                ${arrowState === 'impact' ? 'translate-x-2' : ''}
                ${arrowState === 'idle' ? 'translate-x-8' : ''}
            `}>
              {/* 蓄力时的颤抖容器 */}
              <div className={arrowState === 'tension' ? 'animate-vibrate' : ''}>
                  
                  {/* --- P5 风格不规则箭头 (缩小尺寸) --- */}
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
                  
                  {/* --- WEAK 特效字 --- */}
                  {/* 位于箭头右下方，不遮挡箭头头部，无背景框，纯文字剪纸风格 */}
                  {arrowState === 'impact' && (
                    <div className="absolute top-1/2 left-full transform translate-y-2 translate-x-2 z-50 animate-weak-pop">
                       {/* 文字主体 */}
                       <span className="relative block text-6xl font-black italic tracking-tighter select-none p5-weak-text">
                         WEAK
                       </span>
                       
                       {/* 额外的打击星形光效 (装饰) */}
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full mix-blend-overlay animate-ping opacity-50 pointer-events-none"></div>
                    </div>
                  )}
              </div>
            </div>
        </div>

        {/* 启动按钮 */}
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`
            mt-16 relative group
            transform rotate-2 hover:rotate-0 transition-all duration-200 active:scale-95 z-20
          `}
        >
          <div className={`
             absolute inset-0 bg-black transform skew-x-12 translate-x-2 translate-y-2
             ${isSpinning ? 'opacity-50' : 'opacity-100'}
          `}></div>
           <div className={`
             relative px-12 py-6 bg-[#E60012] border-4 border-black text-white
             clip-polygon font-black text-4xl tracking-widest
             ${isSpinning ? 'cursor-not-allowed grayscale' : 'cursor-pointer hover:bg-white hover:text-[#E60012]'}
           `}>
            {isSpinning ? '洗牌中...' : '开始处刑'}
          </div>
        </button>
      </div>

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm animate-fade-in">
          <div className="relative w-[600px] bg-white border-4 border-[#E60012] p-8 transform -rotate-1 shadow-[10px_10px_0px_#000]">
             <div className="absolute -top-4 -left-4 w-12 h-12 bg-black transform rotate-45"></div>
             <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black transform rotate-45"></div>

             <h2 className="text-4xl font-black text-black mb-6 border-b-4 border-black inline-block transform -skew-x-12">
               目标清单
             </h2>
             
             <textarea
               value={inputText}
               onChange={handleInputChange}
               className="w-full h-64 bg-[#f0f0f0] text-black font-bold text-xl p-4 border-2 border-black focus:outline-none focus:border-[#E60012] resize-none font-mono"
               placeholder="在此输入名字，每行一个..."
             />

             <div className="flex justify-end mt-6 space-x-4">
               <button 
                 onClick={() => setShowSettings(false)}
                 className="px-6 py-2 bg-gray-500 text-white font-bold text-lg transform skew-x-12 border-2 border-black hover:bg-gray-700"
               >
                 <span className="block transform -skew-x-12">取消</span>
               </button>
               <button 
                 onClick={saveSettings}
                 className="px-8 py-2 bg-[#E60012] text-white font-bold text-lg transform skew-x-12 border-2 border-black hover:bg-red-700 hover:scale-110 transition-transform"
               >
                 <span className="block transform -skew-x-12">确认更改</span>
               </button>
             </div>
          </div>
        </div>
      )}

      {/* 结果展示 */}
      {showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto" onClick={() => setShowResult(false)}>
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
      )}

    </div>
  );
};

export default P5Roulette;