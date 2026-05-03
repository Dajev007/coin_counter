import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatPounds } from '@/constants/coins';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  totalValue: number;
  totalCoins: number;
};

export default function TotalFooter({ totalValue, totalCoins }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.footer, { backgroundColor: colors.totalBg }]}>
      <View style={styles.inner}>
        <Text style={[styles.label, { color: 'rgba(255,255,255,0.7)' }]}>TOTAL VALUE</Text>
        <Text style={[styles.total, { color: colors.totalText }]}>{formatPounds(totalValue)}</Text>
        <Text style={[styles.sub, { color: 'rgba(255,255,255,0.6)' }]}>
          {totalCoins} {totalCoins === 1 ? 'coin' : 'coins'} counted
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  inner: {
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  total: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    letterSpacing: -1,
  },
  sub: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
});
