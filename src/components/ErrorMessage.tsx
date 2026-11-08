import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PALETTE } from '@/styles';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Komponen Error Reusable sesuai Modul 3 Bab 3
 * Menampilkan pesan kesalahan penanganan Promise rejected / API fetch failure
 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>⚠️ PROMISE REJECTED / NETWORK ERROR</Text>
      <Text style={styles.title}>Terjadi Kesalahan</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed,
          ]}>
          <Text style={styles.retryButtonText}>🔄 Coba Ambil Data Lagi</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1E1517',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7A272B',
    marginVertical: 12,
  },
  badge: {
    color: PALETTE.danger,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    color: PALETTE.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  message: {
    color: '#E6A1A4',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  retryButton: {
    backgroundColor: PALETTE.danger,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

