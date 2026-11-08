import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard } from '@/components/ActivityCard';
import { Loading } from '@/components/Loading';
import { fetchActivities } from '@/services/activityService';
import { getFavorites, toggleFavorite } from '@/services/favoriteService';
import { PALETTE } from '@/styles';
import { type HobbyData } from '@/types/activity';

/**
 * Halaman Favorit (Favorites Screen)
 * Sesuai Modul 3 Bab 3 (app/favorites.tsx) & Modul 4 (Local Storage)
 * 
 * Menggunakan:
 * - Custom Async Function dari favoriteService (getFavorites, toggleFavorite)
 * - State management untuk sinkronisasi daftar favorit
 * - Penanganan loading asynchronous
 */
export default function FavoritesScreen() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [activities, setActivities] = useState<HobbyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mengambil daftar favorit secara asynchronous saat komponen dimuat
  useEffect(() => {
    let isMounted = true;

    // Memuat data favorit dan kegiatan menggunakan Promise chaining
    Promise.all([getFavorites(), fetchActivities()])
      .then(([favs, allActivities]) => {
        if (!isMounted) return;
        setFavoriteIds(favs);
        setActivities(allActivities);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        console.error('[FavoritesScreen] Gagal memuat favorit:', error);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleFavorite = async (activityId: string) => {
    try {
      await toggleFavorite(activityId);
      // Update state ID favorit
      setFavoriteIds((prev) =>
        prev.includes(activityId)
          ? prev.filter((id) => id !== activityId)
          : [...prev, activityId]
      );
    } catch (error) {
      console.error('[FavoritesScreen] Gagal toggle favorit:', error);
    }
  };

  const handleNavigateDetail = (activity: HobbyData) => {
    router.push({
      pathname: '/detail/[id]',
      params: {
        id: activity.id,
        name: activity.name,
        category: activity.category,
        description: activity.description,
        location: activity.location,
        time: activity.time,
        members: String(activity.members),
        maxMembers: String(activity.maxMembers),
        host: activity.host,
        hostAvatar: activity.hostAvatar,
        isJoined: activity.isJoined ? 'true' : 'false',
        isFavorite: 'true',
      },
    });
  };

  const handleQuickJoin = (activity: HobbyData) => {
    setActivities((prev) =>
      prev.map((item) =>
        item.id === activity.id
          ? { ...item, members: item.members + 1, isJoined: true }
          : item
      )
    );
  };

  const favoriteActivities = activities.filter((item) =>
    favoriteIds.includes(item.id)
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>● MODUL 3: ASYNC STORAGE FAVORITES</Text>
          <Text style={styles.title}>Kegiatan Favorit Kamu ❤️</Text>
          <Text style={styles.subtitle}>
            Daftar kegiatan kumpul yang kamu simpan ke penyimpanan lokal perangkat.
          </Text>
        </View>

        {isLoading ? (
          <Loading message="Memuat data favorit dari storage..." />
        ) : favoriteActivities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyTitle}>Belum Ada Kegiatan Favorit</Text>
            <Text style={styles.emptyText}>
              Tekan ikon hati (🤍) pada kartu kegiatan di halaman utama untuk
              menambahkan kegiatan ke daftar favoritmu.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.backButton}>
              <Text style={styles.backButtonText}>← Eksplor Kegiatan Sekarang</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {favoriteActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isFavorite={true}
                onNavigateDetail={handleNavigateDetail}
                onQuickJoin={handleQuickJoin}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  content: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  eyebrow: {
    color: PALETTE.accentCyan,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    color: PALETTE.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    color: PALETTE.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  list: {
    gap: 8,
  },
  emptyContainer: {
    padding: 30,
    borderRadius: 18,
    backgroundColor: PALETTE.cardBg,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    color: PALETTE.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    color: PALETTE.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: PALETTE.accentLime,
  },
  backButtonText: {
    color: '#0D1117',
    fontSize: 13,
    fontWeight: '700',
  },
});
