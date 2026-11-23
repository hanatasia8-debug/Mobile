export type GatheringCategory = 'Olahraga' | 'Gaming' | 'Kuliner' | 'Seni' | 'Teknologi' | 'Umum';

export type GatheringStatus = 'active' | 'completed' | 'cancelled';

/**
 * KRITERIA MODUL 4: Cloud Database Model
 * Interface entitas data yang dipetakan ke tabel PostgreSQL `gatherings` di Supabase
 */
export interface GatheringEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: GatheringCategory;
  location: string;
  time: string;
  members: number;
  max_members: number;
  creator_name?: string;
  status: GatheringStatus;
  created_at?: string;
}

export type NewGatheringInput = Omit<GatheringEvent, 'id' | 'created_at'>;
