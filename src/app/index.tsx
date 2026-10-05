import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { styles } from '../styles';

type HobbyCategory = 'Olahraga' | 'Gaming' | 'Kuliner' | 'Seni';

interface HobbyData {
  id: string;
  name: string;
  description: string;
  category: HobbyCategory;
  location: string;
  time: string;
  members: number;
}

const hobbies: HobbyData[] = [
  {
    id: 'basket',
    name: 'Basket sore',
    description: 'Cari teman untuk main santai, semua level boleh ikut.',
    category: 'Olahraga',
    location: 'Lapangan Kampus A',
    time: 'Hari ini, 16.30',
    members: 4,
  },
  {
    id: 'boardgame',
    name: 'Board game night',
    description: 'Ngobrol dan main board game bareng setelah kelas.',
    category: 'Gaming',
    location: 'Student Lounge',
    time: 'Hari ini, 19.00',
    members: 3,
  },
  {
    id: 'coffee',
    name: 'Jajan kopi keliling',
    description: 'Jelajahi kedai kopi baru di sekitar kampus.',
    category: 'Kuliner',
    location: 'Gerbang Utama',
    time: 'Besok, 10.00',
    members: 2,
  },
  {
    id: 'sketch',
    name: 'Sketch & chill',
    description: 'Bawa sketchbook, gambar bebas sambil bertukar ide.',
    category: 'Seni',
    location: 'Taman Fakultas',
    time: 'Besok, 15.30',
    members: 5,
  },
];

function showHobbyAlert(hobbyName: string) {
  Alert.alert('GatherIn', `Kamu memilih kegiatan ${hobbyName}. Sampai jumpa!`);
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
          <Text style={styles.eyebrow}>TEMAN BARU, CERITA BARU</Text>
          <Text style={styles.title}>
            Rencana seru{'\n'}dimulai <Text style={styles.titleAccent}>di sini.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Temukan teman untuk kumpul dan melakukan hal yang kamu suka.
          </Text>
          <View style={styles.heroFooter}>
            <View style={styles.onlineDot} />
            <Text style={styles.heroFooterText}>12 kegiatan terbuka di sekitarmu</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <Text style={styles.sectionLabel}>MAU NGAPAIN HARI INI?</Text>
          <TextInput
            style={styles.input}
            placeholder="Cari hobi atau kegiatan..."
            placeholderTextColor="#78808F"
            returnKeyType="search"
          />
        </View>

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.sectionTitle}>Lagi ramai</Text>
            <Text style={styles.sectionSubtitle}>Kegiatan spontan dari teman kampus</Text>
          </View>
          <Text style={styles.todayLabel}>UNTUKMU</Text>
        </View>

        <View style={styles.hobbyList}>
          {hobbies.map((hobby) => (
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
                onPress={() => showHobbyAlert(hobby.name)}
                style={({ pressed }) => [styles.joinButton, pressed && styles.joinButtonPressed]}
              >
                <Text style={styles.joinButtonText}>Lihat kegiatan</Text>
                <Text style={styles.joinButtonArrow}>↗</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => showHobbyAlert('kegiatan baru')}
          style={({ pressed }) => [styles.createButton, pressed && styles.createButtonPressed]}
        >
          <Text style={styles.createButtonText}>＋  Buat ajakan kumpul</Text>
        </Pressable>

        <Text style={styles.footerText}>KETEMU DI GATHERIN ✦</Text>
      </ScrollView>
    </View>
  );
}
