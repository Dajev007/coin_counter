import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { formatPounds } from '@/constants/coins';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  totalValue: number;
  totalCoins: number;
  summaryText: string;
};

export default function SummaryCard({ totalValue, totalCoins, summaryText }: Props) {
  const { colors } = useTheme();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(summaryText);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>{totalCoins}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Coins</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.accent }]}>{formatPounds(totalValue)}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Value</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.copyBtn, { backgroundColor: colors.accentLight, borderColor: colors.accent }]}
        onPress={handleCopy}
        activeOpacity={0.7}
      >
        <Copy size={14} color={colors.accent} strokeWidth={2} />
        <Text style={[styles.copyText, { color: colors.accent }]}>Copy Summary</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 36,
    marginHorizontal: 8,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  copyText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
});
