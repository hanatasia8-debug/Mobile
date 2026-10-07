export type HobbyCategory = 'Olahraga' | 'Gaming' | 'Kuliner' | 'Seni';

export interface HobbyData {
  id: string;
  name: string;
  description: string;
  category: HobbyCategory;
  location: string;
  time: string;
  members: number;
}

export const hobbies: HobbyData[] = [
  {
    id: 'basket',
    name: 'Basket sore',
    description: 'Cari teman untuk main santai, semua level boleh ikut.',
    category: 'Olahraga',
    location: 'Lapangan Kampus A',
    time: 'Hari ini, 16.30',
    members: 4,
  },
  {
    id: 'boardgame',
    name: 'Board game night',
    description: 'Ngobrol dan main board game bareng setelah kelas.',
    category: 'Gaming',
    location: 'Student Lounge',
    time: 'Hari ini, 19.00',
    members: 3,
  },
  {
    id: 'coffee',
    name: 'Jajan kopi keliling',
    description: 'Jelajahi kedai kopi baru di sekitar kampus.',
    category: 'Kuliner',
    location: 'Gerbang Utama',
    time: 'Besok, 10.00',
    members: 2,
  },
  {
    id: 'sketch',
    name: 'Sketch & chill',
    description: 'Bawa sketchbook, gambar bebas sambil bertukar ide.',
    category: 'Seni',
    location: 'Taman Fakultas',
    time: 'Besok, 15.30',
    members: 5,
  },
];

export const categoryOptions: (HobbyCategory | 'Semua')[] = [
  'Semua',
  'Olahraga',
  'Gaming',
  'Kuliner',
  'Seni',
];
