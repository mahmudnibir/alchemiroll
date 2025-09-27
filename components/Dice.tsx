import React from 'react';

interface DiceProps {
  value: number;
  isHeld: boolean;
  onClick: () => void;
  rolling: boolean;
}

const RuneFace: React.FC<{ value: number }> = ({ value }) => {
  const runes = [
    <path d="M12 4V20M8 8L16 16" />, // 1
    <path d="M8 4H16L8 12H16L8 20H16" />, // 2
    <path d="M12 4V20M4 12H20" />, // 3
    <path d="M6 6L18 18M6 18L18 6" />, // 4
    <path d="M12 4L4 12L12 20L20 12L12 4Z" />, // 5
    <path d="M12 4V20M8 8L16 8M8 16L16 16" />, // 6
  ];

  return (
    <svg 
      className="w-12 h-12 text-amber-300" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      viewBox="0 0 24 24"
      style={{filter: 'drop-shadow(0 0 5px #fde047) drop-shadow(0 0 10px #f59e0b)'}}
    >
      {runes[value - 1]}
    </svg>
  );
};

const Dice: React.FC<DiceProps> = ({ value, isHeld, onClick, rolling }) => {
  const baseClasses = `
    w-20 h-20 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out select-none
    bg-slate-800 border-2 border-slate-600 
    shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),_0_4px_6px_rgba(0,0,0,0.4)]
    hover:border-amber-400
  `;
  const heldClasses = isHeld 
    ? 'border-amber-400 scale-105 shadow-[0_0_15px_#fde047,_0_0_25px_#f59e0b,_inset_0_2px_4px_rgba(0,0,0,0.6)]' 
    : '';
  const rollingClass = rolling && !isHeld ? 'animate-pulse' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${heldClasses} ${rollingClass}`}
    >
      <RuneFace value={value} />
    </div>
  );
};

export default Dice;