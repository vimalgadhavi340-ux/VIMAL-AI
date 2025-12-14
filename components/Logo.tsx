import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 40, animated = false }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="logo_gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="glow_filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Hexagon Frame */}
        <path
          d="M50 5 L90 27.5 V72.5 L50 95 L10 72.5 V27.5 Z"
          stroke="url(#logo_gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#logo_gradient)"
          fillOpacity="0.05"
          className={animated ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}
        />

        {/* Tech Accents on Corners */}
        <circle cx="50" cy="5" r="2" fill="#22d3ee" className={animated ? "animate-pulse" : ""} />
        <circle cx="50" cy="95" r="2" fill="#a855f7" className={animated ? "animate-pulse" : ""} />
        <circle cx="90" cy="27.5" r="2" fill="#a855f7" />
        <circle cx="10" cy="72.5" r="2" fill="#22d3ee" />

        {/* Stylized 'K' / Neural Structure */}
        <path
          d="M35 30 V70 M35 50 L65 28 M35 50 L65 72"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow_filter)"
        />
        
        {/* Connection Nodes on the K */}
        <circle cx="35" cy="30" r="3" fill="#22d3ee" />
        <circle cx="35" cy="70" r="3" fill="#a855f7" />
        <circle cx="65" cy="28" r="3" fill="#22d3ee" />
        <circle cx="65" cy="72" r="3" fill="#a855f7" />
        <circle cx="35" cy="50" r="4" fill="white" />
        
        {/* Animated Orbiting Dot */}
        {animated && (
             <circle r="3" fill="white" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: 'center' }}>
                <animateMotion 
                    dur="4s" 
                    repeatCount="indefinite"
                    path="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" 
                />
             </circle>
        )}
      </svg>
    </div>
  );
};