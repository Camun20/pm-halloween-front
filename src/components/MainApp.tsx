import React, { useState, useEffect } from 'react';
import { useVotingState } from '../store/votingStore';
import { HalloweenBackground } from './HalloweenBackground';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LoginModal } from './LoginModal';
import { VotingView } from './VotingView';
import { ScoreboardView } from './ScoreboardView';
import { AdminPanel } from './AdminPanel';

export const MainApp: React.FC = () => {
  const {
    users,
    categories,
    groups,
    currentUser,
    isLoaded,
    loginWithCredentials,
    logout,
    createUser,
    updateUserPassword,
    createCategory,
    submitVote,
    calculateTeamScores,
    calculateIndividualScores,
    clearVotesOnly,
    resetToDefault,
    refreshCloudData,
  } = useVotingState();

  const [currentTab, setCurrentTab] = useState<'voting' | 'scoreboard' | 'admin'>('voting');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Ajustar la pestaña según rol al iniciar sesión
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        setCurrentTab('admin');
      } else if (currentUser.role === 'gh') {
        setCurrentTab(currentUser.hasVoted ? 'scoreboard' : 'voting');
      } else {
        setCurrentTab('voting');
      }
    }
  }, [currentUser?.id, currentUser?.role]);

  // Si aún no ha cargado localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0512] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <span className="text-5xl animate-bounce">🎃</span>
          <p className="text-sm text-purple-300 font-semibold animate-pulse">
            Invocando las votaciones de Halloween...
          </p>
        </div>
      </div>
    );
  }

  // Lista de todos los grupos actuales
  const allGroups = Array.from(
    new Set([
      ...groups,
      ...users.map((u) => u.groupName).filter(Boolean),
    ])
  );

  return (
    <div className="min-h-screen bg-[#0a0512] text-gray-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white relative">
      {/* Fondo temático de Halloween */}
      <HalloweenBackground />

      {/* Barra superior Navbar (limpia, pegada a la izquierda y sin botón de salir) */}
      <Navbar
        currentUser={currentUser}
        onToggleSidebarMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Contenedor Principal */}
      <div className="flex-1 flex relative z-10">
        {!currentUser ? (
          // Vista de Login fija sin scroll para móviles y desktop
          <main className="flex-1 w-full overflow-hidden">
            <LoginModal onLoginWithCredentials={loginWithCredentials} />
          </main>
        ) : (
          <>
            {/* Barra Lateral Fija en la izquierda (w-72) */}
            <Sidebar
              currentUser={currentUser}
              currentTab={currentTab}
              onSelectTab={(tab) => {
                if (tab === 'admin' && currentUser.role !== 'admin') return;
                if (tab === 'scoreboard' && currentUser.role !== 'admin' && currentUser.role !== 'gh') return;
                if (tab === 'scoreboard') {
                  refreshCloudData();
                }
                setCurrentTab(tab);
              }}
              onLogout={logout}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />

            {/* Contenido Principal con margen a la izquierda en desktop (lg:ml-72) */}
            <main className="flex-1 lg:ml-72 min-w-0 p-4 sm:p-6 lg:p-8">
              {/* PESTAÑA: VOTACIÓN */}
              {currentTab === 'voting' && (
                <VotingView
                  currentUser={currentUser}
                  categories={categories}
                  onSubmitVote={submitVote}
                  onGoToScoreboard={
                    currentUser.role === 'gh' || currentUser.role === 'admin'
                      ? () => setCurrentTab('scoreboard')
                      : undefined
                  }
                />
              )}

              {/* PESTAÑA: TABLA DE PUNTUACIÓN (Solo GH y Admin) */}
              {currentTab === 'scoreboard' && (currentUser.role === 'admin' || currentUser.role === 'gh') && (
                <ScoreboardView
                  teamScores={calculateTeamScores()}
                  individualScores={calculateIndividualScores()}
                  categories={categories}
                  users={users}
                  currentUser={currentUser}
                />
              )}

              {/* PESTAÑA: PANEL DE ADMINISTRADOR (Solo Admin) */}
              {currentTab === 'admin' && currentUser.role === 'admin' && (
                <AdminPanel
                  users={users}
                  categories={categories}
                  availableGroups={allGroups}
                  onCreateUser={createUser}
                  onUpdateUserPassword={updateUserPassword}
                  onCreateCategory={createCategory}
                  onGoToScoreboard={() => setCurrentTab('scoreboard')}
                  onClearVotesOnly={clearVotesOnly}
                  onResetToDefault={resetToDefault}
                />
              )}
            </main>
          </>
        )}
      </div>

      {/* Footer oficial solo para usuarios autenticados con margen respectivo */}
      {currentUser && (
        <footer className="relative z-10 border-t border-purple-950/60 bg-[#07030e]/95 py-4 text-center text-xs text-purple-300/60 lg:ml-72">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 Halloween Awards • Sistema Oficial de Votación</p>
            <p className="text-[11px] text-gray-500">
              🎃 Guardado en LocalStorage • Listo para migración y despliegue AWS
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};
