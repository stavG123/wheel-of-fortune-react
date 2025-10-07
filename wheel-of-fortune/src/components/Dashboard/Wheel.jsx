import React, { useState } from 'react';

const WHEEL_VALUES = [
  500, 550, 600, 650, 700, 800, 900,
  500, 600, 700, 800, 900, 500, 650,
  700, 800, 900, 500, 600, 700,
  "Bankrupt", "Lose a Turn", "Free Play", "Top Value: $2500"
];

export default function WheelOfFortune() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    
    // Random spins between 5-10 full rotations plus random position
    const spins = 5 + Math.random() * 5;
    const randomDegree = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + randomDegree;
    
    setRotation(totalRotation);
    
    // Calculate which segment we landed on
    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const segmentAngle = 360 / WHEEL_VALUES.length;
      const segmentIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % WHEEL_VALUES.length;
      
      setResult(WHEEL_VALUES[segmentIndex]);
      setIsSpinning(false);
    }, 4000);
  };

  const segmentAngle = 360 / WHEEL_VALUES.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-yellow-300 mb-8 drop-shadow-lg">
        Wheel of Fortune
      </h1>
      
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg"></div>
        </div>
        
        {/* Wheel Container */}
        <div className="relative w-[500px] h-[500px]">
          {/* Wheel */}
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full transition-transform duration-[4000ms] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* Outer circle border */}
            <circle cx="200" cy="200" r="195" fill="#1a1a1a" />
            <circle cx="200" cy="200" r="190" fill="#2a2a2a" />
            
            {WHEEL_VALUES.map((value, index) => {
              const angle = (index * segmentAngle - 90) * (Math.PI / 180);
              const nextAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
              
              const x1 = 200 + 190 * Math.cos(angle);
              const y1 = 200 + 190 * Math.sin(angle);
              const x2 = 200 + 190 * Math.cos(nextAngle);
              const y2 = 200 + 190 * Math.sin(nextAngle);
              
              // Alternate colors
              const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#dc2626', '#10b981', '#059669'];
              const fill = typeof value === 'string' 
                ? (value === 'Bankrupt' ? '#1f2937' : '#3b82f6')
                : colors[index % colors.length];
              
              // Text position
              const textAngle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
              const textX = 200 + 130 * Math.cos(textAngle);
              const textY = 200 + 130 * Math.sin(textAngle);
              const textRotation = index * segmentAngle + segmentAngle / 2 + 90;
              
              return (
                <g key={index}>
                  {/* Segment */}
                  <path
                    d={`M 200 200 L ${x1} ${y1} A 190 190 0 0 1 ${x2} ${y2} Z`}
                    fill={fill}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  
                  {/* Text */}
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize={typeof value === 'string' ? '7' : '11'}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  >
                    {typeof value === 'number' ? `${value}` : value}
                  </text>
                </g>
              );
            })}
            
            {/* Center circle */}
            <circle cx="200" cy="200" r="30" fill="#fbbf24" stroke="#fff" strokeWidth="3" />
            <text
              x="200"
              y="200"
              fill="#1a1a1a"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              SPIN
            </text>
          </svg>
        </div>
      </div>
      
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="mt-8 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-bold text-xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
      </button>
      
      {result !== null && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-xl">
          <p className="text-2xl font-bold text-gray-800">
            Result: <span className="text-blue-600">
              {typeof result === 'number' ? `$${result}` : result}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}


