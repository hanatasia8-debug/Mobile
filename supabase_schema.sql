-- ==============================================================================
-- KRITERIA MODUL 4: Cloud Database & Row Level Security (RLS)
-- File: supabase_schema.sql
-- Tema Aplikasi: GatherIn (Komunitas & Kumpul Mahasiswa UMM)
-- ==============================================================================
-- Petunjuk:
-- 1. Buka Supabase Dashboard Anda (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Buka menu "SQL Editor" di bilah kiri
-- 3. Tempel seluruh kode SQL ini, lalu klik tombol "Run"
-- ==============================================================================

-- 1. Buat Tabel `gatherings`
CREATE TABLE IF NOT EXISTS public.gatherings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Olahraga',
  location TEXT NOT NULL DEFAULT 'Area Kampus UMM',
  time TEXT NOT NULL DEFAULT 'Hari ini, 16.30 WIB',
  members INTEGER NOT NULL DEFAULT 1,
  max_members INTEGER NOT NULL DEFAULT 10,
  creator_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index untuk mempercepat query berdasarkan user_id dan created_at
CREATE INDEX IF NOT EXISTS idx_gatherings_user_id ON public.gatherings(user_id);
CREATE INDEX IF NOT EXISTS idx_gatherings_created_at ON public.gatherings(created_at DESC);

-- 2. Aktifkan Row Level Security (RLS) pada tabel `gatherings`
ALTER TABLE public.gatherings ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan RLS: SELECT (Hanya user pemilik data yang dapat membaca)
-- Memenuhi kriteria Pengujian Isolasi Data (Multi-tenancy): User A tidak melihat data User B
DROP POLICY IF EXISTS "Users can view own gatherings" ON public.gatherings;
CREATE POLICY "Users can view own gatherings"
  ON public.gatherings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Kebijakan RLS: INSERT (User hanya bisa menambahkan data dengan user_id mereka sendiri)
DROP POLICY IF EXISTS "Users can insert own gatherings" ON public.gatherings;
CREATE POLICY "Users can insert own gatherings"
  ON public.gatherings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5. Kebijakan RLS: UPDATE (User hanya bisa mengubah data miliknya sendiri)
DROP POLICY IF EXISTS "Users can update own gatherings" ON public.gatherings;
CREATE POLICY "Users can update own gatherings"
  ON public.gatherings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Kebijakan RLS: DELETE (User hanya bisa menghapus data miliknya sendiri)
DROP POLICY IF EXISTS "Users can delete own gatherings" ON public.gatherings;
CREATE POLICY "Users can delete own gatherings"
  ON public.gatherings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
