import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PALETTE } from '@/styles';

interface StatItem {
  label: string;
  value: string | number;
  badge?: string;
}

interface StatCardProps {
  stats: StatItem[];
}

/**
 * Komponen StatCard Reusable sesuai Modul 3 Bab 3
 * Menampilkan ringkasan metrik data asynchronous secara informatif
 */
export function StatCard({ stats }: StatCardProps) {
  return (
    <View style={styles.container}>
      {stats.map((item, index) => (
        <View
          key={item.label}
          style={[
            styles.statColumn,
            index > 0 && styles.statBorderLeft,
          ]}>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
          {item.badge && <Text style={styles.badge}>{item.badge}</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginVertical: 12,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBorderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: PALETTE.cardBorder,
  },
  value: {
    color: PALETTE.accentLime,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  label: {
    marginTop: 2,
    color: PALETTE.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  badge: {
    marginTop: 4,
    color: PALETTE.accentCyan,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

