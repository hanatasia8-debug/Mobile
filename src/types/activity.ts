/**
 * Definisi Type & Interface untuk Entitas Kegiatan & Komunitas (GatherIn)
 * Sesuai Modul 3: Pemrograman Asynchronous & API Call
 */

export type HobbyCategory = 'Olahraga' | 'Gaming' | 'Kuliner' | 'Seni' | 'Teknologi';

/**
 * Interface untuk Object Kegiatan Kumpul Mahasiswa
 */
export interface HobbyData {
  id: string;
  name: string;
  description: string;
  category: HobbyCategory;
  location: string;
  time: string;
  members: number;
  maxMembers: number;
  host: string;
  hostAvatar?: string;
  isJoined?: boolean;
  isFavorite?: boolean;
  source?: 'local' | 'external';
}

/**
 * Interface untuk Object Host Komunitas Mahasiswa
 * Dihasilkan dari proses mapping respons External API (dummyjson users)
 * Memenuhi Kriteria Penilaian: "Mengambil data dari External API dan memasukkannya ke dalam Object menggunakan Interface"
 */
export interface CommunityHost {
  id: string;
  fullName: string;
  university: string;
  department: string;
  role: string;
  avatarUrl: string;
  email: string;
}

/**
 * Interface untuk Object Diskusi Forum Spontan Mahasiswa
 * Dihasilkan dari proses mapping respons External API (dummyjson posts)
 */
export interface CampusDiscussion {
  id: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  views: number;
  authorId: number;
}

/**
 * Parameter yang diteruskan ke Dynamic Route detail/[id].tsx
 */
export type DetailScreenParams = {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  location?: string;
  time?: string;
  members?: string;
  maxMembers?: string;
  host?: string;
  hostAvatar?: string;
  isJoined?: string;
  isFavorite?: string;
  [key: string]: string | string[] | undefined;
};

