import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Service untuk mengelola data favorit secara asynchronous
 * Sesuai Modul 3 Bab 3 (service/favoriteService.ts) & Modul 4
 * 
 * Menerapkan:
 * - Pre-built Async Function: AsyncStorage.getItem & AsyncStorage.setItem
 * - Custom Async Function: getFavorites, toggleFavorite, isFavorite
 */

const FAVORITES_STORAGE_KEY = '@gatherin_favorites_v1';

/**
 * Custom Async Function untuk mengambil daftar ID kegiatan yang difavoritkan
 */
export async function getFavorites(): Promise<string[]> {
  try {
    // Memanggil pre-built async function getItem dengan await
    const jsonValue = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    if (jsonValue != null) {
      const parsed: unknown = JSON.parse(jsonValue);
      if (Array.isArray(parsed)) {
        return parsed as string[];
      }
    }
    return [];
  } catch (error) {
    console.error('[favoriteService] Gagal membaca favorit dari storage:', error);
    return [];
  }
}

/**
 * Custom Async Function untuk toggle status favorit (tambah / hapus)
 * @returns boolean status baru (true jika sekarang favorit, false jika dihapus)
 */
export async function toggleFavorite(activityId: string): Promise<boolean> {
  try {
    const currentFavorites = await getFavorites();
    const index = currentFavorites.indexOf(activityId);
    let updated: string[];
    let isNowFavorited = false;

    if (index >= 0) {
      // Hapus dari favorit
      updated = currentFavorites.filter((id) => id !== activityId);
      isNowFavorited = false;
    } else {
      // Tambahkan ke favorit
      updated = [...currentFavorites, activityId];
      isNowFavorited = true;
    }

    // Memanggil pre-built async function setItem dengan await
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    return isNowFavorited;
  } catch (error) {
    console.error('[favoriteService] Gagal mengubah status favorit:', error);
    throw error;
  }
}

/**
 * Custom Async Function untuk memeriksa apakah kegiatan tertentu berstatus favorit
 */
export async function isFavorite(activityId: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(activityId);
}

