import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PALETTE } from '@/styles';
import { type HobbyData } from '@/types/activity';

interface ActivityCardProps {
  activity: HobbyData;
  isFavorite?: boolean;
  onNavigateDetail: (activity: HobbyData) => void;
  onQuickJoin: (activity: HobbyData) => void;
  onToggleFavorite?: (activityId: string) => void;
}

/**
 * Komponen ActivityCard Reusable sesuai Modul 3 Bab 3 (CharacterCard.tsx)
 */
export function ActivityCard({
  activity,
  isFavorite = false,
  onNavigateDetail,
  onQuickJoin,
  onToggleFavorite,
}: ActivityCardProps) {
  const remainingSlots = Math.max(0, activity.maxMembers - activity.members);
  const isFull = remainingSlots <= 0;

  return (
    <View style={styles.card}>
      {/* Top Row: Kategori, Slot, & Tombol Favorit */}
      <View style={styles.topRow}>
        <View style={styles.tagGroup}>
          <Text style={styles.categoryBadge}>{activity.category}</Text>
          <View
            style={[
              styles.slotBadge,
              isFull ? styles.slotBadgeFull : styles.slotBadgeAvailable,
            ]}>
            <Text
              style={[
                styles.slotBadgeText,
                isFull ? styles.slotBadgeFullText : styles.slotBadgeAvailableText,
              ]}>
              {isFull ? 'Kuota Penuh' : `Sisa ${remainingSlots} Slot`}
            </Text>
          </View>
        </View>

        {onToggleFavorite && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            onPress={() => onToggleFavorite(activity.id)}
            style={({ pressed }) => [
              styles.favButton,
              pressed && styles.favButtonPressed,
            ]}>
            <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </Pressable>
        )}
      </View>

      {/* Judul & Deskripsi */}
      <Text style={styles.title}>{activity.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {activity.description}
      </Text>

      {/* Info Waktu, Lokasi, dan Host */}
      <View style={styles.metaBox}>
        <Text style={styles.metaText}>🕒 {activity.time}</Text>
        <Text style={styles.metaSeparator}>•</Text>
        <Text style={styles.metaText} numberOfLines={1}>
          📍 {activity.location}
        </Text>
      </View>

      <Text style={styles.hostText}>👤 Host: {activity.host}</Text>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onNavigateDetail(activity)}
          style={({ pressed }) => [
            styles.detailBtn,
            pressed && styles.detailBtnPressed,
          ]}>
          <Text style={styles.detailBtnText}>Detail Kegiatan</Text>
          <Text style={styles.detailBtnArrow}>↗</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => onQuickJoin(activity)}
          disabled={activity.isJoined || isFull}
          style={({ pressed }) => [
            styles.joinBtn,
            activity.isJoined && styles.joinBtnJoined,
            isFull && !activity.isJoined && styles.joinBtnFull,
            pressed && styles.joinBtnPressed,
          ]}>
          <Text
            style={[
              styles.joinBtnText,
              activity.isJoined && styles.joinBtnJoinedText,
              isFull && !activity.isJoined && styles.joinBtnFullText,
            ]}>
            {activity.isJoined
              ? 'Joined ✓'
              : isFull
              ? 'Penuh'
              : '+ Gabung'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    backgroundColor: PALETTE.cardBg,
    marginVertical: 7,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#21262D',
    color: PALETTE.accentLime,
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
  },
  slotBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  slotBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  slotBadgeAvailable: {
    backgroundColor: '#16282E',
    borderColor: '#1D4E5B',
  },
  slotBadgeAvailableText: {
    color: PALETTE.accentCyan,
    fontSize: 11,
    fontWeight: '700',
  },
  slotBadgeFull: {
    backgroundColor: '#241215',
    borderColor: '#5C1D24',
  },
  slotBadgeFullText: {
    color: PALETTE.danger,
    fontSize: 11,
    fontWeight: '700',
  },
  favButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#21262D',
  },
  favButtonPressed: {
    opacity: 0.7,
  },
  favIcon: {
    fontSize: 14,
  },
  title: {
    color: PALETTE.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  description: {
    marginTop: 6,
    color: PALETTE.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  metaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#0D1117',
    borderRadius: 10,
  },
  metaText: {
    color: PALETTE.textPrimary,
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
  metaSeparator: {
    marginHorizontal: 8,
    color: PALETTE.textMuted,
  },
  hostText: {
    marginTop: 8,
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  detailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PALETTE.cardBorder,
    backgroundColor: '#21262D',
  },
  detailBtnPressed: {
    opacity: 0.8,
  },
  detailBtnText: {
    color: PALETTE.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  detailBtnArrow: {
    marginLeft: 4,
    color: PALETTE.accentCyan,
    fontSize: 12,
    fontWeight: '800',
  },
  joinBtn: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: PALETTE.accentLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnPressed: {
    opacity: 0.8,
  },
  joinBtnJoined: {
    backgroundColor: PALETTE.accentGreen,
  },
  joinBtnFull: {
    backgroundColor: '#30363D',
  },
  joinBtnText: {
    color: '#0D1117',
    fontSize: 13,
    fontWeight: '800',
  },
  joinBtnJoinedText: {
    color: '#FFFFFF',
  },
  joinBtnFullText: {
    color: PALETTE.textMuted,
  },
});
