import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { PALETTE } from '@/styles';

interface LoadingProps {
  message?: string;
}

/**
 * Komponen Loading Reusable sesuai Modul 3 Bab 3
 * Menampilkan animasi spinner saat proses asynchronous (fetch data) sedang berlangsung
 */
export function Loading({ message = 'Memuat data dari API...' }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={PALETTE.accentCyan} />
      <Text style={styles.text}>{message}</Text>
      <Text style={styles.subtext}>Menunggu response Promise asynchronous...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    marginVertical: 12,
  },
  text: {
    marginTop: 14,
    color: PALETTE.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtext: {
    marginTop: 6,
    color: PALETTE.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});

