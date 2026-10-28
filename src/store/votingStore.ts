import { useState, useEffect } from 'react';
import type { User, Category, VoteRecord, TeamScore, PersonScore } from '../types';
import { ApiService } from '../services/apiService';

export const INITIAL_GROUPS: string[] = [
  'Hotel Transilvania',
  'El juego del Calamar',
  'Galaxia',
  'Día de los Muertos',
  'Los Simpsons',
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    password: 'Atiempo2025+',
    name: 'Camilo Muñoz',
    role: 'admin',
    groupName: 'Comité Organizador',
    hasVoted: false,
    avatar: '🎃',
    gender: 'M',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    title: '1. Trabajo en Equipo (Cohesión del Grupo)',
    description: 'Evalúa la armonía, sinergia, coordinación y apoyo mutuo demostrado por los integrantes del equipo durante el evento.',
    type: 'group',
    options: [...INITIAL_GROUPS],
    icon: '🤝',
  },
  {
    id: 'cat-2',
    title: '2. Motivación y Espíritu Festivo',
    description: 'El equipo con mayor entusiasmo, energía positiva y alegría desbordante que contagió el ambiente en toda la empresa.',
    type: 'group',
    options: [...INITIAL_GROUPS],
    icon: '🔥',
  },
  {
    id: 'cat-3',
    title: '3. Cumplimiento de Reglas y Constancia',
    description: 'El equipo que respetó cabalmente las normas del concurso y mantuvo la constancia (iniciaron decorando y finalizaron juntos la actividad).',
    type: 'group',
    options: [...INITIAL_GROUPS],
    icon: '📜',
  },
  {
    id: 'cat-4',
    title: '4. Creatividad en la Decoración del Área',
    description: 'Premia la ambientación temática más impactante, detallada, original y terrorífica en los espacios de trabajo de la empresa.',
    type: 'group',
    options: [...INITIAL_GROUPS],
    icon: '🏰',
  },
  {
    id: 'cat-5',
    title: '5. Creatividad en los Disfraces Grupales',
    description: 'El equipo con la propuesta de vestuario, caracterización y maquillaje más ingeniosa, uniforme y alineada a su temática.',
    type: 'group',
    options: [...INITIAL_GROUPS],
    icon: '🎭',
  },
  {
    id: 'cat-6',
    title: '6. Aprovechamiento Inteligente de Recursos',
    description: 'El equipo que demostró mayor ingenio y recursividad empleando materiales reciclables, sostenibles o reutilizados sin incurrir en desperdicios.',
    type: 'group',
    options: [...INITIAL_GROUPS],
    icon: '♻️',
  },
  {
    id: 'cat-7',
    title: '7. Mejor Presentación y Puesta en Escena del Talento',
    description: 'El equipo que ofreció el mejor show artístico, dramatización, coreografía o baile con mayor calidad y preparación en tarima.',
    type: 'group',
    options: [...INITIAL_GROUPS],
    icon: '⭐',
  },
  {
    id: 'cat-8',
    title: '8. Participación Total del Grupo en la Presentación',
    description: 'El equipo donde se evidenció la integración activa, equitativa y entusiasta del 100% de sus miembros durante el acto de talento.',
    type: 'group',
    options: [...INITIAL_GROUPS],
    icon: '👥',
  },
  {
    id: 'cat-9',
    title: '9. Mejor Disfraz de la Empresa (Mujer)',
    description: 'Votación individual para elegir a la colaboradora con el disfraz, caracterización y maquillaje más impresionante.',
    type: 'individual',
    options: [],
    icon: '👑',
  },
  {
    id: 'cat-10',
    title: '10. Mejor Disfraz de la Empresa (Hombre)',
    description: 'Votación individual para elegir al colaborador con el disfraz, personificación e ingenio más destacado del concurso.',
    type: 'individual',
    options: [],
    icon: '🎩',
  },
];

// Almacenamiento version 3 para limpiar datos antiguos y cargar solo Camilo Muñoz y los 5 grupos oficiales
const STORAGE_KEYS = {
  USERS: 'atiempo_halloween_users_v3',
  CATEGORIES: 'atiempo_halloween_categories_v3',
  GROUPS: 'atiempo_halloween_groups_v3',
  VOTES: 'atiempo_halloween_votes_v3',
  CURRENT_USER_ID: 'atiempo_halloween_current_user_id_v3',
};

