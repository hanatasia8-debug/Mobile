import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// KRITERIA MODUL 4: KEAMANAN KREDENSIAL - DILARANG hardcode URL & Anon Key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_KEY ||
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase Warning] EXPO_PUBLIC_SUPABASE_URL atau EXPO_PUBLIC_SUPABASE_ANON_KEY belum terpasang di .env!'
  );
}

/**
 * KRITERIA MODUL 4: Secure Token Storage
 * Menggunakan expo-secure-store untuk penyimpanan sesi JWT terenkripsi di hardware
 * (iOS Keychain & Android Keystore). DILARANG menggunakan AsyncStorage untuk token/sesi.
 */
const ExpoSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> | string | null => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> | void => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> | void => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

/**
 * KRITERIA MODUL 4: Singleton Supabase Client
 * Terkonfigurasi dengan persistSession=true dan storage=ExpoSecureStoreAdapter
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
