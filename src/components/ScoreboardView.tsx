import React, { useState } from 'react';
import type { User, Category, TeamScore, PersonScore } from '../types';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Users, 
  BarChart3, 
  TrendingUp,
  Skull,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  UserCheck
} from 'lucide-react';

interface ScoreboardViewProps {
  teamScores: TeamScore[];
  individualScores: Record<string, PersonScore[]>;
  categories: Category[];
  users: User[];
  currentUser: User;
}

export const ScoreboardView: React.FC<ScoreboardViewProps> = ({
  teamScores,
  individualScores,
  categories,
  users,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'individuals' | 'census'>('teams');
  const [censusSearch, setCensusSearch] = useState('');
  const [censusFilter, setCensusFilter] = useState<'all' | 'voted' | 'pending'>('all');

  const nonAdminUsers = users.filter((u) => u.role !== 'admin');
  const totalUsersCount = nonAdminUsers.length;
  const votedUsersCount = nonAdminUsers.filter((u) => u.hasVoted).length;
  const pendingUsersCount = totalUsersCount - votedUsersCount;
  const participationRate = totalUsersCount > 0 ? Math.round((votedUsersCount / totalUsersCount) * 100) : 0;

  const totalTeamVotes = teamScores.reduce((acc, t) => acc + t.totalVotes, 0);
  const maxTeamVotes = teamScores.length > 0 ? Math.max(...teamScores.map((t) => t.totalVotes), 1) : 1;

  // Podio de Equipos (Top 3)
  const topTeams = teamScores.slice(0, 3);

  // Filtrar censo de usuarios para Gestión Humana
  const filteredUsers = users.filter((u) => {
    // Si se busca por texto
    const matchesSearch =
      u.name.toLowerCase().includes(censusSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(censusSearch.toLowerCase()) ||
      u.groupName.toLowerCase().includes(censusSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (censusFilter === 'voted') return u.hasVoted;
    if (censusFilter === 'pending') return !u.hasVoted && u.role !== 'admin';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      
      {/* Header de la Tabla de Puntuación */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          Tablero Oficial de Puntuaciones
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Resultados y Monitoreo en Vivo 🎃
        </h1>
        <p className="text-purple-200/80 text-sm max-w-xl mx-auto">
          Acceso reservado para <strong className="text-purple-300">{currentUser.role === 'admin' ? 'Administrador' : 'Gestión Humana'}</strong>. Los datos se actualizan automáticamente al emitir votos.
        </p>
      </div>

      {/* Tarjetas de Métricas de Participación */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-[#160b26]/90 border border-purple-800/60 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-orange-950/80 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Participación</p>
            <p className="text-2xl font-black text-white">
              {votedUsersCount} <span className="text-xs text-gray-400 font-normal">/ {totalUsersCount} votantes</span>
            </p>
            <p className="text-[11px] text-orange-400 font-semibold">{participationRate}% del censo oficial</p>
          </div>
        </div>

        <div className="bg-[#160b26]/90 border border-purple-800/60 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Votos Emitidos</p>
            <p className="text-2xl font-black text-white">{totalTeamVotes}</p>
            <p className="text-[11px] text-purple-300 font-semibold">Puntos en categorías grupales</p>
          </div>
        </div>

        <div className="bg-[#160b26]/90 border border-purple-800/60 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Líder Provisional</p>
            <p className="text-sm font-bold text-amber-300 truncate max-w-[180px]">
              {topTeams[0]?.totalVotes > 0 ? topTeams[0].teamName : 'Por definir'}
            </p>
            <p className="text-[11px] text-gray-400 font-medium">
              {topTeams[0]?.totalVotes || 0} votos acumulados
            </p>
          </div>
        </div>

      </div>

      {/* Selector de Pestañas: Equipos vs Individuales vs Censo de Gestión Humana */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-[#160b26] border border-purple-900/60 shadow-inner flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'teams'
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-spooky-orange'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            Tabla de Equipos
          </button>
          
          <button
            onClick={() => setActiveTab('individuals')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'individuals'
                ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-spooky-purple'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Skull className="w-4 h-4 text-purple-300" />
            Categorías Individuales
          </button>

          {/* Pestaña especial para Gestión Humana y Admin */}
          <button
            onClick={() => setActiveTab('census')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'census'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-300" />
            Censo y Estado de Voto
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 border border-emerald-400/50 text-emerald-300">
              {votedUsersCount}/{totalUsersCount}
            </span>
          </button>
        </div>
      </div>

      {/* VISTA 1: TABLA DE EQUIPOS */}
      {activeTab === 'teams' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* PODIO TOP 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
            
            {/* 2º LUGAR */}
            {topTeams[1] && (
              <div className="order-2 md:order-1 bg-gradient-to-b from-[#1b0d30] to-[#120722] border border-slate-500/40 rounded-3xl p-6 text-center space-y-3 shadow-xl hover:scale-105 transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-500 flex items-center justify-center mx-auto text-2xl shadow">
                  🥈
                </div>
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-slate-700/50 text-slate-200 border border-slate-500/40">
                  2º Lugar
                </span>
                <h3 className="text-lg font-bold text-white min-h-[44px] flex items-center justify-center">
                  {topTeams[1].teamName}
                </h3>
                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-200">{topTeams[1].totalVotes}</span>
                  <span className="text-xs text-gray-400 block">votos totales</span>
                </div>
              </div>
            )}

            {/* 1º LUGAR (Destacado en el centro) */}
            {topTeams[0] && (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-[#200c3b] to-[#140626] border-2 border-yellow-500/60 rounded-3xl p-8 text-center space-y-4 shadow-spooky-orange md:-translate-y-4 hover:scale-105 transition-transform relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />
                <div className="w-16 h-16 rounded-2xl bg-yellow-950/80 border-2 border-yellow-400 flex items-center justify-center mx-auto text-3xl shadow-lg">
                  👑
                </div>
                <span className="inline-block px-4 py-1 rounded-full text-xs font-black bg-yellow-500/20 text-yellow-300 border border-yellow-400/50 uppercase tracking-wider animate-pulse">
                  ¡Gran Campeón! 1º Lugar
                </span>
                <h3 className="text-xl font-black text-white min-h-[44px] flex items-center justify-center">
                  {topTeams[0].teamName}
                </h3>
                <div className="pt-2">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                    {topTeams[0].totalVotes}
                  </span>
                  <span className="text-xs text-amber-200/80 block font-semibold">votos acumulados</span>
                </div>
              </div>
            )}

            {/* 3º LUGAR */}
            {topTeams[2] && (
              <div className="order-3 bg-gradient-to-b from-[#1b0d30] to-[#120722] border border-amber-800/40 rounded-3xl p-6 text-center space-y-3 shadow-xl hover:scale-105 transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-700 flex items-center justify-center mx-auto text-2xl shadow">
                  🥉
                </div>
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-amber-900/50 text-amber-300 border border-amber-700/40">
                  3º Lugar
                </span>
                <h3 className="text-lg font-bold text-white min-h-[44px] flex items-center justify-center">
                  {topTeams[2].teamName}
                </h3>
                <div className="pt-2">
                  <span className="text-3xl font-black text-amber-300">{topTeams[2].totalVotes}</span>
                  <span className="text-xs text-gray-400 block">votos totales</span>
                </div>
              </div>
            )}

          </div>

          {/* LISTA COMPLETA Y BARRAS DE PROGRESO */}
          <div className="bg-[#160b26]/90 border border-purple-900/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              Clasificación General y Desglose de Puntos
            </h3>

            <div className="space-y-4">
              {teamScores.map((team, idx) => {
                const percentage = maxTeamVotes > 0 ? Math.round((team.totalVotes / maxTeamVotes) * 100) : 0;
                const isLeader = idx === 0 && team.totalVotes > 0;

                return (
                  <div
                    key={team.teamName}
                    className="p-4 rounded-2xl bg-[#1d0e33]/80 border border-purple-900/60 space-y-2 hover:border-purple-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${
                          idx === 0 ? 'bg-yellow-500 text-black shadow' :
                          idx === 1 ? 'bg-slate-300 text-black' :
                          idx === 2 ? 'bg-amber-700 text-white' :
                          'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-2">
                            {team.teamName}
                            {isLeader && <span className="text-xs">👑 Líder</span>}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Equipos de Halloween Atiempo
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-orange-400">{team.totalVotes}</span>
                        <span className="text-xs text-gray-400 ml-1">pts</span>
                      </div>
                    </div>

                    {/* Barra de puntos animada */}
                    <div className="w-full h-3 bg-purple-950/80 rounded-full overflow-hidden border border-purple-900/60">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-spooky-orange'
                            : 'bg-gradient-to-r from-purple-600 to-orange-500'
                        }`}
                        style={{ width: `${Math.max(percentage, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* VISTA 2: TABLAS INDIVIDUALES (PERSONAS) */}
      {activeTab === 'individuals' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {categories
              .filter((c) => c.type === 'individual')
              .map((cat) => {
                const candidates = individualScores[cat.id] || [];
                const winner = candidates[0];

                return (
                  <div
                    key={cat.id}
                    className="bg-[#160b26]/90 border border-purple-900/60 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-start"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{cat.icon || '👑'}</span>
                        <div>
                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                            Votación Individual
                          </span>
                          <h3 className="text-base font-bold text-white leading-tight">
                            {cat.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-purple-200/70">
                        {cat.description}
                      </p>
                    </div>

                    {/* Ganador Provisional */}
                    {winner && winner.votes > 0 ? (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-purple-950/40 border border-amber-500/40 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">🥇</span>
                          <div>
                            <span className="text-[10px] font-bold text-amber-300 uppercase">Primer Lugar</span>
                            <p className="text-xs font-bold text-white truncate max-w-[200px]">
                              {winner.personName}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-amber-300 px-2 py-0.5 rounded-lg bg-amber-500/20">
                          {winner.votes} votos
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-900/50 text-center text-xs text-gray-400">
                        Aún no hay votos registrados para esta categoría
                      </div>
                    )}

                    {/* Lista de todos los candidatos de esta categoría */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-purple-300">Ranking de Candidatos:</p>
                      {candidates.length > 0 ? (
                        candidates.map((cand, i) => (
                          <div
                            key={cand.personName}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#1b0d30]/70 border border-purple-950 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 font-bold w-4">#{i + 1}</span>
                              <span className="text-gray-200 font-medium">{cand.personName}</span>
                            </div>
                            <span className="font-bold text-orange-400">{cand.votes} votos</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-purple-300/50 italic py-2">
                          No hay candidatos registrados en esta categoría
                        </p>
                      )}
                    </div>

                  </div>
                );
              })}
          </div>

        </div>
      )}

      {/* VISTA 3: CENSO Y ESTADO DE VOTO (REQUERIMIENTO GESTIÓN HUMANA) */}
      {activeTab === 'census' && (
        <div className="bg-[#160b26]/90 border border-purple-900/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/50">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Monitoreo de Gestión Humana
              </div>
              <h2 className="text-xl font-bold text-white">
                Listado de Personas y Estado del Voto
              </h2>
              <p className="text-xs text-purple-300/70">
                Consulta en tiempo real quiénes ya votaron y quiénes están pendientes por emitir su voto.
              </p>
            </div>

            {/* Contadores resumidos */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {votedUsersCount} Ya votaron
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> {pendingUsersCount} Pendientes
              </span>
            </div>
          </div>

          {/* Filtros y Buscador */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={censusSearch}
                onChange={(e) => setCensusSearch(e.target.value)}
                placeholder="Buscar por nombre, usuario o grupo..."
                className="w-full bg-[#0d0617] border border-purple-900 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCensusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  censusFilter === 'all'
                    ? 'bg-purple-700 text-white shadow'
                    : 'bg-[#0d0617] border border-purple-900/60 text-gray-400 hover:text-white'
                }`}
              >
                Todos ({users.length})
              </button>
              <button
                onClick={() => setCensusFilter('voted')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  censusFilter === 'voted'
                    ? 'bg-emerald-700 text-white shadow'
                    : 'bg-[#0d0617] border border-purple-900/60 text-gray-400 hover:text-white'
                }`}
              >
                Ya Votaron ({votedUsersCount})
              </button>
              <button
                onClick={() => setCensusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  censusFilter === 'pending'
                    ? 'bg-amber-700 text-white shadow'
                    : 'bg-[#0d0617] border border-purple-900/60 text-gray-400 hover:text-white'
                }`}
              >
                Pendientes ({pendingUsersCount})
              </button>
            </div>
          </div>

          {/* Tabla de Personas */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-900/60 text-gray-400 font-semibold uppercase">
                  <th className="py-3 px-3">Persona / Colaborador</th>
                  <th className="py-3 px-3">Usuario</th>
                  <th className="py-3 px-3">Rol</th>
                  <th className="py-3 px-3">Grupo Halloween</th>
                  <th className="py-3 px-3 text-right">Estado del Voto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/40 text-gray-300">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">
                      No se encontraron colaboradores con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-purple-950/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{u.avatar || '🎃'}</span>
                          <div>
                            <span className="font-semibold text-white block">{u.name}</span>
                            {u.gender && (
                              <span className="text-[10px] text-purple-300/70">
                                {u.gender === 'F' ? 'Colaboradora' : 'Colaborador'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-purple-300">
                        @{u.username}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'admin' ? 'bg-red-900/40 text-red-300 border border-red-700/50' :
                          u.role === 'gh' ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50' :
                          'bg-orange-950/40 text-orange-300 border border-orange-800/50'
                        }`}>
                          {u.role === 'admin' ? 'Administrador' : u.role === 'gh' ? 'Gestión Humana' : 'Votante'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-orange-300 font-medium">
                        {u.groupName}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-950/60 text-purple-300 border border-purple-700/40">
                            Supervisión
                          </span>
                        ) : u.hasVoted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Ya votó
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/60 text-amber-300 border border-amber-600/40 animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-amber-400" /> Pendiente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
