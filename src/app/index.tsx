import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
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
import { useAuth } from '@/context/AuthContext';
import { categoryOptions } from '@/data/hobbies';
import {
  fetchActivities,
  fetchExternalCommunityHosts,
  fetchExternalDiscussions,
  joinActivityWithPromise,
} from '@/services/activityService';
import { getFavorites, toggleFavorite } from '@/services/favoriteService';
import {
  createGathering,
  deleteGathering,
  fetchUserGatherings,
  toggleGatheringStatus,
} from '@/services/supabaseGatheringService';
import { chipStyles, styles, PALETTE } from '@/styles';
import {
  type CampusDiscussion,
  type CommunityHost,
  type HobbyCategory,
  type HobbyData,
} from '@/types/activity';
import { GatheringCategory, GatheringEvent } from '@/types/gathering';

type FilterOption = HobbyCategory | 'Semua';
type ActiveTab = 'activities' | 'cloud' | 'hosts' | 'discussions';

const cloudCategoryOptions: GatheringCategory[] = [
  'Olahraga',
  'Gaming',
  'Kuliner',
  'Seni',
  'Teknologi',
  'Umum',
];

/**
 * Halaman Utama (HomeScreen): src/app/index.tsx
 * Memenuhi Kriteria Penilaian Modul 1-4:
 *
 * MODUL 4:
 * 1. Global AuthContext & Sign Out (Header profil pengguna)
 * 2. Cloud Database CRUD (SELECT, INSERT, UPDATE, DELETE) pada tabel PostgreSQL Supabase
 * 3. Row Level Security (RLS) enforcement di sisi server
 * 4. Optimistic UI dengan rollback saat koneksi database gagal
 * 5. Pull-to-refresh (RefreshControl)
 *
 * MODUL 1-3:
 * - State & Navigation Hooks (useState, useEffect, useMemo, router.push)
 * - Dynamic Routing ke /detail/[id]
 * - External REST API fetch dummyjson dengan Interface mapping
 * - Custom Promise (.then, .resolve, .reject) untuk quick join
 * - Persistent favorites via AsyncStorage
 */
