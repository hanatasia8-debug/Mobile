import { Pressable, ScrollView, Text, View } from 'react-native';

import { hobbies } from '@/data/hobbies';
import { useLocalSearchParams } from 'expo-router';

import { detailStyles as styles } from '../styles';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const hobby = hobbies.find((item) => item.id === id);

  if (!hobby) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Kegiatan tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.category}>{hobby.category}</Text>
            <Text style={styles.memberCount}>{hobby.members} ikut</Text>
          </View>

          <Text style={styles.hobbyName}>{hobby.name}</Text>
          <Text style={styles.description}>{hobby.description}</Text>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Waktu</Text>
            <Text style={styles.detailValue}>{hobby.time}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Lokasi</Text>
            <Text style={styles.detailValue}>{hobby.location}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Peserta</Text>
            <Text style={styles.detailValue}>{hobby.members} orang terdaftar</Text>
          </View>

          {/* Inline Styling sesuai Modul 1 Bab 3.3 (Hal. 18) */}
          <View style={{ marginTop: 16, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#21262D', borderRadius: 8, alignSelf: 'flex-start' }}>
            <Text style={{ color: '#B9F36A', fontSize: 11, fontWeight: '600' }}>
              ● Terbuka untuk mahasiswa
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.joinButton, pressed && styles.joinButtonPressed]}>
            <Text style={styles.joinButtonText}>Gabung kegiatan</Text>
            <Text style={styles.joinButtonArrow}>↗</Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>KETEMU DI GATHERIN ✦</Text>
      </ScrollView>
    </View>
  );
}
