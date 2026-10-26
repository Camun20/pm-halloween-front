export type Role = 'admin' | 'user' | 'gh';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: Role;
  groupName: string; // Equipo de halloween al que pertenece
  hasVoted: boolean;
  avatar?: string;
  gender?: 'M' | 'F'; // 'F' para colaboradoras, 'M' para colaboradores
}

export type CategoryType = 'group' | 'individual';

export interface Category {
  id: string;
  title: string;
  description: string;
  type: CategoryType; // 'group' suma a equipos de halloween, 'individual' suma a personas
  options: string[]; // Nombres de los equipos o nombres de las personas candidatas (snapshot)
  icon?: string;
}

export interface VoteRecord {
  userId: string;
  timestamp: string;
  selections: Record<string, string>; // categoryId -> selectedOption (teamName o personName)
}

export interface TeamScore {
  teamName: string;
  totalVotes: number;
  byCategory: Record<string, number>;
}

export interface PersonScore {
  personName: string;
  categoryId: string;
  categoryTitle: string;
  votes: number;
}