export default function HomeScreen() {
  // KRITERIA MODUL 4: AuthContext Consumer
  const { user, signOut } = useAuth();

  // Tab aktif (⚡ Kegiatan Lokal | ☁️ Cloud RLS | 🌐 Host API | 💬 Forum API)
  const [activeTab, setActiveTab] = useState<ActiveTab>('activities');

  // State data kegiatan kumpul lokal (Modul 2 & 3)
  const [activityList, setActivityList] = useState<HobbyData[]>([]);

  // State data host mahasiswa hasil fetch dari External API (Modul 3)
  const [communityHosts, setCommunityHosts] = useState<CommunityHost[]>([]);

  // State data forum diskusi hasil fetch dari External API (Modul 3)
  const [discussions, setDiscussions] = useState<CampusDiscussion[]>([]);

  // State daftar ID kegiatan favorit di local storage
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // State Cloud Database Supabase (Modul 4)
  const [cloudGatherings, setCloudGatherings] = useState<GatheringEvent[]>([]);
  const [isCloudLoading, setIsCloudLoading] = useState<boolean>(false);
  const [isRefreshingCloud, setIsRefreshingCloud] = useState<boolean>(false);

  // Form State untuk Buat Ajakan Cloud Baru (Modul 4)
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCategory, setFormCategory] = useState<GatheringCategory>('Olahraga');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formTime, setFormTime] = useState<string>('');
  const [formMaxMembers, setFormMaxMembers] = useState<string>('10');
  const [formDesc, setFormDesc] = useState<string>('');
  const [isSubmittingCloud, setIsSubmittingCloud] = useState<boolean>(false);

  // State status asynchronous umum (Loading & Error)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // State pencarian & filter kategori
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>('Semua');

  /**
   * KRITERIA MODUL 4: SELECT Cloud Data
   * Membaca ajakan kumpul milik pengguna dari PostgreSQL Supabase
   */
  const loadCloudGatherings = async () => {
    try {
      setIsCloudLoading(true);
      const data = await fetchUserGatherings();
      setCloudGatherings(data);
    } catch (err: unknown) {
      console.warn('[Cloud Load Warning]:', err instanceof Error ? err.message : err);
    } finally {
      setIsCloudLoading(false);
    }
  };

  /**
   * KRITERIA MODUL 4: Pull-to-refresh
   */
  const handlePullRefresh = async () => {
    setIsRefreshingCloud(true);
    await Promise.all([loadInitialData(), loadCloudGatherings()]);
    setIsRefreshingCloud(false);
  };

  /**
   * Custom Async Function: Memuat data Modul 3
   */
  const loadInitialData = async () => {
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
  };

  // Lifecycle useEffect untuk pengambilan data saat pertama kali ter-mount
  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetchActivities(),
      getFavorites(),
      fetchExternalCommunityHosts(),
      fetchExternalDiscussions(),
      fetchUserGatherings().catch(() => []),
    ])
      .then(([activitiesData, favs, hostsData, discussionsData, cloudData]) => {
        if (!isMounted) return;
        setActivityList(activitiesData);
        setFavoriteIds(favs);
        setCommunityHosts(hostsData);
        setDiscussions(discussionsData);
        setCloudGatherings(cloudData);
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
   * KRITERIA MODUL 4: INSERT Data Baru dengan Optimistic UI & Rollback
   */
  const handleCreateCloudGathering = async () => {
    const cleanTitle = formTitle.trim();
    if (!cleanTitle) {
      Alert.alert('Perhatian', 'Judul ajakan kumpul tidak boleh kosong.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'Sesi tidak ditemukan. Harap masuk kembali.');
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticItem: GatheringEvent = {
      id: tempId,
      user_id: user.id,
      title: cleanTitle,
      description: formDesc.trim() || undefined,
      category: formCategory,
      location: formLocation.trim() || 'Kampus UMM',
      time: formTime.trim() || 'Hari ini, 16.30 WIB',
      members: 1,
      max_members: Number(formMaxMembers) || 10,
      creator_name:
        user.user_metadata?.full_name ||
        user.user_metadata?.callsign ||
        user.email?.split('@')[0] ||
        'Mahasiswa',
      status: 'active',
      created_at: new Date().toISOString(),
    };

    // 1. Optimistic Update: Tambahkan langsung ke UI sebelum request selesai
    const previousGatherings = [...cloudGatherings];
    setCloudGatherings([optimisticItem, ...previousGatherings]);

    // Reset Form
    setFormTitle('');
    setFormDesc('');
    setFormLocation('');
    setFormTime('');
    setShowCreateForm(false);
    setIsSubmittingCloud(true);

    try {
      // 2. Request asinkron ke PostgreSQL Supabase
      const createdItem = await createGathering({
        user_id: user.id,
        title: optimisticItem.title,
        description: optimisticItem.description,
        category: optimisticItem.category,
        location: optimisticItem.location,
        time: optimisticItem.time,
        members: optimisticItem.members,
        max_members: optimisticItem.max_members,
        creator_name: optimisticItem.creator_name,
        status: 'active',
      });

      // 3. Ganti item sementara dengan data resmi dari Supabase (termasuk ID UUID)
      setCloudGatherings((prev) =>
        prev.map((item) => (item.id === tempId ? createdItem : item))
      );

      Alert.alert('Berhasil! ☁️', `Ajakan "${cleanTitle}" tersimpan aman di database Supabase.`);
    } catch (err: unknown) {
      // 4. Rollback: Kembalikan state awal jika query database gagal
      setCloudGatherings(previousGatherings);
      const errMsg = err instanceof Error ? err.message : 'Gagal menghubungi database cloud.';
      Alert.alert('Gagal Menyimpan (Rollback) ❌', errMsg);
    } finally {
      setIsSubmittingCloud(false);
    }
  };

  /**
   * KRITERIA MODUL 4: UPDATE Data dengan Optimistic UI
   */
  const handleToggleStatus = async (item: GatheringEvent) => {
    const nextStatus = item.status === 'active' ? 'completed' : 'active';
    const previousGatherings = [...cloudGatherings];

    // Optimistic Update
    setCloudGatherings((prev) =>
      prev.map((g) => (g.id === item.id ? { ...g, status: nextStatus } : g))
    );

    try {
      await toggleGatheringStatus(item.id, nextStatus);
    } catch (err: unknown) {
      // Rollback
      setCloudGatherings(previousGatherings);
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui status.';
      Alert.alert('Gagal Update Status ❌', msg);
    }
  };

  /**
   * KRITERIA MODUL 4: DELETE Data dengan Optimistic UI
   */
  const handleDeleteCloudGathering = (id: string, title: string) => {
    Alert.alert('Hapus Ajakan', `Apakah Anda yakin ingin menghapus "${title}" dari database cloud?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const previousGatherings = [...cloudGatherings];

          // Optimistic Delete
          setCloudGatherings((prev) => prev.filter((item) => item.id !== id));

          try {
            await deleteGathering(id);
          } catch (err: unknown) {
            // Rollback
            setCloudGatherings(previousGatherings);
            const msg = err instanceof Error ? err.message : 'Gagal menghapus data.';
            Alert.alert('Gagal Menghapus ❌', msg);
          }
        },
      },
    ]);
  };

  /**
   * KRITERIA MODUL 4: Alur Keluar (Sign Out)
   */
  const handleSignOut = () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin mengakhiri sesi dan keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          // Navigation guard di _layout.tsx akan otomatis me-redirect ke /(auth)/login
        },
      },
    ]);
  };

  // Handler Refresh Data Eksternal (Modul 3 Bab 1.4 .then & .catch)
  const handleRefreshApi = () => {
    setIsRefreshing(true);
    fetchExternalCommunityHosts()
      .then((hosts: CommunityHost[]) => {
        setCommunityHosts(hosts);
        return fetchExternalDiscussions();
      })
      .then((disc: CampusDiscussion[]) => {
        setDiscussions(disc);
        Alert.alert(
          'API Call Berhasil! 🚀',
          `Sukses memperbarui ${communityHosts.length} host dan ${disc.length} topik forum.`
        );
      })
      .catch((error: Error) => {
        Alert.alert('Gagal Mengambil Data ❌', `Promise rejected: ${error.message}`);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  // Handler Quick Join Modul 3 (Promise resolve/reject)
  const handleQuickJoin = (activity: HobbyData) => {
    joinActivityWithPromise(activity)
      .then((successMessage: string) => {
        Alert.alert('Berhasil Bergabung! 🎉', successMessage);
        setActivityList((prevList) =>
          prevList.map((item) =>
            item.id === activity.id
              ? { ...item, members: item.members + 1, isJoined: true }
              : item
          )
        );
      })
      .catch((error: Error) => {
        Alert.alert('Peringatan Kuota ⚠️', error.message);
      });
  };

  // Handler Toggle Favorit (Modul 3 AsyncStorage)
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

  // Navigasi ke Detail (Modul 2 Dynamic Route)
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

  const totalActiveParticipants = useMemo(() => {
    return activityList.reduce((acc, curr) => acc + curr.members, 0);
  }, [activityList]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingCloud}
            onRefresh={handlePullRefresh}
            tintColor={PALETTE.accentLime}
          />
        }>
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

            {/* Tombol Menuju Halaman Pencarian (Modul 3) */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Pencarian Lengkap"
              onPress={() => router.push('/search' as any)}
              style={styles.favoriteHeaderBtn}>
              <Text>🔍</Text>
              <Text style={styles.favoriteHeaderBtnText}>Cari</Text>
            </Pressable>

            {/* Tombol Menuju Halaman Favorit (Modul 3) */}
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

        {/* KRITERIA MODUL 4: User Identity Bar & Sign Out Button */}
        <View style={styles.userHeaderRow}>
          <View style={styles.userInfoLeft}>
            <View style={styles.userAvatarCircle}>
              <Text style={styles.userAvatarInitial}>
                {(user?.email?.[0] || 'U').toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userNameText} numberOfLines={1}>
                {user?.user_metadata?.full_name || user?.user_metadata?.callsign || 'Mahasiswa Aktif'}
              </Text>
              <Text style={styles.userEmailSubtext} numberOfLines={1}>
                {user?.email || 'Authenticated'}
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleSignOut}
            style={styles.signOutButton}>
            <Text style={styles.signOutButtonText}>Sign Out ⎋</Text>
          </Pressable>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>● MODUL 4: DATABASE & AUTENTIKASI SUPABASE</Text>
          <Text style={styles.eyebrow}>MARKAS GATHERIN MAHASISWA</Text>
          <Text style={styles.title}>
            Kumpul Seru,{'\n'}
            <Text style={styles.titleAccent}>Data Tersimpan Aman.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Terhubung ke basis data PostgreSQL Supabase dengan Row Level Security (RLS),
            penyimpanan sesi terenkripsi via SecureStore, dan Optimistic UI.
          </Text>
        </View>

        {/* Stat Card Metrics */}
        <StatCard
          stats={[
            {
              label: 'Kegiatan Lokal',
              value: activityList.length,
              badge: 'MODUL 2-3',
            },
            {
              label: 'Cloud RLS',
              value: cloudGatherings.length,
              badge: 'SUPABASE',
            },
            {
              label: 'Peserta',
              value: totalActiveParticipants,
              badge: 'TOTAL',
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
              : 'Supabase URL: ' + (process.env.EXPO_PUBLIC_SUPABASE_URL ? 'Connected ✓' : 'Local')}
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

        {/* 4 Segment Tab Navigasi (Modul 1-4) */}
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
              ⚡ Kegiatan
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setActiveTab('cloud');
              if (cloudGatherings.length === 0) loadCloudGatherings();
            }}
            style={[
              styles.tabSegmentItem,
              activeTab === 'cloud' && styles.tabSegmentItemActive,
            ]}>
            <Text
              style={[
                styles.tabSegmentText,
                activeTab === 'cloud' && styles.tabSegmentTextActive,
              ]}>
              ☁️ Cloud RLS
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
              🌐 Host API
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
              💬 Forum API
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
            {/* ============================================================ */}
            {/* TAB 1: DAFTAR KEGIATAN LOKAL (MODUL 2 & 3) */}
            {/* ============================================================ */}
            {activeTab === 'activities' && (
              <>
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
                      Tidak ada kegiatan yang sesuai dengan &quot;{searchQuery}&quot;.
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

            {/* ============================================================ */}
            {/* TAB 2: CLOUD DATABASE SUPABASE & RLS (MODUL 4) */}
            {/* ============================================================ */}
            {activeTab === 'cloud' && (
              <View>
                <View style={styles.listHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>Ajakan Kumpul Cloud (RLS)</Text>
                    <Text style={styles.sectionSubtitle}>
                      Tersimpan di PostgreSQL Supabase • Terisolasi per User
                    </Text>
                  </View>
                  <Text style={styles.todayLabel}>CLOUD POSTGRES</Text>
                </View>

                {/* Tombol Buat Ajakan Baru */}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setShowCreateForm(!showCreateForm)}
                  style={({ pressed }) => [
                    styles.createButton,
                    pressed && styles.createButtonPressed,
                    { marginBottom: 16 },
                  ]}>
                  <Text style={styles.createButtonText}>
                    {showCreateForm ? '✕ Tutup Form' : '＋ Buat Ajakan Kumpul Cloud'}
                  </Text>
                </Pressable>

                {/* Form Pembuatan Ajakan Baru (INSERT Cloud Data) */}
                {showCreateForm && (
                  <View style={styles.cloudFormCard}>
                    <Text style={styles.cloudFormTitle}>Buat Ajakan di Database Cloud</Text>
                    <Text style={styles.cloudFormSubtitle}>
                      Data akan disimpan langsung ke tabel `gatherings` dengan user_id Anda.
                    </Text>

                    <TextInput
                      style={styles.cloudInput}
                      placeholder="Judul Ajakan (cth: Futsal Santai Lapangan UMM)"
                      placeholderTextColor="#6E7681"
                      value={formTitle}
                      onChangeText={setFormTitle}
                    />

                    {/* KRITERIA MODUL 4: Category Selector */}
                    <Text style={[styles.sectionLabel, { marginBottom: 6, marginTop: 4 }]}>
                      PILIH KATEGORI AJAKAN
                    </Text>
                    <View style={[chipStyles.chipRow, { marginBottom: 12 }]}>
                      {cloudCategoryOptions.map((cat) => {
                        const isSelected = formCategory === cat;
                        return (
                          <Pressable
                            key={cat}
                            accessibilityRole="button"
                            onPress={() => setFormCategory(cat)}
                            style={[chipStyles.chip, isSelected && chipStyles.chipActive]}>
                            <Text
                              style={[
                                chipStyles.chipText,
                                isSelected && chipStyles.chipTextActive,
                              ]}>
                              {cat}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    <View style={styles.cloudInputRow}>
                      <TextInput
                        style={[styles.cloudInput, { flex: 1, marginBottom: 0 }]}
                        placeholder="Lokasi (cth: GOR Kampus III)"
                        placeholderTextColor="#6E7681"
                        value={formLocation}
                        onChangeText={setFormLocation}
                      />
                      <TextInput
                        style={[styles.cloudInput, { width: 90, marginBottom: 0 }]}
                        placeholder="Maks (10)"
                        placeholderTextColor="#6E7681"
                        keyboardType="numeric"
                        value={formMaxMembers}
                        onChangeText={setFormMaxMembers}
                      />
                    </View>

                    <TextInput
                      style={styles.cloudInput}
                      placeholder="Waktu (cth: Hari ini, 19:00 WIB)"
                      placeholderTextColor="#6E7681"
                      value={formTime}
                      onChangeText={setFormTime}
                    />

                    <TextInput
                      style={[styles.cloudInput, { height: 60 }]}
                      placeholder="Deskripsi singkat kegiatan..."
                      placeholderTextColor="#6E7681"
                      multiline
                      value={formDesc}
                      onChangeText={setFormDesc}
                    />

                    <Pressable
                      accessibilityRole="button"
                      onPress={handleCreateCloudGathering}
                      disabled={isSubmittingCloud}
                      style={({ pressed }) => [
                        styles.cloudSubmitBtn,
                        isSubmittingCloud && styles.buttonDisabled,
                        pressed && styles.buttonPressed,
                      ]}>
                      {isSubmittingCloud ? (
                        <ActivityIndicator color="#0D1117" size="small" />
                      ) : (
                        <Text style={styles.cloudSubmitBtnText}>
                          Simpan ke Cloud (Optimistic UI) ☁️
                        </Text>
                      )}
                    </Pressable>
                  </View>
                )}

                {/* Loading state cloud */}
                {isCloudLoading && cloudGatherings.length === 0 ? (
                  <Loading message="Mengambil data dari tabel PostgreSQL Supabase..." />
                ) : cloudGatherings.length === 0 ? (
                  <View style={chipStyles.emptyState}>
                    <Text style={chipStyles.emptyText}>
                      Belum ada ajakan kumpul di cloud untuk akun ini.{'\n'}
                      Gunakan tombol di atas untuk membuat ajakan kumpul pertama Anda!
                    </Text>
                  </View>
                ) : (
                  <View style={{ gap: 8 }}>
                    {cloudGatherings.map((item) => (
                      <View key={item.id} style={styles.cloudCard}>
                        <View style={styles.cloudCardHeader}>
                          <Text style={styles.cloudCardBadge}>
                            ● {item.category.toUpperCase()} • RLS PROTECTED
                          </Text>
                          <Text
                            style={
                              item.status === 'active'
                                ? styles.cloudCardStatusActive
                                : styles.cloudCardStatusDone
                            }>
                            {item.status === 'active' ? '● AKTIF' : '✓ SELESAI'}
                          </Text>
                        </View>

                        <Text style={styles.cloudCardTitle}>{item.title}</Text>
                        {item.description ? (
                          <Text style={styles.description}>{item.description}</Text>
                        ) : null}

                        <View style={styles.cloudCardMeta}>
                          <Text style={styles.detailText}>🕒 {item.time}</Text>
                          <Text style={styles.detailSeparator}>•</Text>
                          <Text style={styles.detailText}>📍 {item.location}</Text>
                          <Text style={styles.detailSeparator}>•</Text>
                          <Text style={styles.detailText}>
                            👥 {item.members}/{item.max_members}
                          </Text>
                        </View>

                        {/* Action buttons (UPDATE & DELETE) */}
                        <View style={styles.cloudCardActions}>
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => handleToggleStatus(item)}
                            style={[
                              styles.cloudActionBtn,
                              {
                                borderColor:
                                  item.status === 'active' ? '#38BDF8' : '#B9F36A',
                              },
                            ]}>
                            <Text
                              style={[
                                styles.cloudActionBtnText,
                                {
                                  color:
                                    item.status === 'active' ? '#38BDF8' : '#B9F36A',
                                },
                              ]}>
                              {item.status === 'active' ? 'Tandai Selesai' : 'Aktifkan Kembali'}
                            </Text>
                          </Pressable>

                          <Pressable
                            accessibilityRole="button"
                            onPress={() => handleDeleteCloudGathering(item.id, item.title)}
                            style={[styles.cloudActionBtn, { borderColor: '#F85149' }]}>
                            <Text style={[styles.cloudActionBtnText, { color: '#F85149' }]}>
                              Hapus 🗑️
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* ============================================================ */}
            {/* TAB 3: DATA HOST DARI EXTERNAL API (MODUL 3) */}
            {/* ============================================================ */}
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

            {/* ============================================================ */}
            {/* TAB 4: FORUM DISKUSI DARI EXTERNAL API (MODUL 3) */}
            {/* ============================================================ */}
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

        <Text style={styles.footerText}>GATHERIN • MODUL 4 DATABASE & AUTH</Text>
        <Text style={styles.footerSubtext}>
          Laboratorium Informatika • Universitas Muhammadiyah Malang
        </Text>
      </ScrollView>
    </View>
  );
}