export class VotingStorage {
  static getGroups(): string[] {
    if (typeof window === 'undefined') return INITIAL_GROUPS;
    const raw = localStorage.getItem(STORAGE_KEYS.GROUPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_GROUPS));
      return INITIAL_GROUPS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_GROUPS;
    }
  }

  static saveGroups(groups: string[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    window.dispatchEvent(new Event('voting-storage-changed'));
  }

  static getUsers(): User[] {
    if (typeof window === 'undefined') return INITIAL_USERS;
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    const votes = this.getVotes();
    const votedUserIds = new Set(votes.map((v) => v.userId));

    let users: User[] = INITIAL_USERS;
    if (raw) {
      try {
        users = JSON.parse(raw);
      } catch {
        users = INITIAL_USERS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }

    return users.map((u) => ({
      ...u,
      hasVoted: votedUserIds.has(u.id) || Boolean(u.hasVoted),
    }));
  }

  static getCategories(): Category[] {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  static getVotes(): VoteRecord[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.VOTES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static getCurrentUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  }

  static setCurrentUserId(id: string | null) {
    if (typeof window === 'undefined') return;
    if (id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
    window.dispatchEvent(new Event('voting-storage-changed'));
  }

  static saveUsers(users: User[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    window.dispatchEvent(new Event('voting-storage-changed'));
  }

  static saveCategories(categories: Category[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('voting-storage-changed'));
  }

  static saveVotes(votes: VoteRecord[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
    window.dispatchEvent(new Event('voting-storage-changed'));
  }

  static saveVote(record: VoteRecord) {
    if (typeof window === 'undefined') return;
    const votes = this.getVotes();
    votes.push(record);
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));

    const users = this.getUsers().map((u) => {
      if (u.id === record.userId) {
        return { ...u, hasVoted: true };
      }
      return u;
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    window.dispatchEvent(new Event('voting-storage-changed'));
  }

  static resetToDefault() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_GROUPS));
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    window.dispatchEvent(new Event('voting-storage-changed'));
  }

  static clearVotesOnly() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify([]));
    const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    let usersList: User[] = INITIAL_USERS;
    if (rawUsers) {
      try {
        usersList = JSON.parse(rawUsers);
      } catch {
        usersList = INITIAL_USERS;
      }
    }
    const resetUsers = usersList.map((u) => ({ ...u, hasVoted: false }));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(resetUsers));
    window.dispatchEvent(new Event('voting-storage-changed'));
  }
}

