import type { ImageSource } from 'expo-image';

export type HobbyCategory = 'Olahraga' | 'Gaming' | 'Kuliner' | 'Seni';

export interface HobbyData {
  id: string;
  name: string;
  description: string;
  category: HobbyCategory;
  location: string;
  time: string;
  members: number;
  image: ImageSource;
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
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: 'boardgame',
    name: 'Board game night',
    description: 'Ngobrol dan main board game bareng setelah kelas.',
    category: 'Gaming',
    location: 'Student Lounge',
    time: 'Hari ini, 19.00',
    members: 3,
    image: require('@/assets/images/expo-logo.png'),
  },
  {
    id: 'coffee',
    name: 'Jajan kopi keliling',
    description: 'Jelajahi kedai kopi baru di sekitar kampus.',
    category: 'Kuliner',
    location: 'Gerbang Utama',
    time: 'Besok, 10.00',
    members: 2,
    image: require('@/assets/images/tutorial-web.png'),
  },
  {
    id: 'sketch',
    name: 'Sketch & chill',
    description: 'Bawa sketchbook, gambar bebas sambil bertukar ide.',
    category: 'Seni',
    location: 'Taman Fakultas',
    time: 'Besok, 15.30',
    members: 5,
    image: require('@/assets/images/expo-badge.png'),
  },
];

export const categoryOptions: (HobbyCategory | 'Semua')[] = [
  'Semua',
  'Olahraga',
  'Gaming',
  'Kuliner',
  'Seni',
];
