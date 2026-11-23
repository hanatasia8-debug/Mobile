import { supabase } from '@/lib/supabase';
import { GatheringEvent, NewGatheringInput } from '@/types/gathering';

/**
 * KRITERIA MODUL 4: Cloud Database CRUD (PostgreSQL Supabase)
 * Menggunakan Supabase JS Client untuk query data yang dilindungi RLS (Row Level Security)
 */

/**
 * 1. SELECT (Membaca Data)
 * Mengambil daftar gathering dari Cloud database.
 * RLS memastikan user hanya mendapatkan baris miliknya sendiri (auth.uid() = user_id).
 */
export async function fetchUserGatherings(): Promise<GatheringEvent[]> {
  const { data, error } = await supabase
    .from('gatherings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase SELECT Error]:', error.message);
    throw new Error(error.message);
  }

  return (data as GatheringEvent[]) || [];
}

/**
 * 2. INSERT (Menulis Data Baru)
 * Menambahkan ajakan kumpul baru ke tabel PostgreSQL.
 */
export async function createGathering(
  payload: NewGatheringInput
): Promise<GatheringEvent> {
  const { data, error } = await supabase
    .from('gatherings')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('[Supabase INSERT Error]:', error.message);
    throw new Error(error.message);
  }

  return data as GatheringEvent;
}

/**
 * 3. UPDATE (Memperbarui Status Data)
 */
export async function toggleGatheringStatus(
  id: string,
  newStatus: 'active' | 'completed'
): Promise<GatheringEvent> {
  const { data, error } = await supabase
    .from('gatherings')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Supabase UPDATE Error]:', error.message);
    throw new Error(error.message);
  }

  return data as GatheringEvent;
}

/**
 * 4. DELETE (Menghapus Data)
 */
export async function deleteGathering(id: string): Promise<void> {
  const { error } = await supabase.from('gatherings').delete().eq('id', id);

  if (error) {
    console.error('[Supabase DELETE Error]:', error.message);
    throw new Error(error.message);
  }
}
