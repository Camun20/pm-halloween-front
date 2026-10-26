import React from 'react';
import type { User } from '../types';
import { 
  Menu
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onLogout?: () => void;
  onToggleSidebarMobile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onToggleSidebarMobile,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0a0512]/95 border-b border-purple-900/40">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Logo pegado completamente a la izquierda */}
          <div className="flex items-center gap-2 sm:gap-4">
            {currentUser && onToggleSidebarMobile && (
              <button
                onClick={onToggleSidebarMobile}
                className="lg:hidden p-2 rounded-2xl bg-purple-950/80 border border-purple-800/60 text-purple-300 hover:text-white hover:border-orange-500/50 transition-colors shrink-0"
                title="Abrir menú"
              >
                <Menu className="w-5 h-5 text-orange-400" />
              </button>
            )}

            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* Calabaza */}
              <div className="relative flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-800 shadow-spooky-orange shrink-0">
                <span className="text-2xl sm:text-3xl animate-bounce">🎃</span>
              </div>

              {/* Logo con etiqueta HALLOWEEN 2026 a su lado derecho */}
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src="/images/logo-halloween.png"
                  alt="Logo"
                  className="h-9 sm:h-12 lg:h-14 w-auto object-contain filter drop-shadow-[0_2px_14px_rgba(255,102,0,0.65)]"
                />
                <span className="text-[9px] sm:text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 tracking-wider shadow-sm shrink-0 whitespace-nowrap">
                  HALLOWEEN 2026
                </span>
              </div>
            </div>
          </div>

          {/* Información del Usuario Activo: OCULTO en vista móvil (se pasó al burger nav), VISIBLE en escritorio */}
          {currentUser && (
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#170a2c] border border-purple-800/60 shadow-inner">
                <div className="w-9 h-9 rounded-xl bg-purple-900/50 flex items-center justify-center text-lg sm:text-xl border border-purple-700/50 shadow-inner shrink-0">
                  {currentUser.avatar || '👻'}
                </div>
                <div className="text-left max-w-[160px] sm:max-w-[220px]">
                  <span className="text-xs font-bold text-gray-100 truncate block">
                    {currentUser.name}
                  </span>
                  <p className="text-[10px] text-orange-400 font-medium truncate block">
                    {currentUser.groupName}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
