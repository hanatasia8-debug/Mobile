import { StyleSheet } from 'react-native';

const styleDefinitions = {
  container: {
    flex: 1,
    backgroundColor: '#101217',
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 36,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 34,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B9F36A',
  },
  brandMarkText: {
    color: '#19220D',
    fontSize: 20,
    fontWeight: '900',
  },
  brandName: {
    marginLeft: 10,
    color: '#F5F6F2',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  locationBadge: {
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: '#353943',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  locationBadgeText: {
    color: '#A7ACB8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  hero: {
    marginBottom: 30,
  },
  eyebrow: {
    color: '#B9F36A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 12,
  },
  title: {
    color: '#F5F6F2',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.8,
    lineHeight: 47,
  },
  titleAccent: {
    color: '#B9F36A',
  },
  subtitle: {
    maxWidth: 330,
    marginTop: 12,
    color: '#A7ACB8',
    fontSize: 15,
    lineHeight: 23,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#B9F36A',
    marginRight: 8,
  },
  heroFooterText: {
    color: '#C6CAD2',
    fontSize: 12,
    fontWeight: '600',
  },
  searchSection: {
    marginBottom: 29,
  },
  sectionLabel: {
    color: '#A7ACB8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#30343D',
    backgroundColor: '#191C23',
    color: '#F5F6F2',
    fontSize: 14,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#F5F6F2',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    marginTop: 4,
    color: '#858B98',
    fontSize: 12,
  },
  todayLabel: {
    color: '#B9F36A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  hobbyList: {
    gap: 12,
  },
  hobbyCard: {
    padding: 17,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2D313A',
    backgroundColor: '#191C23',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  category: {
    overflow: 'hidden',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#292E25',
    color: '#C6F58D',
    fontSize: 10,
    fontWeight: '700',
  },
  memberCount: {
    color: '#A7ACB8',
    fontSize: 11,
    fontWeight: '600',
  },
  hobbyName: {
    color: '#F5F6F2',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  description: {
    marginTop: 5,
    color: '#A7ACB8',
    fontSize: 12,
    lineHeight: 18,
  },
  activityDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 12,
  },
  detailText: {
    color: '#C6CAD2',
    fontSize: 11,
    fontWeight: '600',
  },
  detailSeparator: {
    marginHorizontal: 7,
    color: '#6D7380',
  },
  joinButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 13,
    borderRadius: 11,
    backgroundColor: '#252A22',
  },
  joinButtonPressed: {
    opacity: 0.72,
  },
  joinButtonText: {
    color: '#C6F58D',
    fontSize: 12,
    fontWeight: '700',
  },
  joinButtonArrow: {
    color: '#C6F58D',
    fontSize: 17,
  },
  createButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 14,
    backgroundColor: '#B9F36A',
  },
  createButtonPressed: {
    opacity: 0.78,
  },
  createButtonText: {
    color: '#19220D',
    fontSize: 14,
    fontWeight: '800',
  },
  footerText: {
    marginTop: 25,
    color: '#656B77',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.7,
    textAlign: 'center',
  },
} as const;

export const styles = StyleSheet.create<typeof styleDefinitions>(styleDefinitions);

const detailDefinitions = {
  container: {
    flex: 1,
    backgroundColor: '#101217',
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 36,
  },
  card: {
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2D313A',
    backgroundColor: '#191C23',
    alignItems: 'center',
  },
  hobbyImageWrap: {
    marginBottom: 16,
  },
  hobbyImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#2D313A',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  category: {
    overflow: 'hidden',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 5,
    backgroundColor: '#292E25',
    color: '#C6F58D',
    fontSize: 10,
    fontWeight: '700',
  },
  memberCount: {
    color: '#A7ACB8',
    fontSize: 11,
    fontWeight: '600',
  },
  hobbyName: {
    color: '#F5F6F2',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  description: {
    marginTop: 8,
    color: '#A7ACB8',
    fontSize: 13,
    lineHeight: 20,
  },
  detailSection: {
    marginTop: 18,
    paddingTop: 14,
    borderTopColor: '#2A2E37',
    borderTopWidth: 1,
  },
  detailLabel: {
    color: '#858B98',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  detailValue: {
    color: '#E5E7E1',
    fontSize: 14,
    fontWeight: '600',
  },
  joinButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#B9F36A',
  },
  joinButtonPressed: {
    opacity: 0.78,
  },
  joinButtonText: {
    color: '#19220D',
    fontSize: 14,
    fontWeight: '800',
  },
  joinButtonArrow: {
    color: '#19220D',
    fontSize: 18,
  },
  notFoundText: {
    color: '#A7ACB8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
  footerText: {
    marginTop: 25,
    color: '#656B77',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.7,
    textAlign: 'center',
  },
} as const;

export const detailStyles = StyleSheet.create<typeof detailDefinitions>(detailDefinitions);

const chipDefinitions = {
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#30343D',
    backgroundColor: '#191C23',
  },
  chipActive: {
    borderColor: '#B9F36A',
    backgroundColor: '#252A22',
  },
  chipText: {
    color: '#A7ACB8',
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#C6F58D',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#858B98',
    fontSize: 13,
    textAlign: 'center',
  },
} as const;

export const chipStyles = StyleSheet.create<typeof chipDefinitions>(chipDefinitions);
