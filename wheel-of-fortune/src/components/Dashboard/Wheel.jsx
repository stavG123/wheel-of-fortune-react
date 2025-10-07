import React, { useState, useRef, useCallback } from "react";

const WHEEL_VALUES = [
  500,
  550,
  600,
  650,
  700,
  800,
  900,
  500,
  600,
  700,
  800,
  900,
  500,
  650,
  700,
  800,
  900,
  500,
  600,
  700,
  "Bankrupt",
  "Lose a Turn",
  "Free Play",
  "2500",
];

export default function WheelOfFortune() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  // Physics variables
  const segments = WHEEL_VALUES;
  const maxSpeed = Math.PI / (segments.length * 0.1); // Maximum rotation speed (much faster - ~10x)
  const upTime = segments.length * 20; // Acceleration phase duration (ms) - very fast acceleration
  const downTime = segments.length * 200; // Deceleration phase duration (ms) - much shorter deceleration
  const timerDelay = Math.max(5, segments.length * 0.2); // ms between frames - very fast frame rate

  // Animation state
  const animationRef = useRef({
    angleDelta: 0,
    angleCurrent: 0,
    frames: 0,
    startTime: 0,
    winningSegment: null,
  });

  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Initialize animation state
    const currentRotation = rotation;
    animationRef.current = {
      angleDelta: 0,
      angleCurrent: currentRotation,
      frames: 0,
      startTime: Date.now(),
      winningSegment: null, // Set to specific segment index to force win, or null for random
    };

    onTimerTick();
  }, [isSpinning, rotation]);

  const onTimerTick = useCallback(() => {
    const anim = animationRef.current;
    const currentTime = Date.now();
    const elapsed = currentTime - anim.startTime;

    anim.frames++;

    // Determine which phase we're in
    if (elapsed < upTime) {
      // Acceleration phase
      const progress = elapsed / upTime;
      const easeProgress = Math.sin((progress * Math.PI) / 2);
      anim.angleDelta = maxSpeed * easeProgress;

      // Add some randomness to maxSpeed (optional)
      // anim.angleDelta *= (0.8 + Math.random() * 0.4);
    } else if (elapsed < upTime + downTime) {
      // Deceleration phase
      const progress = (elapsed - upTime) / downTime;
      const easeProgress = Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      anim.angleDelta = maxSpeed * easeProgress;

      // Check winning condition
      const currentSegment =
        Math.floor(
          (360 - (anim.angleCurrent % 360) + 360 / segments.length / 2) /
            (360 / segments.length)
        ) % segments.length;

      if (
        anim.winningSegment !== null &&
        currentSegment === anim.winningSegment &&
        anim.frames > segments.length
      ) {
        // Stop at winning segment
        anim.angleDelta = 0;
        finishSpin();
        return;
      }
    } else {
      // Animation complete
      anim.angleDelta = 0;
      finishSpin();
      return;
    }

    // Update rotation
    anim.angleCurrent += anim.angleDelta;
    setRotation(anim.angleCurrent);

    // Continue animation
    setTimeout(onTimerTick, timerDelay);
  }, [maxSpeed, upTime, downTime, segments.length, timerDelay]);

  const finishSpin = useCallback(() => {
    const anim = animationRef.current;

    // Calculate final result
    const normalizedRotation = anim.angleCurrent % 360;
    const segmentAngle = 360 / segments.length;
    const segmentIndex =
      Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) %
      segments.length;

    setResult(segments[segmentIndex]);
    setIsSpinning(false);
  }, [segments]);

  const segmentAngle = 360 / WHEEL_VALUES.length;

  // Calculate which segment is currently under the pointer
  const getCurrentSegment = (currentRotation) => {
    const normalizedRotation = currentRotation % 360;
    return (
      Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) %
      WHEEL_VALUES.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-yellow-300 mb-8 drop-shadow-lg"></h1>

      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg"></div>
        </div>

        {/* Red Arrow Indicator - Shows where wheel will stop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-30">
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg"></div>
          <div className="text-red-600 text-xs font-bold text-center mt-1"></div>
        </div>

        {/* Wheel Container */}
        <div className="relative w-[500px] h-[500px]">
          {/* Wheel */}
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* Outer circle border */}
            <circle cx="200" cy="200" r="195" fill="#1a1a1a" />
            <circle cx="200" cy="200" r="190" fill="#2a2a2a" />

            {WHEEL_VALUES.map((value, index) => {
              const angle = (index * segmentAngle - 90) * (Math.PI / 180);
              const nextAngle =
                ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

              const x1 = 200 + 190 * Math.cos(angle);
              const y1 = 200 + 190 * Math.sin(angle);
              const x2 = 200 + 190 * Math.cos(nextAngle);
              const y2 = 200 + 190 * Math.sin(nextAngle);

              // Check if this is the current segment under the pointer
              const currentSegment = getCurrentSegment(rotation);
              const isCurrentSegment = index === currentSegment;

              // Alternate colors with highlight for current segment
              const colors = [
                "#fbbf24",
                "#f59e0b",
                "#ef4444",
                "#dc2626",
                "#10b981",
                "#059669",
              ];
              let fill =
                typeof value === "string"
                  ? value === "Bankrupt"
                    ? "#1f2937"
                    : "#3b82f6"
                  : colors[index % colors.length];

              // Highlight current segment with brighter color
              if (isCurrentSegment) {
                fill =
                  typeof value === "string"
                    ? value === "Bankrupt"
                      ? "#374151"
                      : "#60a5fa"
                    : "#fcd34d"; // Bright yellow for current segment
              }

              // Text position
              const textAngle =
                (index * segmentAngle + segmentAngle / 2 - 90) *
                (Math.PI / 180);
              const textX = 200 + 130 * Math.cos(textAngle);
              const textY = 200 + 130 * Math.sin(textAngle);
              const textRotation = index * segmentAngle + segmentAngle / 2 + 90;

              return (
                <g key={index}>
                  {/* Segment */}
                  <path
                    d={`M 200 200 L ${x1} ${y1} A 190 190 0 0 1 ${x2} ${y2} Z`}
                    fill={fill}
                    stroke={isCurrentSegment ? "#ff0000" : "#fff"}
                    strokeWidth={isCurrentSegment ? "4" : "2"}
                    filter={
                      isCurrentSegment ? "drop-shadow(0 0 8px #ff0000)" : "none"
                    }
                  />

                  {/* Text */}
                  <text
                    x={textX}
                    y={textY}
                    fill={isCurrentSegment ? "#ff0000" : "white"}
                    fontSize={typeof value === "string" ? "7" : "11"}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    filter={
                      isCurrentSegment ? "drop-shadow(0 0 4px #ff0000)" : "none"
                    }
                  >
                    {typeof value === "number" ? `${value}` : value}
                  </text>
                </g>
              );
            })}

            {/* Center circle */}
            <circle
              cx="200"
              cy="200"
              r="30"
              fill="#fbbf24"
              stroke="#fff"
              strokeWidth="3"
            />
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
        className="mt-8 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-500 
        disabled:cursor-not-allowed text-black font-bold text-xl rounded-full shadow-lg 
        transform hover:scale-105 transition-all duration-200" 
        style={{marginBottom: '0px'}}
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel!" }
      </button>

        {result !== null && (
  <div className="mt-1 p-6 bg-white rounded-lg shadow-xl">
     <p className="font-bold text-gray-800" style={{fontSize: '20px', margin: '0px',color: '#FFFFFF'}}>
      Result:
    </p>
    <div className="bg-gray-900 p-5 rounded-lg">
      <span 
        className="block font-black" 
        style={{
          color: '#FFFFFF',
          fontSize: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          lineHeight: '1'
        }}
      >
        {typeof result === 'number' ? `$${result}` : result}
      </span>
    </div>
  </div>
)}
    </div>
  );
}
