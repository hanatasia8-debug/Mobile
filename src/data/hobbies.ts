export type HobbyCategory = 'Olahraga' | 'Gaming' | 'Kuliner' | 'Seni';

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
  isJoined?: boolean;
}

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
  isJoined?: string;
  [key: string]: string | string[] | undefined;
};

export const hobbies: HobbyData[] = [
  {
    id: 'basket',
    name: 'Basket Sore Santai',
    description: 'Cari teman untuk main basket 3-on-3 santai, semua level boleh ikut tanpa seleksi!',
    category: 'Olahraga',
    location: 'Lapangan Kampus A',
    time: 'Hari ini, 16.30 WIB',
    members: 4,
    maxMembers: 6,
    host: 'Rian (Teknik)',
    isJoined: false,
  },
  {
    id: 'boardgame',
    name: 'Board Game Night & Chill',
    description: 'Ngobrol santai sambil main Catan & Werewolf bareng setelah jam kuliah selesai.',
    category: 'Gaming',
    location: 'Student Lounge Gd. Bersama',
    time: 'Hari ini, 19.00 WIB',
    members: 3,
    maxMembers: 8,
    host: 'Nadia (Sistem Informasi)',
    isJoined: false,
  },
  {
    id: 'coffee',
    name: 'Jajan Kopi & Co-Working',
    description: 'Jelajahi kedai kopi baru di sekitar kampus sambil nugas bareng.',
    category: 'Kuliner',
    location: 'Kopi Kenari Dekat Gerbang Utama',
    time: 'Besok, 10.00 WIB',
    members: 2,
    maxMembers: 5,
    host: 'Faris (Informatika)',
    isJoined: false,
  },
  {
    id: 'sketch',
    name: 'Sketching & Sharing Portofolio',
    description: 'Bawa sketchbook atau tablet menggambar, bebas explore ide visual baru.',
    category: 'Seni',
    location: 'Taman Fakultas Sastra',
    time: 'Besok, 15.30 WIB',
    members: 5,
    maxMembers: 10,
    host: 'Alya (DKV)',
    isJoined: false,
  },
];

export const categoryOptions: (HobbyCategory | 'Semua')[] = [
  'Semua',
  'Olahraga',
  'Gaming',
  'Kuliner',
  'Seni',
];

