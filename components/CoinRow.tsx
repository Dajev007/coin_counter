import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { CoinDenomination, calcCoinCount, calcCoinValue, formatPounds } from '@/constants/coins';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  coin: CoinDenomination;
  weightInput: string;
  onChangeWeight: (value: string) => void;
};

export default function CoinRow({ coin, weightInput, onChangeWeight }: Props) {
  const { colors } = useTheme();
  const parsedWeight = parseFloat(weightInput) || 0;
  const count = calcCoinCount(parsedWeight, coin.weightGrams);
  const value = calcCoinValue(count, coin.valuePounds);
  const hasValue = count > 0;

  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.badge, { backgroundColor: colors.coinBadgeBg }]}>
        <Text style={[styles.badgeText, { color: colors.coinBadgeText }]}>{coin.label}</Text>
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              borderColor: hasValue ? colors.accent : colors.border,
              color: colors.text,
            },
          ]}
          value={weightInput}
          onChangeText={onChangeWeight}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          selectTextOnFocus
        />
        <Text style={[styles.unit, { color: colors.textSecondary }]}>g</Text>
      </View>

      <View style={styles.result}>
        <Text style={[styles.countText, { color: hasValue ? colors.text : colors.textMuted }]}>
          {count} {count === 1 ? 'coin' : 'coins'}
        </Text>
        <Text style={[styles.valueText, { color: hasValue ? colors.accent : colors.textMuted }]}>
          {formatPounds(value)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeText: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  inputGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  unit: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    width: 14,
  },
  result: {
    alignItems: 'flex-end',
    minWidth: 72,
  },
  countText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  valueText: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    marginTop: 1,
  },
  subText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
});
