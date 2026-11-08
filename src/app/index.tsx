import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ActivityCard } from '@/components/ActivityCard';
import { CommunityHostCard } from '@/components/CommunityHostCard';
import { DiscussionCard } from '@/components/DiscussionCard';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Loading } from '@/components/Loading';
import { StatCard } from '@/components/StatCard';
import { categoryOptions } from '@/data/hobbies';
import {
  fetchActivities,
  fetchExternalCommunityHosts,
  fetchExternalDiscussions,
  joinActivityWithPromise,
} from '@/services/activityService';
import { getFavorites, toggleFavorite } from '@/services/favoriteService';
import { chipStyles, styles } from '@/styles';
import {
  type CampusDiscussion,
  type CommunityHost,
  type HobbyCategory,
  type HobbyData,
} from '@/types/activity';

type FilterOption = HobbyCategory | 'Semua';
type ActiveTab = 'activities' | 'hosts' | 'discussions';

/**
 * Halaman Utama (HomeScreen): src/app/index.tsx
 * Memenuhi Kriteria Penilaian Modul 3:
 * 
 * 1. Mengambil data dari External API dan memasukkannya ke dalam Object menggunakan Interface (10%):
 *    - Memanggil endpoint eksternal dummyjson.com (users & posts)
 *    - Mengonversi data JSON mentah menjadi Array of Object bertipe CommunityHost & CampusDiscussion
 * 
 * 2. Menggunakan Custom & Pre-built Async Function (10%):
 *    - Pre-built async function: fetch(), response.json(), AsyncStorage.getItem(), AsyncStorage.setItem()
 *    - Custom async function: fetchActivities(), fetchExternalCommunityHosts(), fetchExternalDiscussions(), toggleFavorite()
 * 
 * 3. Menggunakan fungsi .then(), .resolve(), dan .reject() (10%):
 *    - joinActivityWithPromise(): Menggunakan konstruktor Promise dengan callback resolve() dan reject()
 *    - handleQuickJoin(): Menangani Promise menggunakan .then() dan .catch()
 *    - handleRefreshApi(): Menangani API request menggunakan .then() dan .catch()
 */
