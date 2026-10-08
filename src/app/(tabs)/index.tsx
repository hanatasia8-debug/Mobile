import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { categoryOptions, hobbies, type HobbyCategory, type HobbyData } from '@/data/hobbies';

import { chipStyles, styles } from '../../styles';

type FilterOption = HobbyCategory | 'Semua';

// Custom function dengan primitive loop (for) sesuai Modul 1 Hal. 38-39
function countTotalMembers(data: HobbyData[]): number {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += data[i].members;
  }
  return total;
}

function showHobbyAlert(hobbyName: string) {
  Alert.alert('GatherIn', `Kamu memilih kegiatan ${hobbyName}. Sampai jumpa!`);
}

function openDetail(id: string) {
  router.push({ pathname: '/detail', params: { id } });
}

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState<FilterOption>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const visibleHobbies = hobbies.filter((hobby) => {
    const matchCategory =
      activeCategory === 'Semua' || hobby.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchSearch =
      query === '' ||
      hobby.name.toLowerCase().includes(query) ||
      hobby.description.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>G</Text>
          </View>
          <Text style={styles.brandName}>GatherIn</Text>
          <View style={styles.locationBadge}>
            <Text style={styles.locationBadgeText}>KAMPUS</Text>
          </View>
        </View>

        <View style={styles.hero}>
          {/* Inline Styling sesuai Modul 1 Bab 3.3 (Hal. 18-19) */}
          <Text style={{ fontSize: 11, color: '#B9F36A', fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 }}>
            ● KOMUNITAS MAHASISWA AKTIF
          </Text>
          <Text style={styles.eyebrow}>TEMAN BARU, CERITA BARU</Text>
          <Text style={styles.title}>
            Rencana seru{'\n'}dimulai <Text style={styles.titleAccent}>di sini.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Temukan teman untuk kumpul dan melakukan hal yang kamu suka.
          </Text>
          <View style={styles.heroFooter}>
            <View style={styles.onlineDot} />
            <Text style={styles.heroFooterText}>
              {visibleHobbies.length} kegiatan terbuka · {countTotalMembers(visibleHobbies)} peserta ikut
            </Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <Text style={styles.sectionLabel}>MAU NGAPAIN HARI INI?</Text>
          <TextInput
            style={styles.input}
            placeholder="Cari hobi atau kegiatan..."
            placeholderTextColor="#78808F"
            returnKeyType="search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={chipStyles.chipRow}>
          {categoryOptions.map((option) => {
            const isActive = option === activeCategory;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                onPress={() => setActiveCategory(option)}
                style={[chipStyles.chip, isActive && chipStyles.chipActive]}>
                <Text style={[chipStyles.chipText, isActive && chipStyles.chipTextActive]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.sectionTitle}>Lagi ramai</Text>
            <Text style={styles.sectionSubtitle}>Kegiatan spontan dari teman kampus</Text>
          </View>
          <Text style={styles.todayLabel}>UNTUKMU</Text>
        </View>

        {visibleHobbies.length === 0 ? (
          <View style={chipStyles.emptyState}>
            <Text style={chipStyles.emptyText}>
              Belum ada kegiatan yang cocok.{'\n'}Coba kata kunci atau kategori lain.
            </Text>
          </View>
        ) : (
          <View style={styles.hobbyList}>
            {visibleHobbies.map((hobby) => (
              <View key={hobby.id} style={styles.hobbyCard}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.category}>{hobby.category}</Text>
                  <Text style={styles.memberCount}>{hobby.members} ikut</Text>
                </View>
                <Text style={styles.hobbyName}>{hobby.name}</Text>
                <Text style={styles.description}>{hobby.description}</Text>
                <View style={styles.activityDetails}>
                  <Text style={styles.detailText}>{hobby.time}</Text>
                  <Text style={styles.detailSeparator}>·</Text>
                  <Text style={styles.detailText}>{hobby.location}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => openDetail(hobby.id)}
                  style={({ pressed }) => [styles.joinButton, pressed && styles.joinButtonPressed]}>
                  <Text style={styles.joinButtonText}>Lihat kegiatan</Text>
                  <Text style={styles.joinButtonArrow}>↗</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={() => showHobbyAlert('kegiatan baru')}
          style={({ pressed }) => [styles.createButton, pressed && styles.createButtonPressed]}>
          <Text style={styles.createButtonText}>＋  Buat ajakan kumpul</Text>
        </Pressable>

        <Text style={styles.footerText}>KETEMU DI GATHERIN ✦</Text>
        {/* Inline Styling sesuai Modul 1 Bab 3.3 (Hal. 18) */}
        <Text style={{ fontSize: 10, color: '#656B77', textAlign: 'center', marginTop: 4 }}>
          GatherIn • Modul 1 Praktikum Pemrograman Mobile
        </Text>
      </ScrollView>
    </View>
  );
}
