import { useState, useEffect } from 'react';
import type { User, Category, VoteRecord, TeamScore, PersonScore } from '../types';

export const INITIAL_GROUPS: string[] = [
  'Los Vampiros de Tecnología',
  'Las Brujas de Gestión Humana',
  'Fantasmas de Operaciones',
  'Zombis de Contabilidad',
  'Monstruos de Mercadeo y Ventas',
  'Hechiceros de Finanzas',
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'admin',
    password: '123',
    name: 'Sebastián Administrador',
    role: 'admin',
    groupName: 'Comité Organizador',
    hasVoted: false,
    avatar: '🎃',
    gender: 'M',
  },
  {
    id: 'usr-2',
    username: 'carolina.gh',
    password: '123',
    name: 'Carolina Morales',
    role: 'gh',
    groupName: 'Las Brujas de Gestión Humana',
    hasVoted: false,
    avatar: '🧙‍♀️',
    gender: 'F',
  },
  {
    id: 'usr-3',
    username: 'sofia.rh',
    password: '123',
    name: 'Sofía Álvarez',
    role: 'gh',
    groupName: 'Las Brujas de Gestión Humana',
    hasVoted: false,
    avatar: '✨',
    gender: 'F',
  },
  {
    id: 'usr-4',
    username: 'carlos.dev',
    password: '123',
    name: 'Carlos Mendoza',
    role: 'user',
    groupName: 'Los Vampiros de Tecnología',
    hasVoted: false,
    avatar: '🧛‍♂️',
    gender: 'M',
  },
  {
    id: 'usr-5',
    username: 'laura.ops',
    password: '123',
    name: 'Laura Restrepo',
    role: 'user',
    groupName: 'Fantasmas de Operaciones',
    hasVoted: false,
    avatar: '👻',
    gender: 'F',
  },
  {
    id: 'usr-6',
    username: 'jorge.conta',
    password: '123',
    name: 'Jorge Gómez',
    role: 'user',
    groupName: 'Zombis de Contabilidad',
    hasVoted: false,
    avatar: '🧟‍♂️',
    gender: 'M',
  },
  {
    id: 'usr-7',
    username: 'diana.mkt',
    password: '123',
    name: 'Diana Torres',
    role: 'user',
    groupName: 'Monstruos de Mercadeo y Ventas',
    hasVoted: false,
    avatar: '🧛‍♀️',
    gender: 'F',
  },
  {
    id: 'usr-8',
    username: 'andres.fin',
    password: '123',
    name: 'Andrés Botero',
    role: 'user',
    groupName: 'Hechiceros de Finanzas',
    hasVoted: false,
    avatar: '🧙‍♂️',
    gender: 'M',
  },
  {
    id: 'usr-9',
    username: 'paola.ops',
    password: '123',
    name: 'Paola Ramos',
    role: 'user',
    groupName: 'Fantasmas de Operaciones',
    hasVoted: false,
    avatar: '🐈‍⬛',
    gender: 'F',
  },
  {
    id: 'usr-10',
    username: 'felipe.infra',
    password: '123',
    name: 'Felipe Vélez',
    role: 'user',
    groupName: 'Los Vampiros de Tecnología',
    hasVoted: false,
    avatar: '🐺',
    gender: 'M',
  },
];

// Opciones individuales congeladas (snapshot) de los usuarios registrados al inicio (sin admin)
const INITIAL_FEMALE_CANDIDATES = INITIAL_USERS
  .filter((u) => u.role !== 'admin' && u.gender === 'F')
  .map((u) => u.name);

const INITIAL_MALE_CANDIDATES = INITIAL_USERS
  .filter((u) => u.role !== 'admin' && u.gender === 'M')
  .map((u) => u.name);

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
    options: [...INITIAL_FEMALE_CANDIDATES],
    icon: '👑',
  },
  {
    id: 'cat-10',
    title: '10. Mejor Disfraz de la Empresa (Hombre)',
    description: 'Votación individual para elegir al colaborador con el disfraz, personificación e ingenio más destacado del concurso.',
    type: 'individual',
    options: [...INITIAL_MALE_CANDIDATES],
    icon: '🎩',
  },
];

// Helper seguro para localStorage en el navegador
const STORAGE_KEYS = {
  USERS: 'atiempo_halloween_users_v2',
  CATEGORIES: 'atiempo_halloween_categories_v2',
  GROUPS: 'atiempo_halloween_groups_v2',
  VOTES: 'atiempo_halloween_votes_v2',
  CURRENT_USER_ID: 'atiempo_halloween_current_user_id_v2',
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

    // Sincronizar dinámicamente hasVoted con los votos reales existentes
    return users.map((u) => ({
      ...u,
      hasVoted: votedUserIds.has(u.id),
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

  static saveVote(record: VoteRecord) {
    if (typeof window === 'undefined') return;
    const votes = this.getVotes();
    votes.push(record);
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));

    // Actualizar usuarios en localStorage
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
    // 1. Vaciar votos
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify([]));
    // 2. Marcar todos los usuarios con hasVoted: false
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
    // 3. Notificar a toda la aplicación
    window.dispatchEvent(new Event('voting-storage-changed'));
  }
}