export default function HomeScreen() {
  // Tab aktif (Kegiatan Kampus | Host External API | Forum Diskusi External API)
  const [activeTab, setActiveTab] = useState<ActiveTab>('activities');

  // State data kegiatan kumpul (HobbyData[])
  const [activityList, setActivityList] = useState<HobbyData[]>([]);

  // State data host mahasiswa hasil fetch dari External API (CommunityHost[])
  const [communityHosts, setCommunityHosts] = useState<CommunityHost[]>([]);

  // State data forum diskusi hasil fetch dari External API (CampusDiscussion[])
  const [discussions, setDiscussions] = useState<CampusDiscussion[]>([]);

  // State daftar ID kegiatan yang difavoritkan di local storage
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // State status asynchronous (Loading & Error)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // State pencarian & filter kategori
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>('Semua');

  /**
   * Custom Async Function: Memuat ulang semua data aplikasi (digunakan saat Retry)
   */
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [activitiesData, favs, hostsData, discussionsData] =
        await Promise.all([
          fetchActivities(),
          getFavorites(),
          fetchExternalCommunityHosts(),
          fetchExternalDiscussions(),
        ]);

      setActivityList(activitiesData);
      setFavoriteIds(favs);
      setCommunityHosts(hostsData);
      setDiscussions(discussionsData);
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Terjadi kegagalan saat mengambil data dari server.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Eksekusi pengambilan data pertama kali dengan Promise chaining (.then & .catch)
  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetchActivities(),
      getFavorites(),
      fetchExternalCommunityHosts(),
      fetchExternalDiscussions(),
    ])
      .then(([activitiesData, favs, hostsData, discussionsData]) => {
        if (!isMounted) return;
        setActivityList(activitiesData);
        setFavoriteIds(favs);
        setCommunityHosts(hostsData);
        setDiscussions(discussionsData);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        const msg =
          error instanceof Error
            ? error.message
            : 'Terjadi kegagalan saat mengambil data dari server.';
        setErrorMessage(msg);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Handler Refresh Data dari External API
   * Menerapkan method .then() dan .catch() sesuai Modul 3 Bab 1.4
   */
  const handleRefreshApi = () => {
    setIsRefreshing(true);

    // Pemanggilan fungsi asynchronous dengan .then() dan .catch()
    fetchExternalCommunityHosts()
      .then((hosts: CommunityHost[]) => {
        setCommunityHosts(hosts);
        return fetchExternalDiscussions();
      })
      .then((disc: CampusDiscussion[]) => {
        setDiscussions(disc);
        Alert.alert(
          'API Call Berhasil! 🚀',
          `Sukses memperbarui ${communityHosts.length} data host dan ${disc.length} topik forum dari external server.`
        );
      })
      .catch((error: Error) => {
        Alert.alert(
          'Gagal Mengambil Data External ❌',
          `Promise rejected: ${error.message}`
        );
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  /**
   * Handler Gabung Kegiatan secara Cepat (Quick Join)
   * Menerapkan Custom Promise dengan fungsi resolve() dan reject()
   * Memenuhi Kriteria Penilaian: "Menggunakan fungsi .then(), .resolve(), dan .reject()"
   */
  const handleQuickJoin = (activity: HobbyData) => {
    // joinActivityWithPromise mengembalikan Promise kustom yang memanggil resolve() atau reject()
    joinActivityWithPromise(activity)
      // .then() dipanggil ketika Promise di-resolve (sukses)
      .then((successMessage: string) => {
        Alert.alert('Berhasil Bergabung! 🎉', successMessage);

        // Update state kegiatan: tambah peserta dan tandai status isJoined
        setActivityList((prevList) =>
          prevList.map((item) =>
            item.id === activity.id
              ? { ...item, members: item.members + 1, isJoined: true }
              : item
          )
        );
      })
      // .catch() dipanggil ketika Promise di-reject (gagal / kuota penuh)
      .catch((error: Error) => {
        Alert.alert('Peringatan Kuota / Bergabung ⚠️', error.message);
      });
  };

  /**
   * Handler Toggle Favorit (AsyncStorage)
   */
  const handleToggleFavorite = async (activityId: string) => {
    try {
      const isNowFav = await toggleFavorite(activityId);
      setFavoriteIds((prev) =>
        isNowFav
          ? [...prev, activityId]
          : prev.filter((id) => id !== activityId)
      );
    } catch {
      Alert.alert('Kesalahan Storage', 'Gagal memperbarui status favorit.');
    }
  };

  // Navigasi ke Halaman Detail Kegiatan (Programmatic Navigation)
  const handleNavigateToDetail = (activity: HobbyData) => {
    const isFav = favoriteIds.includes(activity.id);

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
        isFavorite: isFav ? 'true' : 'false',
      },
    });
  };

  // Filter kegiatan berdasarkan search query dan kategori
  const filteredActivities = useMemo(() => {
    return activityList.filter((item) => {
      const matchCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        query === '' ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });
  }, [activityList, selectedCategory, searchQuery]);

  // Perhitungan total peserta aktif
  const totalActiveParticipants = useMemo(() => {
    return activityList.reduce((acc, curr) => acc + curr.members, 0);
  }, [activityList]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>G</Text>
          </View>
          <Text style={styles.brandName}>GatherIn</Text>

          <View style={{ flexDirection: 'row', marginLeft: 'auto', alignItems: 'center' }}>
            <View style={styles.locationBadge}>
              <Text style={styles.locationBadgeText}>UMM KAMPUS III</Text>
            </View>

            {/* Tombol Menuju Halaman Pencarian */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Pencarian Lengkap"
              onPress={() => router.push('/search' as any)}
              style={styles.favoriteHeaderBtn}>
              <Text>🔍</Text>
              <Text style={styles.favoriteHeaderBtnText}>Cari</Text>
            </Pressable>

            {/* Tombol Menuju Halaman Favorit */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Lihat Favorit"
              onPress={() => router.push('/favorites' as any)}
              style={styles.favoriteHeaderBtn}>
              <Text>❤️</Text>
              <Text style={styles.favoriteHeaderBtnText}>
                {favoriteIds.length > 0 ? `${favoriteIds.length}` : '0'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>● MODUL 3: ASYNC PROGRAMMING & API CALL</Text>
          <Text style={styles.eyebrow}>KOMUNITAS MAHASISWA & TEMAN HOBI</Text>
          <Text style={styles.title}>
            Cari Teman Kumpul{'\n'}
            <Text style={styles.titleAccent}>Sesuai Hobimu.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Mengambil data secara asynchronous via HTTP Request external API,
            Promise handling (.then(), .resolve(), .reject()), dan dynamic routing.
          </Text>
        </View>

        {/* Stat Card Async Metrics */}
        <StatCard
          stats={[
            {
              label: 'Kegiatan Aktif',
              value: activityList.length,
              badge: 'LIVE',
            },
            {
              label: 'Peserta Kumpul',
              value: totalActiveParticipants,
              badge: 'MAHASISWA',
            },
            {
              label: 'External Host',
              value: communityHosts.length > 0 ? communityHosts.length : '...',
              badge: 'DUMMYJSON',
            },
          ]}
        />

        {/* Baris Status Sinkronisasi API Eksternal */}
        <View style={styles.syncButtonRow}>
          <Text style={styles.syncButtonStatusText}>
            {isRefreshing
              ? 'Sedang fetching external API...'
              : 'Sumber: https://dummyjson.com'}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleRefreshApi}
            disabled={isRefreshing}
            style={({ pressed }) => [
              styles.syncButton,
              pressed && styles.syncButtonPressed,
            ]}>
            <Text style={styles.syncButtonText}>
              {isRefreshing ? '⏳ Memuat...' : '🔄 Sinkronkan API (.then)'}
            </Text>
          </Pressable>
        </View>

        {/* Segment Tab Navigasi Modul 3 */}
        <View style={styles.tabSegmentContainer}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setActiveTab('activities')}
            style={[
              styles.tabSegmentItem,
              activeTab === 'activities' && styles.tabSegmentItemActive,
            ]}>
            <Text
              style={[
                styles.tabSegmentText,
                activeTab === 'activities' && styles.tabSegmentTextActive,
              ]}>
              ⚡ Kegiatan Kumpul
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => setActiveTab('hosts')}
            style={[
              styles.tabSegmentItem,
              activeTab === 'hosts' && styles.tabSegmentItemActive,
            ]}>
            <Text
              style={[
                styles.tabSegmentText,
                activeTab === 'hosts' && styles.tabSegmentTextActive,
              ]}>
              🌐 Host Kampus (API)
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => setActiveTab('discussions')}
            style={[
              styles.tabSegmentItem,
              activeTab === 'discussions' && styles.tabSegmentItemActive,
            ]}>
            <Text
              style={[
                styles.tabSegmentText,
                activeTab === 'discussions' && styles.tabSegmentTextActive,
              ]}>
              💬 Forum Diskusi (API)
            </Text>
          </Pressable>
        </View>

        {/* Kondisi Loading & Error Global */}
        {isLoading ? (
          <Loading message="Mengambil data dari External API & Storage..." />
        ) : errorMessage ? (
          <ErrorMessage message={errorMessage} onRetry={loadInitialData} />
        ) : (
          <>
            {/* TAB 1: DAFTAR KEGIATAN MAHASISWA */}
            {activeTab === 'activities' && (
              <>
                {/* Search Bar Section */}
                <View style={styles.searchSection}>
                  <Text style={styles.sectionLabel}>CARI KEGIATAN MAHASISWA</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Cari nama hobi, lokasi, atau deskripsi..."
                    placeholderTextColor="#8B949E"
                    returnKeyType="search"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                  />
                </View>

                {/* Filter Kategori (Chips) */}
                <View style={chipStyles.chipRow}>
                  {categoryOptions.map((option) => {
                    const isActive = option === selectedCategory;
                    return (
                      <Pressable
                        key={option}
                        accessibilityRole="button"
                        onPress={() => setSelectedCategory(option)}
                        style={[
                          chipStyles.chip,
                          isActive && chipStyles.chipActive,
                        ]}>
                        <Text
                          style={[
                            chipStyles.chipText,
                            isActive && chipStyles.chipTextActive,
                          ]}>
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Header Daftar Kegiatan */}
                <View style={styles.listHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>Ajakan Kumpul Hari Ini</Text>
                    <Text style={styles.sectionSubtitle}>
                      Pilih kegiatan dan amankan slotmu (Promise Validation)
                    </Text>
                  </View>
                  <Text style={styles.todayLabel}>LIVE SPONTAN</Text>
                </View>

                {filteredActivities.length === 0 ? (
                  <View style={chipStyles.emptyState}>
                    <Text style={chipStyles.emptyText}>
                      Tidak ada kegiatan yang sesuai dengan &quot;{searchQuery}&quot;.{'\n'}
                      Coba kata kunci atau filter kategori lainnya.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.hobbyList}>
                    {filteredActivities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        isFavorite={favoriteIds.includes(activity.id)}
                        onNavigateDetail={handleNavigateToDetail}
                        onQuickJoin={handleQuickJoin}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </View>
                )}
              </>
            )}

            {/* TAB 2: DATA HOST DARI EXTERNAL API */}
            {activeTab === 'hosts' && (
              <View>
                <View style={styles.listHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>Host Mahasiswa & Leader</Text>
                    <Text style={styles.sectionSubtitle}>
                      Di-fetch dari External API (dummyjson users) & mapped ke Interface
                    </Text>
                  </View>
                  <Text style={styles.todayLabel}>EXTERNAL API</Text>
                </View>

                {communityHosts.map((host) => (
                  <CommunityHostCard
                    key={host.id}
                    host={host}
                    onPressContact={(h) =>
                      Alert.alert(
                        `Ajakan Kolaborasi Kumpul`,
                        `Hubungi host ${h.fullName} (${h.role}) melalui email: ${h.email}`
                      )
                    }
                  />
                ))}
              </View>
            )}

            {/* TAB 3: FORUM DISKUSI DARI EXTERNAL API */}
            {activeTab === 'discussions' && (
              <View>
                <View style={styles.listHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>Forum Diskusi Spontan</Text>
                    <Text style={styles.sectionSubtitle}>
                      Di-fetch dari External API (dummyjson posts) & mapped ke Interface
                    </Text>
                  </View>
                  <Text style={styles.todayLabel}>REST API POSTS</Text>
                </View>

                {discussions.map((item) => (
                  <DiscussionCard key={item.id} discussion={item} />
                ))}
              </View>
            )}
          </>
        )}

        <Text style={styles.footerText}>GATHERIN • MODUL 3 ASYNC & API</Text>
        <Text style={styles.footerSubtext}>
          Laboratorium Informatika • Universitas Muhammadiyah Malang
        </Text>
      </ScrollView>
    </View>
  );
}