export function useVotingState() {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const sync = () => {
    const loadedVotes = VotingStorage.getVotes();
    const loadedUsers = VotingStorage.getUsers();
    const loadedCategories = VotingStorage.getCategories();
    const loadedGroups = VotingStorage.getGroups();
    const loadedUserId = VotingStorage.getCurrentUserId();

    setVotes(loadedVotes);
    setUsers(loadedUsers);
    setCategories(loadedCategories);
    setGroups(loadedGroups);
    setCurrentUserId(loadedUserId);
    setIsLoaded(true);
  };

  // Sincronizar en segundo plano con AWS API Gateway (Categorías, Usuarios y Votos)
  const fetchCloudData = async () => {
    try {
      const [cloudCategories, cloudUsers, cloudVotes] = await Promise.all([
        ApiService.getCategories(),
        ApiService.getUsers(),
        ApiService.getVotes(),
      ]);

      if (cloudCategories && cloudCategories.length > 0) {
        VotingStorage.saveCategories(cloudCategories);
      }
      if (cloudUsers && cloudUsers.length > 0) {
        VotingStorage.saveUsers(cloudUsers);
      }
      if (cloudVotes && Array.isArray(cloudVotes)) {
        VotingStorage.saveVotes(cloudVotes);
        setVotes(cloudVotes);
      }
    } catch (err) {
      console.log('AWS cloud sync notice:', err);
    }
  };

  useEffect(() => {
    sync();
    fetchCloudData();

    // Sondeo periódico cada 6 segundos para actualización automática en vivo en todas las pantallas
    const interval = setInterval(() => {
      fetchCloudData();
    }, 6000);

    const handleStorageChange = () => sync();
    const handleFocus = () => fetchCloudData();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchCloudData();
      }
    };

    window.addEventListener('voting-storage-changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('voting-storage-changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const currentUserRaw = users.find((u) => u.id === currentUserId) || null;
  const currentUser: User | null = currentUserRaw
    ? {
        ...currentUserRaw,
        hasVoted: votes.some((v) => v.userId === currentUserRaw.id) || Boolean(currentUserRaw.hasVoted),
      }
    : null;

  const login = (userId: string) => {
    VotingStorage.setCurrentUserId(userId);
  };

  // Login con Cognito + AWS API Gateway (con contingencia en LocalStorage)
  const loginWithCredentials = async (username: string, passwordInput: string) => {
    const trimmedUsername = username.toLowerCase().trim();
    const trimmedPassword = passwordInput.trim();

    // 1. Intentar inicio de sesión en AWS Cognito
    const cloudRes = await ApiService.login(trimmedUsername, trimmedPassword);
    if (cloudRes.success && cloudRes.user) {
      const existing = users.filter((u) => u.id !== cloudRes.user!.id);
      const updated = [...existing, cloudRes.user!];
      VotingStorage.saveUsers(updated);
      login(cloudRes.user.id);
      return { success: true, user: cloudRes.user };
    }

    // 2. Si AWS reporta error pero el usuario existe en base local (modo híbrido/offline)
    const localUser = users.find((u) => u.username.toLowerCase().trim() === trimmedUsername);
    if (localUser) {
      const expectedPassword = localUser.password || 'Atiempo2025+';
      if (trimmedPassword === expectedPassword) {
        login(localUser.id);
        return { success: true, user: localUser };
      }
      return { success: false, error: 'Contraseña incorrecta. Intenta nuevamente.' };
    }

    return {
      success: false,
      error: cloudRes.error || 'Usuario o contraseña no válidos.',
    };
  };

  const logout = () => {
    ApiService.clearToken();
    VotingStorage.setCurrentUserId(null);
  };

  // Crear usuario (Sincronizado en AWS + LocalStorage)
  const createUser = async (newUser: Omit<User, 'id' | 'hasVoted'>) => {
    const cloudRes = await ApiService.createUser(newUser);
    const userToSave: User = cloudRes.success && cloudRes.user
      ? cloudRes.user
      : {
          ...newUser,
          id: `usr-${Date.now()}`,
          hasVoted: false,
        };

    const updatedUsers = [...users, userToSave];
    VotingStorage.saveUsers(updatedUsers);

    if (newUser.groupName && !groups.includes(newUser.groupName)) {
      const updatedGroups = [...groups, newUser.groupName];
      VotingStorage.saveGroups(updatedGroups);
    }

    return userToSave;
  };

  // Cambiar contraseña de cualquier usuario (Sincronizado en AWS Cognito + LocalStorage)
  const updateUserPassword = async (userId: string, newPassword: string) => {
    await ApiService.updateUserPassword(userId, newPassword);

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, password: newPassword.trim() };
      }
      return u;
    });
    VotingStorage.saveUsers(updatedUsers);
  };

  // Crear categoría (Sincronizado en AWS DynamoDB + LocalStorage)
  const createCategory = async (newCat: Omit<Category, 'id'>) => {
    const cloudRes = await ApiService.createCategory(newCat);
    const catToSave: Category = cloudRes.success && cloudRes.category
      ? cloudRes.category
      : {
          ...newCat,
          id: `cat-${Date.now()}`,
          options: [...newCat.options],
        };

    const updated = [...categories, catToSave];
    VotingStorage.saveCategories(updated);
    return catToSave;
  };

  const addGroup = (groupName: string) => {
    const trimmed = groupName.trim();
    if (!trimmed || groups.includes(trimmed)) return;
    const updated = [...groups, trimmed];
    VotingStorage.saveGroups(updated);
  };

  // Enviar Voto (Sincronizado en AWS + LocalStorage)
  const submitVote = async (selections: Record<string, string>) => {
    if (!currentUser) throw new Error('No hay usuario autenticado');
    if (currentUser.role === 'admin') {
      throw new Error('El Administrador no puede votar en el concurso, solo supervisar.');
    }
    if (currentUser.hasVoted) throw new Error('Ya enviaste tu votación anteriormente.');

    for (const [catId, selected] of Object.entries(selections)) {
      const cat = categories.find((c) => c.id === catId);
      if (cat) {
        if (cat.type === 'group' && selected.toLowerCase().trim() === currentUser.groupName.toLowerCase().trim()) {
          throw new Error(`¡No está permitido votar por tu propio grupo (${currentUser.groupName})!`);
        }
        if (
          cat.type === 'individual' &&
          (selected.toLowerCase().trim() === currentUser.name.toLowerCase().trim() ||
            selected.toLowerCase().trim() === currentUser.username.toLowerCase().trim())
        ) {
          throw new Error(`¡No está permitido votar por ti mismo en la categoría "${cat.title}"!`);
        }
      }
    }

    const cloudRes = await ApiService.submitVote(currentUser.id, selections);
    if (!cloudRes.success && cloudRes.error && !cloudRes.error.includes('No se pudo conectar')) {
      throw new Error(cloudRes.error);
    }

    const record: VoteRecord = {
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      selections,
    };
    VotingStorage.saveVote(record);
    // Sincronizar inmediatamente con AWS
    fetchCloudData().catch(() => {});
  };

  // Reiniciar votos (Sincronizado en AWS + LocalStorage)
  const clearVotesOnly = async () => {
    await ApiService.resetVotes();
    VotingStorage.clearVotesOnly();
    fetchCloudData().catch(() => {});
  };

  const calculateTeamScores = (): TeamScore[] => {
    const teamMap: Record<string, { totalVotes: number; byCategory: Record<string, number> }> = {};

    const allTeams = new Set<string>(groups);
    categories.forEach((cat) => {
      if (cat.type === 'group') {
        cat.options.forEach((team) => allTeams.add(team));
      }
    });

    allTeams.forEach((team) => {
      teamMap[team] = { totalVotes: 0, byCategory: {} };
    });

    votes.forEach((vote) => {
      Object.entries(vote.selections).forEach(([catId, optionChosen]) => {
        const cat = categories.find((c) => c.id === catId);
        if (cat && cat.type === 'group') {
          if (!teamMap[optionChosen]) {
            teamMap[optionChosen] = { totalVotes: 0, byCategory: {} };
          }
          teamMap[optionChosen].totalVotes += 1;
          teamMap[optionChosen].byCategory[catId] = (teamMap[optionChosen].byCategory[catId] || 0) + 1;
        }
      });
    });

    return Object.entries(teamMap)
      .map(([teamName, data]) => ({
        teamName,
        totalVotes: data.totalVotes,
        byCategory: data.byCategory,
      }))
      .sort((a, b) => b.totalVotes - a.totalVotes);
  };

  const calculateIndividualScores = (): Record<string, PersonScore[]> => {
    const individualCategories = categories.filter((c) => c.type === 'individual');
    const result: Record<string, PersonScore[]> = {};

    individualCategories.forEach((cat) => {
      const counts: Record<string, number> = {};
      cat.options.forEach((opt) => {
        counts[opt] = 0;
      });

      votes.forEach((vote) => {
        const selected = vote.selections[cat.id];
        if (selected) {
          counts[selected] = (counts[selected] || 0) + 1;
        }
      });

      result[cat.id] = Object.entries(counts)
        .map(([personName, voteCount]) => ({
          personName,
          categoryId: cat.id,
          categoryTitle: cat.title,
          votes: voteCount,
        }))
        .sort((a, b) => b.votes - a.votes);
    });

    return result;
  };

  return {
    users,
    categories,
    groups,
    votes,
    currentUser,
    isLoaded,
    login,
    loginWithCredentials,
    logout,
    createUser,
    updateUserPassword,
    createCategory,
    addGroup,
    submitVote,
    calculateTeamScores,
    calculateIndividualScores,
    resetToDefault: VotingStorage.resetToDefault,
    clearVotesOnly,
    refreshCloudData: fetchCloudData,
  };
}
