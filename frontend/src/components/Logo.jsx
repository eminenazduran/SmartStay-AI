import React from 'react';

export const Logo = ({ className = 'w-8 h-8' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="bridgeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#2563eb" floodOpacity="0.15" />
        </filter>
      </defs>

      <g transform="translate(400, 430)" filter="url(#softGlow)">
        {/* Minimalist House Silhouette seamlessly merged with Istanbul Bosphorus Bridge */}
        <path
          d="M-190,75 L-190,-15 L0,-205 L190,-15 L190,75"
          fill="none"
          stroke="url(#primaryGrad)"
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Istanbul Bosphorus Bridge Arch & Water Wave Harmonic */}
        <path
          d="M-220,105 Q-75,-30 0,-30 Q75,-30 220,105"
          fill="none"
          stroke="url(#bridgeGrad)"
          strokeWidth="24"
          strokeLinecap="round"
        />

        {/* Bridge Cables / AI Telemetry Neural Nodes */}
        <line x1="-105" y1="52" x2="-105" y2="-60" stroke="#93c5fd" strokeWidth="9" strokeLinecap="round" opacity="0.8" />
        <line x1="-52" y1="15" x2="-52" y2="-110" stroke="#60a5fa" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
        <line x1="0" y1="-8" x2="0" y2="-145" stroke="url(#accentGrad)" strokeWidth="11" strokeLinecap="round" />
        <line x1="52" y1="15" x2="52" y2="-110" stroke="#60a5fa" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
        <line x1="105" y1="52" x2="105" y2="-60" stroke="#93c5fd" strokeWidth="9" strokeLinecap="round" opacity="0.8" />

        {/* AI Core Sparkling Nexus / Keystone Node at the Apex */}
        <circle cx="0" cy="-205" r="24" fill="#2563eb" stroke="#ffffff" strokeWidth="7" />
        <circle cx="0" cy="-205" r="10" fill="#38bdf8" />

        {/* Sub-nodes representing real estate data intelligence */}
        <circle cx="-190" cy="-15" r="12" fill="#0f172a" />
        <circle cx="190" cy="-15" r="12" fill="#2563eb" />
      </g>
    </svg>
  );
};

export default Logo;
