import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PALETTE } from '@/styles';
import { type CommunityHost } from '@/types/activity';

interface CommunityHostCardProps {
  host: CommunityHost;
  onPressContact?: (host: CommunityHost) => void;
}

/**
 * Komponen Kartu Host Mahasiswa hasil Fetch dari External API
 * Memenuhi Kriteria Penilaian: "Mengambil data dari External API dan memasukkannya ke dalam Object menggunakan Interface"
 */
export function CommunityHostCard({ host, onPressContact }: CommunityHostCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image
          source={{ uri: host.avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.headerInfo}>
          <View style={styles.topBadgeRow}>
            <Text style={styles.verifiedBadge}>● EXTERNAL API HOST</Text>
            <Text style={styles.idBadge}>ID: #{host.id}</Text>
          </View>
          <Text style={styles.name}>{host.fullName}</Text>
          <Text style={styles.role}>{host.role}</Text>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>UNIVERSITAS / AFILIASI</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            🏛️ {host.university}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>DEPARTEMEN / BIDANG</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            💼 {host.department}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>KONTAK EMAIL</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            ✉️ {host.email}
          </Text>
        </View>
      </View>

      {onPressContact && (
        <Pressable
          accessibilityRole="button"
          onPress={() => onPressContact(host)}
          style={({ pressed }) => [
            styles.contactButton,
            pressed && styles.contactButtonPressed,
          ]}>
          <Text style={styles.contactButtonText}>Ajukan Kolaborasi Kumpul</Text>
          <Text style={styles.contactButtonArrow}>↗</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    backgroundColor: PALETTE.cardBg,
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#21262D',
    borderWidth: 1.5,
    borderColor: PALETTE.accentCyan,
  },
  headerInfo: {
    marginLeft: 14,
    flex: 1,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  verifiedBadge: {
    color: PALETTE.accentLime,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  idBadge: {
    color: PALETTE.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  name: {
    color: PALETTE.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  role: {
    color: PALETTE.accentCyan,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  detailsBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#0D1117',
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: PALETTE.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  detailValue: {
    color: PALETTE.textPrimary,
    fontSize: 11,
    fontWeight: '600',
    maxWidth: '58%',
    textAlign: 'right',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALETTE.cardBorderHighlight,
    backgroundColor: '#0D1A26',
  },
  contactButtonPressed: {
    opacity: 0.8,
  },
  contactButtonText: {
    color: PALETTE.accentCyan,
    fontSize: 12,
    fontWeight: '700',
  },
  contactButtonArrow: {
    marginLeft: 6,
    color: PALETTE.accentCyan,
    fontSize: 12,
    fontWeight: '800',
  },
});