// Hook de React para sincronizar el estado reactivo con localStorage
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

  useEffect(() => {
    sync();
    const handleStorageChange = () => sync();
    window.addEventListener('voting-storage-changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('voting-storage-changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Determinar currentUser sincronizado dinámicamente con hasVoted
  const currentUserRaw = users.find((u) => u.id === currentUserId) || null;
  const currentUser: User | null = currentUserRaw
    ? {
        ...currentUserRaw,
        hasVoted: votes.some((v) => v.userId === currentUserRaw.id),
      }
    : null;

  // Login por ID
  const login = (userId: string) => {
    VotingStorage.setCurrentUserId(userId);
  };

  // Login con Usuario y Contraseña
  const loginWithCredentials = (username: string, passwordInput: string) => {
    const trimmedUsername = username.toLowerCase().trim();
    const trimmedPassword = passwordInput.trim();

    const user = users.find((u) => u.username.toLowerCase().trim() === trimmedUsername);

    if (!user) {
      return { success: false, error: 'Usuario no registrado en la base de datos.' };
    }

    const expectedPassword = user.password || '123';
    if (trimmedPassword !== expectedPassword) {
      return { success: false, error: 'Contraseña incorrecta. Intenta nuevamente.' };
    }

    login(user.id);
    return { success: true, user };
  };

  const logout = () => {
    VotingStorage.setCurrentUserId(null);
  };

  // Crear usuario (Admin) -> Se persiste en localStorage
  const createUser = (newUser: Omit<User, 'id' | 'hasVoted'>) => {
    const id = `usr-${Date.now()}`;
    const user: User = {
      ...newUser,
      id,
      hasVoted: false,
    };
    const updatedUsers = [...users, user];
    VotingStorage.saveUsers(updatedUsers);

    // Si el grupo del usuario no existe en la lista de grupos, guardarlo
    if (newUser.groupName && !groups.includes(newUser.groupName)) {
      const updatedGroups = [...groups, newUser.groupName];
      VotingStorage.saveGroups(updatedGroups);
    }

    return user;
  };

  // Administrador cambia la contraseña de cualquier usuario
  const updateUserPassword = (userId: string, newPassword: string) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, password: newPassword.trim() };
      }
      return u;
    });
    VotingStorage.saveUsers(updatedUsers);
  };

  // Crear categoría (Admin) -> Se persiste en localStorage con snapshot de opciones
  const createCategory = (newCat: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const cat: Category = {
      ...newCat,
      id,
      // Las opciones quedan congeladas (snapshot) en este momento
      options: [...newCat.options],
    };
    const updated = [...categories, cat];
    VotingStorage.saveCategories(updated);
    return cat;
  };

  // Agregar grupo nuevo (Admin) -> Se persiste en localStorage
  const addGroup = (groupName: string) => {
    const trimmed = groupName.trim();
    if (!trimmed || groups.includes(trimmed)) return;
    const updated = [...groups, trimmed];
    VotingStorage.saveGroups(updated);
  };

  // Enviar Voto
  const submitVote = (selections: Record<string, string>) => {
    if (!currentUser) throw new Error('No hay usuario autenticado');
    if (currentUser.role === 'admin') {
      throw new Error('El Administrador no puede votar en el concurso, solo supervisar.');
    }
    if (currentUser.hasVoted) throw new Error('Ya enviaste tu votación anteriormente.');

    for (const [catId, selected] of Object.entries(selections)) {
      const cat = categories.find((c) => c.id === catId);
      if (cat) {
        // Regla 1: En categorías grupales, NO puede votar por su propio grupo
        if (cat.type === 'group') {
          if (selected.toLowerCase().trim() === currentUser.groupName.toLowerCase().trim()) {
            throw new Error(`¡No está permitido votar por tu propio grupo (${currentUser.groupName})!`);
          }
        }

        // Regla 2: En categorías individuales, NO puede votar por sí mismo
        if (cat.type === 'individual') {
          if (
            selected.toLowerCase().trim() === currentUser.name.toLowerCase().trim() ||
            selected.toLowerCase().trim() === currentUser.username.toLowerCase().trim()
          ) {
            throw new Error(`¡No está permitido votar por ti mismo en la categoría "${cat.title}"!`);
          }
        }
      }
    }

    const record: VoteRecord = {
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      selections,
    };

    VotingStorage.saveVote(record);
  };

  // Calcular puntuación de equipos
  const calculateTeamScores = (): TeamScore[] => {
    const teamMap: Record<string, { totalVotes: number; byCategory: Record<string, number> }> = {};

    // Obtener todos los equipos de las categorías grupales y predeterminados
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

  // Calcular puntuación de participantes individuales
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
    clearVotesOnly: VotingStorage.clearVotesOnly,
  };
}
