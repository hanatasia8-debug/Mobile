import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ActivityCard } from '@/components/ActivityCard';
import { Loading } from '@/components/Loading';
import { fetchActivities } from '@/services/activityService';
import { getFavorites, toggleFavorite } from '@/services/favoriteService';
import { PALETTE } from '@/styles';
import { type HobbyData } from '@/types/activity';

/**
 * Halaman Pencarian Kegiatan (Search Screen): src/app/search.tsx
 * Sesuai Modul 3 Bab 3 item 13
 * 
 * Menerapkan:
 * 1. Asynchronous searching & filter data
 * 2. Integrasi favoriteService (AsyncStorage)
 * 3. Loading state saat pengambilan data awal
 */
export default function SearchScreen() {
  const [query, setQuery] = useState<string>('');
  const [activities, setActivities] = useState<HobbyData[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchActivities(), getFavorites()])
      .then(([allActivities, favs]) => {
        if (!isMounted) return;
        setActivities(allActivities);
        setFavoriteIds(favs);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[SearchScreen] Gagal mengambil data:', err);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleFavorite = async (activityId: string) => {
    try {
      const isNowFav = await toggleFavorite(activityId);
      setFavoriteIds((prev) =>
        isNowFav
          ? [...prev, activityId]
          : prev.filter((id) => id !== activityId)
      );
    } catch {
      console.error('Gagal toggle favorit');
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
        isFavorite: favoriteIds.includes(activity.id) ? 'true' : 'false',
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

  const filteredResults = activities.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.host.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Search Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>● MODUL 3: ASYNC SEARCH</Text>
          <Text style={styles.title}>Cari Teman & Hobi 🔍</Text>
          <Text style={styles.subtitle}>
            Ketik kata kunci nama kegiatan, lokasi kampus, atau kategori yang kamu cari.
          </Text>
        </View>

        {/* Input Pencarian */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari basket, kopi, game, informatika..."
            placeholderTextColor="#8B949E"
            value={query}
            onChangeText={setQuery}
            autoFocus={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable
              accessibilityRole="button"
              onPress={() => setQuery('')}
              style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Status Hasil */}
        <View style={styles.resultMeta}>
          <Text style={styles.resultCountText}>
            Ditemukan {filteredResults.length} kegiatan
          </Text>
          {query.length > 0 && (
            <Text style={styles.queryBadge}>Keyword: &quot;{query}&quot;</Text>
          )}
        </View>

        {/* Loading Indicator */}
        {isLoading ? (
          <Loading message="Mengambil daftar kegiatan..." />
        ) : filteredResults.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Tidak Ada Hasil</Text>
            <Text style={styles.emptyText}>
              Tidak ditemukan kegiatan yang cocok dengan &quot;{query}&quot;. Coba gunakan kata kunci yang lebih umum.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredResults.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isFavorite={favoriteIds.includes(activity.id)}
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
    marginBottom: 16,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161B22',
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: PALETTE.textPrimary,
    fontSize: 14,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    color: PALETTE.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultCountText: {
    color: PALETTE.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  queryBadge: {
    color: PALETTE.accentLime,
    fontSize: 11,
    fontWeight: '700',
  },
  list: {
    gap: 6,
  },
  emptyCard: {
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
    marginBottom: 10,
  },
  emptyTitle: {
    color: PALETTE.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    color: PALETTE.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
});

