import React, { useState } from 'react';
import type { User, Category, Role, CategoryType } from '../types';
import { 
  ShieldCheck, 
  UserPlus, 
  FolderPlus, 
  Users, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Database,
  Lock,
  Key,
  Eye,
  EyeOff,
  X
} from 'lucide-react';

interface AdminPanelProps {
  users: User[];
  categories: Category[];
  availableGroups: string[];
  onCreateUser: (newUser: Omit<User, 'id' | 'hasVoted'>) => void;
  onUpdateUserPassword: (userId: string, newPassword: string) => void;
  onCreateCategory: (newCategory: Omit<Category, 'id'>) => void;
  onGoToScoreboard: () => void;
  onClearVotesOnly: () => void;
  onResetToDefault: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  categories,
  availableGroups,
  onCreateUser,
  onUpdateUserPassword,
  onCreateCategory,
  onGoToScoreboard,
  onClearVotesOnly,
  onResetToDefault,
}) => {
  // Estado para crear Usuario
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('123');
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'M' | 'F'>('M');
  const [newRole, setNewRole] = useState<Role>('user');
  const [newGroup, setNewGroup] = useState(availableGroups[0] || 'Los Vampiros de Tecnología');
  const [customGroup, setCustomGroup] = useState('');
  const [userSuccessMessage, setUserSuccessMessage] = useState<string | null>(null);

  // Estado para cambiar contraseña de cualquier usuario
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalNewPassword, setModalNewPassword] = useState('');
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [passwordChangeNotice, setPasswordChangeNotice] = useState<string | null>(null);

  // Estado para crear Categoría
  const [catTitle, setCatTitle] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catType, setCatType] = useState<CategoryType>('group');
  const [individualCandidateSource, setIndividualCandidateSource] = useState<'all' | 'females' | 'males' | 'manual'>('all');
  const [catOptionsText, setCatOptionsText] = useState('');
  const [catSuccessMessage, setCatSuccessMessage] = useState<string | null>(null);
  const [votesResetNotice, setVotesResetNotice] = useState<string | null>(null);

  // Manejar creación de Usuario
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newName.trim()) return;

    const assignedGroup = newGroup === '__CUSTOM__' ? customGroup.trim() : newGroup;
    if (!assignedGroup) return;

    const avatars = ['🧛‍♂️', '🧟‍♂️', '🧙‍♀️', '👻', '💀', '🎃', '🐺', '🦇', '🐈‍⬛', '✨'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    onCreateUser({
      username: newUsername.trim().toLowerCase(),
      password: newPassword.trim() || '123',
      name: newName.trim(),
      gender: newGender,
      role: newRole,
      groupName: assignedGroup,
      avatar: randomAvatar,
    });

    setUserSuccessMessage(`Usuario @${newUsername.trim()} creado con éxito para "${assignedGroup}". Guardado en LocalStorage.`);
    setNewUsername('');
    setNewName('');
    setNewPassword('123');
    setTimeout(() => setUserSuccessMessage(null), 5000);
  };

  // Manejar cambio de contraseña
  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !modalNewPassword.trim()) return;

    onUpdateUserPassword(editingUser.id, modalNewPassword.trim());
    setPasswordChangeNotice(`¡Contraseña de ${editingUser.name} (@${editingUser.username}) actualizada con éxito!`);
    setEditingUser(null);
    setModalNewPassword('');
    setTimeout(() => setPasswordChangeNotice(null), 5000);
  };

  // Manejar creación de Categoría
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim()) return;

    let optionsList: string[] = [];

    if (catType === 'group') {
      optionsList = [...availableGroups];
    } else {
      const nonAdminUsers = users.filter((u) => u.role !== 'admin');

      if (individualCandidateSource === 'females') {
        optionsList = nonAdminUsers.filter((u) => u.gender === 'F').map((u) => u.name);
      } else if (individualCandidateSource === 'males') {
        optionsList = nonAdminUsers.filter((u) => u.gender === 'M').map((u) => u.name);
      } else if (individualCandidateSource === 'all') {
        optionsList = nonAdminUsers.map((u) => u.name);
      } else {
        optionsList = catOptionsText
          .split('\n')
          .map((o) => o.trim())
          .filter((o) => o.length > 0);
      }

      if (optionsList.length < 2) {
        alert('Por favor asegúrate de que la pregunta tenga al menos 2 personas candidatas.');
        return;
      }
    }

    onCreateCategory({
      title: catTitle.trim(),
      description: catDesc.trim() || 'Categoría del concurso de Halloween Atiempo',
      type: catType,
      options: optionsList,
      icon: catType === 'group' ? '🏰' : '👑',
    });

    setCatSuccessMessage(`Categoría "${catTitle.trim()}" guardada con ${optionsList.length} opciones en LocalStorage.`);
    setCatTitle('');
    setCatDesc('');
    setCatOptionsText('');
    setTimeout(() => setCatSuccessMessage(null), 5000);
  };

  const handleClearVotes = () => {
    if (confirm('¿Deseas reiniciar y limpiar los votos emitidos? Esto permitirá a todos los usuarios volver a votar y pondrá el contador en cero. (Los usuarios y categorías permanecerán intactos).')) {
      onClearVotesOnly();
      setVotesResetNotice('¡Votos limpiados exitosamente! La tabla se reinició y todos los usuarios pueden votar de nuevo.');
      setTimeout(() => setVotesResetNotice(null), 6000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-2 sm:px-4 space-y-10">
      
      {/* Header del Panel de Administración */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-900/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            Panel Exclusivo de Administrador
          </div>
          <h1 className="text-3xl font-black text-white">
            Gestión del Concurso Halloween 🎃
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
              <Database className="w-3 h-3 text-emerald-400" /> Guardado activo en LocalStorage (Pre-migración AWS)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToScoreboard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-spooky-purple transition-transform hover:scale-105"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            Ver Puntuación
          </button>
          <button
            onClick={handleClearVotes}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-300 hover:text-white text-xs font-semibold hover:bg-red-950/70 hover:border-red-600/60 transition-colors"
            title="Borrar votos y permitir a los usuarios votar de nuevo"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            Limpiar Votos
          </button>
        </div>
      </div>

      {votesResetNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{votesResetNotice}</span>
        </div>
      )}

      {passwordChangeNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{passwordChangeNotice}</span>
        </div>
      )}

      {/* FORMULARIOS: CREAR USUARIO Y CREAR CATEGORÍA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FORMULARIO 1: CREAR USUARIO */}
        <div className="bg-[#160b26]/90 border border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-950 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">1. Registrar Nuevo Usuario</h2>
              <p className="text-xs text-purple-300/70">
                Crea colaboradores con contraseña protegida y equipo
              </p>
            </div>
          </div>

          {userSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{userSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Nombre de Usuario (Login)
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="ej: mario.perez"
                  className="w-full bg-[#0d0617] border border-purple-900 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Casilla de Contraseña Protegida */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Contraseña de Ingreso
                </label>
                <div className="relative">
                  <input
                    type={showNewUserPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Contraseña protegida..."
                    className="w-full bg-[#0d0617] border border-purple-900 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    title={showNewUserPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showNewUserPassword ? (
                      <EyeOff className="w-4 h-4 text-orange-400" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ej: Mario Pérez"
                  className="w-full bg-[#0d0617] border border-purple-900 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Género
                </label>
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value as 'M' | 'F')}
                  className="w-full bg-[#0d0617] border border-purple-900 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="M">Hombre (M)</option>
                  <option value="F">Mujer (F)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Rol en la Plataforma
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="w-full bg-[#0d0617] border border-purple-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="user">Usuario Normal (Solo Vota)</option>
                  <option value="gh">Gestión Humana (Vota y Monitorea)</option>
                  <option value="admin">Administrador (Control total)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Grupo de Halloween
                </label>
                <select
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  className="w-full bg-[#0d0617] border border-purple-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  {availableGroups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                  <option value="__CUSTOM__">+ Otro Grupo Personalizado...</option>
                </select>
              </div>
            </div>

            {newGroup === '__CUSTOM__' && (
              <div>
                <label className="block text-xs font-semibold text-orange-400 mb-1">
                  Escribe el nuevo Grupo de Halloween
                </label>
                <input
                  type="text"
                  required
                  value={customGroup}
                  onChange={(e) => setCustomGroup(e.target.value)}
                  placeholder="ej: Los Hombres Lobo de Soporte"
                  className="w-full bg-[#0d0617] border border-orange-500/70 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold text-xs shadow-spooky-orange transition-all"
            >
              Guardar Usuario en LocalStorage 🎃
            </button>
          </form>
        </div>

        {/* FORMULARIO 2: CREAR CATEGORÍA */}
        <div className="bg-[#160b26]/90 border border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">2. Crear Nueva Categoría</h2>
              <p className="text-xs text-purple-300/70">
                Preguntas Grupales o Individuales (con opciones congeladas)
              </p>
            </div>
          </div>

          {catSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{catSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Título o Pregunta de la Categoría
              </label>
              <input
                type="text"
                required
                value={catTitle}
                onChange={(e) => setCatTitle(e.target.value)}
                placeholder="ej: 11. Mejor Efecto Especial o Iluminación"
                className="w-full bg-[#0d0617] border border-purple-900 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Tipo de Votación
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCatType('group')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    catType === 'group'
                      ? 'bg-orange-950/60 border-orange-500 text-white font-bold shadow-spooky-orange'
                      : 'bg-[#0d0617] border-purple-900 text-gray-400'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    🏰 Grupal (Equipos)
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Las opciones son los equipos. Bloquea autovoto al propio equipo.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCatType('individual')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    catType === 'individual'
                      ? 'bg-purple-950/60 border-purple-500 text-white font-bold shadow-spooky-purple'
                      : 'bg-[#0d0617] border-purple-900 text-gray-400'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    👑 Individual (Personas)
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Opciones congeladas con usuarios actuales. Bloquea autovoto.
                  </p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Descripción Detallada
              </label>
              <input
                type="text"
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="ej: Califica la creatividad en efectos visuales..."
                className="w-full bg-[#0d0617] border border-purple-900 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {catType === 'individual' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-[#0d0617] border border-purple-800/60">
                <label className="block text-xs font-bold text-purple-300">
                  Candidatos de la Pregunta Individual (Snapshot)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="candidateSource"
                      checked={individualCandidateSource === 'all'}
                      onChange={() => setIndividualCandidateSource('all')}
                      className="accent-purple-500"
                    />
                    <span>Todos los registrados (sin Admin)</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="candidateSource"
                      checked={individualCandidateSource === 'females'}
                      onChange={() => setIndividualCandidateSource('females')}
                      className="accent-purple-500"
                    />
                    <span>Solo Mujeres (sin Admin)</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="candidateSource"
                      checked={individualCandidateSource === 'males'}
                      onChange={() => setIndividualCandidateSource('males')}
                      className="accent-purple-500"
                    />
                    <span>Solo Hombres (sin Admin)</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="candidateSource"
                      checked={individualCandidateSource === 'manual'}
                      onChange={() => setIndividualCandidateSource('manual')}
                      className="accent-purple-500"
                    />
                    <span>Ingresar Manualmente</span>
                  </label>
                </div>

                {individualCandidateSource === 'manual' ? (
                  <textarea
                    rows={3}
                    value={catOptionsText}
                    onChange={(e) => setCatOptionsText(e.target.value)}
                    placeholder="Escribe un candidato por línea..."
                    className="w-full bg-[#160b26] border border-purple-700 rounded-xl p-2.5 text-xs text-white"
                  />
                ) : (
                  <p className="text-[11px] text-purple-300/70 italic">
                    ℹ️ Se congelarán automáticamente los nombres de los usuarios al presionar guardar. Nuevos usuarios registrados después no alterarán esta pregunta.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-bold text-xs shadow-spooky-purple transition-all"
            >
              Crear Categoría y Guardar en LocalStorage
            </button>
          </form>
        </div>

      </div>

      {/* TABLA DE USUARIOS REGISTRADOS Y ADMINISTRACIÓN DE CONTRASEÑAS */}
      <div className="bg-[#160b26]/90 border border-purple-900/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              Censo de Usuarios y Gestión de Contraseñas ({users.length})
            </h3>
            <p className="text-xs text-purple-300/70">
              Puedes cambiar la contraseña de cualquier usuario registrado en cualquier momento.
            </p>
          </div>
          <span className="text-xs text-gray-400">
            {users.filter((u) => u.hasVoted).length} de {users.filter((u) => u.role !== 'admin').length} votantes han emitido su voto
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-900/60 text-gray-400 font-semibold uppercase">
                <th className="py-3 px-3">Usuario</th>
                <th className="py-3 px-3">Nombre</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-3">Grupo Halloween</th>
                <th className="py-3 px-3">Estado Voto</th>
                <th className="py-3 px-3 text-right">Contraseña / Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/40 text-gray-300">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-purple-950/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-purple-300">
                    <div className="flex items-center gap-1.5">
                      <span>{u.avatar || '🎃'}</span>
                      <span>@{u.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {u.name}
                    <span className="text-[10px] text-gray-400 block font-normal">
                      {u.gender === 'F' ? 'Mujer' : 'Hombre'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'admin' ? 'bg-red-900/40 text-red-300 border border-red-700/50' :
                      u.role === 'gh' ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50' :
                      'bg-orange-950/40 text-orange-300 border border-orange-800/50'
                    }`}>
                      {u.role === 'admin' ? 'Administrador' : u.role === 'gh' ? 'Gestión Humana' : 'Usuario Normal'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-orange-300 font-medium">{u.groupName}</td>
                  <td className="py-3 px-3">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-950/60 text-purple-300 border border-purple-700/40">
                        Supervisión
                      </span>
                    ) : u.hasVoted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Ya votó
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/50 text-amber-300 border border-amber-600/40">
                        <Clock className="w-3 h-3 text-amber-400" /> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setModalNewPassword(u.password || '123');
                        setShowModalPassword(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/80 border border-purple-700/50 text-amber-300 hover:text-white text-xs font-semibold transition-all hover:scale-105"
                      title="Cambiar contraseña de este usuario"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cambiar Clave</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARA CAMBIAR CONTRASEÑA */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#160b26] border border-purple-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Cambiar Contraseña</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-purple-900/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-800/50 text-xs text-purple-200">
              Usuario: <strong className="text-white">{editingUser.name}</strong> (@{editingUser.username})
            </div>

            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Nueva Contraseña para el usuario
                </label>
                <div className="relative">
                  <input
                    type={showModalPassword ? 'text' : 'password'}
                    required
                    value={modalNewPassword}
                    onChange={(e) => setModalNewPassword(e.target.value)}
                    placeholder="Escribe la nueva contraseña..."
                    className="w-full bg-[#0d0617] border border-purple-700 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPassword(!showModalPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showModalPassword ? (
                      <EyeOff className="w-4 h-4 text-orange-400" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-800 text-gray-300 text-xs font-semibold hover:bg-purple-900/60"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold shadow-spooky-orange transition-all"
                >
                  Guardar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
