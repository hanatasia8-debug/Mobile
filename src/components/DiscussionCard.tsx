import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PALETTE } from '@/styles';
import { type CampusDiscussion } from '@/types/activity';

interface DiscussionCardProps {
  discussion: CampusDiscussion;
}

/**
 * Komponen Forum Diskusi Spontan hasil Fetch dari External API (dummyjson posts)
 */
export function DiscussionCard({ discussion }: DiscussionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.sourceBadge}>💬 EXTERNAL FORUM POST</Text>
        <Text style={styles.idBadge}>#{discussion.id}</Text>
      </View>

      <Text style={styles.title}>{discussion.title}</Text>
      <Text style={styles.content} numberOfLines={3}>
        {discussion.content}
      </Text>

      <View style={styles.tagRow}>
        {discussion.tags.map((tag) => (
          <View key={tag} style={styles.tagBadge}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerStat}>❤️ {discussion.likes} Likes</Text>
        <Text style={styles.footerSeparator}>•</Text>
        <Text style={styles.footerStat}>👁️ {discussion.views} Views</Text>
        <Text style={styles.authorBadge}>Author ID: {discussion.authorId}</Text>
      </View>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sourceBadge: {
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
  title: {
    color: PALETTE.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  content: {
    marginTop: 6,
    color: PALETTE.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#21262D',
  },
  tagText: {
    color: PALETTE.accentCyan,
    fontSize: 10,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#21262D',
  },
  footerStat: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  footerSeparator: {
    marginHorizontal: 8,
    color: PALETTE.textMuted,
  },
  authorBadge: {
    marginLeft: 'auto',
    color: PALETTE.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
});

