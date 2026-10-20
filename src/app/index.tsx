import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import {
  categoryOptions,
  hobbies,
  type HobbyCategory,
  type HobbyData,
} from '@/data/hobbies';
import { chipStyles, styles } from '@/styles';

type FilterOption = HobbyCategory | 'Semua';

/**
 * Halaman Utama (Home Screen): src/app/index.tsx
 * Memenuhi kriteria Modul 2:
 * 1. Manajemen State & Hooks:
 *    - useState untuk filter pencarian (searchQuery).
 *    - useState untuk status filter kategori (selectedCategory).
 *    - useState untuk melacak data kegiatan & tombol gabung (sisa slot berkurang & status Joined).
 *    - useEffect untuk sinkronisasi / side-effect hasil pencarian.
 *    - useMemo untuk efisiensi perhitungan filtering.
 * 2. Navigasi Berbasis File & Programmatic Navigation:
 *    - router.push() membawa parameter dinamis (id, name, kategori, waktu, lokasi, dsb.)
 *      menuju Dynamic Route /detail/[id].
 */
export default function HomeScreen() {
  // State untuk melacak daftar kegiatan secara dinamis (kuota & status gabung)
  const [activityList, setActivityList] = useState<HobbyData[]>(hobbies);

  // State untuk mengelola filter pencarian (Search Filter)
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State untuk kategori aktif
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>('Semua');

  // Hook useEffect untuk melacak interaksi pencarian (Side-Effect sesuai Modul 2 Bab 2.2)
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      console.log(`[GatherIn Log] Melakukan pencarian kegiatan: "${searchQuery}"`);
    }
  }, [searchQuery]);

  // Hook useMemo (Modul 2 Bab 2.5) untuk mengoptimasi performa pemfilteran kegiatan
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

  // Hitung total peserta yang aktif bergabung
  const totalActiveParticipants = useMemo(() => {
    return activityList.reduce((acc, curr) => acc + curr.members, 0);
  }, [activityList]);

  // Fungsi navigasi programmatic menggunakan router.push() mengirim parameter dinamis
  const handleNavigateToDetail = (activity: HobbyData) => {
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
        isJoined: activity.isJoined ? 'true' : 'false',
      },
    });
  };

  // Handler gabung kegiatan langsung dari kartu (Mengurangi slot & mengubah status jadi Joined)
  const handleQuickJoin = (activityId: string) => {
    setActivityList((prevList) =>
      prevList.map((item) => {
        if (item.id === activityId) {
          if (item.isJoined) {
            Alert.alert('Info', `Kamu sudah terdaftar di kegiatan ${item.name}!`);
            return item;
          }
          if (item.members >= item.maxMembers) {
            Alert.alert('Peringatan', 'Maaf, kuota kegiatan ini sudah penuh!');
            return item;
          }

          Alert.alert(
            'Berhasil Bergabung! 🎉',
            `Kamu berhasil bergabung dengan "${item.name}". Sisa slot berkurang.`
          );

          return {
            ...item,
            members: item.members + 1,
            isJoined: true,
          };
        }
        return item;
      })
    );
  };

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
          <View style={styles.locationBadge}>
            <Text style={styles.locationBadgeText}>KAMPUS UMM</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>● MODUL 2: STATE & ROUTING</Text>
          <Text style={styles.eyebrow}>KOMUNITAS MAHASISWA SPONTAN</Text>
          <Text style={styles.title}>
            Cari Teman Kumpul{'\n'}
            <Text style={styles.titleAccent}>Sesuai Hobimu.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Temukan teman main, olahraga, mabar, dan nongkrong secara spontan di lingkungan kampus.
          </Text>
          <View style={styles.heroFooter}>
            <View style={styles.onlineDot} />
            <Text style={styles.heroFooterText}>
              {filteredActivities.length} kegiatan aktif · {totalActiveParticipants} mahasiswa bergabung
            </Text>
          </View>
        </View>

        {/* Search Bar Section (Input State) */}
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
                style={[chipStyles.chip, isActive && chipStyles.chipActive]}>
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

        {/* Daftar Kegiatan (Activity List) */}
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.sectionTitle}>Ajakan Kumpul Hari Ini</Text>
            <Text style={styles.sectionSubtitle}>Pilih kegiatan dan amankan slotmu</Text>
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
            {filteredActivities.map((activity) => {
              const remainingSlots = Math.max(
                0,
                activity.maxMembers - activity.members
              );

              return (
                <View key={activity.id} style={styles.hobbyCard}>
                  {/* Bagian Atas Kartu */}
                  <View style={styles.cardTopRow}>
                    <Text style={styles.category}>{activity.category}</Text>
                    <View style={styles.slotBadge}>
                      <Text style={styles.slotBadgeText}>
                        {remainingSlots > 0
                          ? `Sisa ${remainingSlots} Slot`
                          : 'Slot Penuh'}
                      </Text>
                    </View>
                  </View>

                  {/* Judul & Deskripsi */}
                  <Text style={styles.hobbyName}>{activity.name}</Text>
                  <Text style={styles.description}>{activity.description}</Text>

                  {/* Info Waktu & Lokasi */}
                  <View style={styles.activityDetails}>
                    <Text style={styles.detailText}>🕒 {activity.time}</Text>
                    <Text style={styles.detailSeparator}>•</Text>
                    <Text style={styles.detailText}>📍 {activity.location}</Text>
                  </View>

                  {/* Tombol Aksi: Navigasi Programmatic & Quick Join */}
                  <View style={styles.cardActionRow}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleNavigateToDetail(activity)}
                      style={({ pressed }) => [
                        styles.joinButton,
                        pressed && styles.joinButtonPressed,
                      ]}>
                      <Text style={styles.joinButtonText}>Detail Kegiatan</Text>
                      <Text style={styles.joinButtonArrow}>↗</Text>
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleQuickJoin(activity.id)}
                      disabled={activity.isJoined || remainingSlots <= 0}
                      style={({ pressed }) => [
                        styles.quickJoinBtn,
                        activity.isJoined && styles.quickJoinBtnJoined,
                        pressed && styles.quickJoinBtnPressed,
                      ]}>
                      <Text
                        style={[
                          styles.quickJoinBtnText,
                          activity.isJoined && styles.quickJoinBtnJoinedText,
                        ]}>
                        {activity.isJoined
                          ? 'Joined ✓'
                          : remainingSlots <= 0
                          ? 'Penuh'
                          : '+ Gabung'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Tombol Buat Ajakan */}
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert(
              'Fitur Mendatang',
              'Form pembuatan ajakan kegiatan baru akan hadir pada modul berikutnya.'
            )
          }
          style={({ pressed }) => [
            styles.createButton,
            pressed && styles.createButtonPressed,
          ]}>
          <Text style={styles.createButtonText}>＋ Buat Ajakan Kumpul Baru</Text>
        </Pressable>

        <Text style={styles.footerText}>KETEMU DI GATHERIN ✦</Text>
        <Text style={styles.footerSubtext}>
          Laboratorium Informatika • Praktikum Pemrograman Mobile
        </Text>
      </ScrollView>
    </View>
  );
}
