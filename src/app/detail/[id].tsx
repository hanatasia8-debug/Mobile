import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { joinActivityWithPromise } from '@/services/activityService';
import { isFavorite as checkIsFavorite, toggleFavorite } from '@/services/favoriteService';
import { detailStyles as styles, PALETTE } from '@/styles';
import { type DetailScreenParams, type HobbyCategory, type HobbyData } from '@/types/activity';

/**
 * Halaman Detail Kegiatan: src/app/detail/[id].tsx
 * Sesuai Modul 3: Pemrograman Asynchronous & API Call
 * 
 * Menerapkan:
 * 1. Async Promise join validation (.then(), .resolve(), .reject())
 * 2. Pre-built async storage untuk tracking favorite (AsyncStorage)
 * 3. Asynchronous loading state saat memproses transaksi
 */
export default function DetailActivityScreen() {
  const params = useLocalSearchParams<'/detail/[id]'>() as DetailScreenParams;

  // State status bergabung
  const [isJoined, setIsJoined] = useState<boolean>(params.isJoined === 'true');

  // State jumlah anggota terkini
  const [currentMembers, setCurrentMembers] = useState<number>(
    Number(params.members) || 0
  );

  // State status favorit dari local storage
  const [isFav, setIsFav] = useState<boolean>(params.isFavorite === 'true');

  // State proses transaksi async
  const [isJoining, setIsJoining] = useState<boolean>(false);

  const maxCapacity = Number(params.maxMembers) || 10;
  const remainingSlots = Math.max(0, maxCapacity - currentMembers);

  // Cek status favorit secara asynchronous saat halaman dibuka
  useEffect(() => {
    if (params.id) {
      checkIsFavorite(params.id)
        .then((favorited) => setIsFav(favorited))
        .catch((err) => console.log('Gagal memeriksa status favorit:', err));
    }
  }, [params.id]);

  /**
   * Handler Gabung Kegiatan secara Asynchronous
   * Memenuhi kriteria penilaian: "Menggunakan fungsi .then(), .resolve(), dan .reject()"
   */
  const handleToggleJoin = () => {
    if (isJoined) {
      Alert.alert(
        'Sudah Terdaftar',
        'Kamu sudah terdaftar di kegiatan ini. Sampai jumpa di lokasi kumpul!'
      );
      return;
    }

    setIsJoining(true);

    const currentActivity: HobbyData = {
      id: params.id,
      name: params.name ?? 'Kegiatan Kumpul',
      description: params.description ?? '',
      category: (params.category as HobbyCategory) || 'Olahraga',
      location: params.location ?? 'Kampus UMM',
      time: params.time ?? 'Hari ini',
      members: currentMembers,
      maxMembers: maxCapacity,
      host: params.host ?? 'Mahasiswa',
      isJoined: isJoined,
    };

    // Memanggil custom Promise function dengan resolve() dan reject()
    joinActivityWithPromise(currentActivity)
      .then((successMsg: string) => {
        setIsJoined(true);
        setCurrentMembers((prev) => prev + 1);
        Alert.alert('Berhasil Bergabung! 🎉', successMsg);
      })
      .catch((error: Error) => {
        Alert.alert('Peringatan Kuota / Join ⚠️', error.message);
      })
      .finally(() => {
        setIsJoining(false);
      });
  };

  /**
   * Handler Toggle Favorit secara Asynchronous
   */
  const handleToggleFavorite = async () => {
    if (!params.id) return;
    try {
      const newStatus = await toggleFavorite(params.id);
      setIsFav(newStatus);
      Alert.alert(
        newStatus ? 'Ditambahkan ke Favorit ❤️' : 'Dihapus dari Favorit 🤍',
        newStatus
          ? `Kegiatan "${params.name}" telah disimpan ke favorit.`
          : `Kegiatan "${params.name}" telah dihapus dari favorit.`
      );
    } catch {
      Alert.alert('Kesalahan', 'Gagal memperbarui status favorit.');
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (!params.id) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>
          Kegiatan tidak ditemukan atau parameter kosong.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={handleGoBack}
          style={styles.backHomeButton}>
          <Text style={styles.backHomeButtonText}>Kembali ke Beranda</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Navigasi Bar Atas & Dynamic Route Badge */}
        <View style={styles.navHeader}>
          <Pressable
            accessibilityRole="button"
            onPress={handleGoBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </Pressable>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              accessibilityRole="button"
              onPress={handleToggleFavorite}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: '#21262D',
                borderWidth: 1,
                borderColor: PALETTE.cardBorder,
              }}>
              <Text style={{ fontSize: 13 }}>{isFav ? '❤️ Favorit' : '🤍 Simpan'}</Text>
            </Pressable>

            <View style={styles.routeBadge}>
              <Text style={styles.routeBadgeText}>ID: #{params.id}</Text>
            </View>
          </View>
        </View>

        {/* Kartu Informasi Lengkap Kegiatan */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.category}>{params.category ?? 'Umum'}</Text>
            <View style={styles.slotBadge}>
              <Text style={styles.slotBadgeText}>
                {remainingSlots > 0 ? `Sisa ${remainingSlots} Slot` : 'Penuh'}
              </Text>
            </View>
          </View>

          <Text style={styles.hobbyName}>{params.name ?? 'Nama Kegiatan'}</Text>
          <Text style={styles.description}>
            {params.description ?? 'Deskripsi tidak tersedia.'}
          </Text>

          {/* Grid Detail Informasi Kegiatan */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>🕒 WAKTU PELAKSANAAN</Text>
              <Text style={styles.infoValue}>{params.time ?? 'Menyesuaikan'}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>📍 LOKASI KUMPUL</Text>
              <Text style={styles.infoValue}>{params.location ?? 'Area Kampus UMM'}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>👤 INITIATOR / HOST</Text>
              <Text style={styles.infoValue}>{params.host ?? 'Mahasiswa Kampus'}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>👥 KUOTA PESERTA</Text>
              <Text style={styles.infoValue}>
                {currentMembers} dari {maxCapacity} orang bergabung
              </Text>
            </View>
          </View>

          {/* Status Keikutsertaan Real-time */}
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Status Keikutsertaan Kamu:</Text>
            <Text style={styles.statusHighlight}>
              {isJoined ? '✓ Tergabung (Joined)' : 'Belum Bergabung'}
            </Text>
          </View>

          {/* Tombol Interaktif Gabung Kegiatan (Promise Handling) */}
          <Pressable
            accessibilityRole="button"
            onPress={handleToggleJoin}
            disabled={isJoined || remainingSlots <= 0 || isJoining}
            style={({ pressed }) => [
              styles.joinButton,
              isJoined && styles.joinButtonDisabled,
              remainingSlots <= 0 && !isJoined && styles.joinButtonFull,
              pressed && styles.joinButtonPressed,
            ]}>
            {isJoining ? (
              <ActivityIndicator color="#0D1117" size="small" />
            ) : (
              <Text
                style={[
                  styles.joinButtonText,
                  isJoined && styles.joinButtonTextDisabled,
                ]}>
                {isJoined
                  ? '✓ Sudah Tergabung (Joined)'
                  : remainingSlots <= 0
                  ? 'Slot Kuota Penuh'
                  : 'Gabung Kegiatan Sekarang (Promise) ↗'}
              </Text>
            )}
          </Pressable>
        </View>

        <Text style={styles.footerText}>GATHERIN • MODUL 3 PRAKTIKUM ✦</Text>
      </ScrollView>
    </View>
  );
}
