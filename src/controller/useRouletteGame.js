import { useState, useRef, useCallback, useEffect } from 'react';
import { pickWinner } from './rouletteController';

/**
 * 轮盘游戏逻辑 Hook
 * @param {Array<string>} names - 当前参与抽奖的名字列表
 * @param {Function} onSpinEnd - 抽奖结束时的回调函数 (可选)
 */
export const useRouletteGame = (names, onSpinEnd) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [arrowState, setArrowState] = useState('idle'); // idle, tension, impact
  const [winner, setWinner] = useState(null);

  const requestRef = useRef(null);
  const speedRef = useRef(0);
  const rotationRef = useRef(0);
  const hasImpactedRef = useRef(false);

  // 动画循环逻辑
  const animate = useCallback(() => {
    if (speedRef.current > 0.002) {
      // 物理计算
      rotationRef.current += speedRef.current;
      speedRef.current *= 0.985; // 摩擦系数
      setRotation(rotationRef.current);

      // 箭头撞击检测：速度极慢时触发
      if (speedRef.current < 0.01 && !hasImpactedRef.current) {
        setArrowState('impact');
        hasImpactedRef.current = true;
      }

      requestRef.current = requestAnimationFrame(animate);
    } else {
      // 停止逻辑
      setIsSpinning(false);
      
      // 计算获胜者
      const resolvedWinner = pickWinner(rotationRef.current, names);
      setWinner(resolvedWinner);
      
      if (onSpinEnd) {
          onSpinEnd(resolvedWinner);
      }

      // 恢复箭头状态
      setTimeout(() => setArrowState('idle'), 2000);
    }
  }, [names, onSpinEnd]);

  // 开始旋转
  const spin = useCallback(() => {
    if (isSpinning) return;
    if (!names || names.length < 2) {
      alert("请至少输入两个名字");
      return;
    }

    setWinner(null); // 重置获胜者
    setIsSpinning(true);
    hasImpactedRef.current = false;
    setArrowState('tension');

    // 随机初速度
    speedRef.current = 0.5 + Math.random() * 0.3;
    requestRef.current = requestAnimationFrame(animate);
  }, [isSpinning, names, animate]);

  // 清理动画帧
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return {
    rotation,
    arrowState,
    isSpinning,
    winner,
    spin
  };
};
