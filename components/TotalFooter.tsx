import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatPounds } from '@/constants/coins';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  totalValue: number;
};

export default function TotalFooter({ totalValue }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.footer, { backgroundColor: colors.totalBg }]}>
      <Text style={[styles.totalText, { color: colors.totalText }]}>
        Total = {formatPounds(totalValue)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
});
