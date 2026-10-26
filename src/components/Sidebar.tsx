import React from 'react';
import type { User } from '../types';
import { 
  Vote, 
  Trophy, 
  ShieldCheck, 
  LogOut, 
  X
} from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  currentTab: 'voting' | 'scoreboard' | 'admin';
  onSelectTab: (tab: 'voting' | 'scoreboard' | 'admin') => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Overlay oscuro para dispositivos móviles cuando el sidebar está abierto */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Barra lateral fija en desktop y menú burger deslizable en móvil */}
      <aside
        className={`fixed top-20 sm:top-24 bottom-0 left-0 z-40 w-72 bg-[#0e071a]/98 border-r border-purple-900/60 backdrop-blur-xl flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sección Superior: Pestañas de navegación */}
        <div className="space-y-4">
          {/* Botón de cerrar solo en móvil */}
          <div className="flex items-center justify-end lg:hidden">
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-xl bg-purple-950/80 border border-purple-800/50 text-gray-400 hover:text-white"
              title="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menú de Navegación con texto en una sola línea */}
          <nav className="space-y-2 pt-1">
            {/* PESTAÑA 1: VOTACIÓN */}
            <button
              onClick={() => {
                onSelectTab('voting');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                currentTab === 'voting'
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-spooky-orange scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-purple-900/40 border border-transparent hover:border-purple-800/40'
              }`}
            >
              <div className="flex items-center gap-3 shrink-0">
                <div className={`p-2 rounded-xl shrink-0 ${currentTab === 'voting' ? 'bg-orange-700/80 text-white' : 'bg-purple-950/80 border border-purple-800/40 text-orange-400'}`}>
                  <Vote className="w-4 h-4" />
                </div>
                <span className="whitespace-nowrap">Votación</span>
              </div>
              {currentUser.hasVoted && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shrink-0">
                  Listo ✓
                </span>
              )}
            </button>

            {/* PESTAÑA 2: TABLA DE PUNTUACIÓN */}
            {(currentUser.role === 'admin' || currentUser.role === 'gh') && (
              <button
                onClick={() => {
                  onSelectTab('scoreboard');
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                  currentTab === 'scoreboard'
                    ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-spooky-purple scale-[1.02]'
                    : 'text-gray-300 hover:text-white hover:bg-purple-900/40 border border-transparent hover:border-purple-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className={`p-2 rounded-xl shrink-0 ${currentTab === 'scoreboard' ? 'bg-purple-800 text-white' : 'bg-purple-950/80 border border-purple-800/40 text-amber-300'}`}>
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span className="whitespace-nowrap font-bold">Tabla de Puntuación</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0 ml-1">
                  En Vivo
                </span>
              </button>
            )}

            {/* PESTAÑA 3: PANEL ADMIN */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  onSelectTab('admin');
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                  currentTab === 'admin'
                    ? 'bg-gradient-to-r from-red-700 to-rose-600 text-white shadow-lg shadow-red-900/50 scale-[1.02]'
                    : 'text-gray-300 hover:text-white hover:bg-purple-900/40 border border-transparent hover:border-purple-800/40'
                }`}
              >
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`p-2 rounded-xl shrink-0 ${currentTab === 'admin' ? 'bg-red-800 text-white' : 'bg-purple-950/80 border border-purple-800/40 text-rose-300'}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="whitespace-nowrap">Panel Admin</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 shrink-0">
                  Control
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Sección Inferior: Información del Usuario en vista móvil + Botón de Cerrar Sesión */}
        <div className="pt-3 border-t border-purple-900/50 space-y-3">
          
          {/* Información del usuario en vista móvil (ubicada justo arriba del botón de cerrar sesión) */}
          <div className="lg:hidden p-3 rounded-2xl bg-[#170a2c] border border-purple-800/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 flex items-center justify-center text-xl border border-purple-700/50 shrink-0 shadow-inner">
              {currentUser.avatar || '👻'}
            </div>
            <div className="text-left overflow-hidden">
              <span className="text-xs font-bold text-gray-100 truncate block">
                {currentUser.name}
              </span>
              <p className="text-[11px] text-orange-400 font-medium truncate block">
                {currentUser.groupName}
              </p>
            </div>
          </div>

          {/* Botón de Cerrar Sesión */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-purple-950/60 hover:bg-red-950/80 border border-purple-800/50 hover:border-red-700/60 text-purple-200 hover:text-white text-xs font-bold transition-all shadow-md group"
          >
            <LogOut className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
