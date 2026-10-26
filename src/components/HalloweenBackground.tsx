import React from 'react';

export const HalloweenBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Resplandores oscuros y ambientales */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/25 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-purple-950/40 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-950/20 rounded-full blur-3xl" />

      {/* Murciélagos animados flotando en segundo plano */}
      <div className="absolute top-12 left-[15%] text-2xl opacity-30 animate-float" style={{ animationDuration: '6s' }}>
        🦇
      </div>
      <div className="absolute top-28 right-[20%] text-xl opacity-25 animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }}>
        🦇
      </div>
      <div className="absolute top-44 left-[45%] text-lg opacity-20 animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }}>
        🦇
      </div>
      <div className="absolute bottom-24 right-[10%] text-3xl opacity-20 animate-float" style={{ animationDuration: '9s', animationDelay: '3s' }}>
        🎃
      </div>
      <div className="absolute bottom-36 left-[8%] text-2xl opacity-20 animate-float" style={{ animationDuration: '7.5s', animationDelay: '1.5s' }}>
        👻
      </div>

      {/* Telarañas SVG en las esquinas */}
      <svg
        className="absolute top-0 left-0 w-36 h-36 opacity-25 text-purple-400"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0,0 L100,0 M0,0 L0,100 M0,0 L70,70 M0,0 L30,95 M0,0 L95,30" />
        <path d="M25,0 A25,25 0 0,1 0,25" />
        <path d="M50,0 A50,50 0 0,1 0,50" />
        <path d="M75,0 A75,75 0 0,1 0,75" />
        <path d="M100,0 A100,100 0 0,1 0,100" />
      </svg>

      <svg
        className="absolute top-0 right-0 w-36 h-36 opacity-25 text-orange-400 transform -scale-x-100"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0,0 L100,0 M0,0 L0,100 M0,0 L70,70 M0,0 L30,95 M0,0 L95,30" />
        <path d="M25,0 A25,25 0 0,1 0,25" />
        <path d="M50,0 A50,50 0 0,1 0,50" />
        <path d="M75,0 A75,75 0 0,1 0,75" />
        <path d="M100,0 A100,100 0 0,1 0,100" />
      </svg>
    </div>
  );
};
