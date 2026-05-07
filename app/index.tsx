import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RotateCcw, BookmarkPlus, History, Moon, Sun } from 'lucide-react-native';
import { COINS, calcCoinCount, calcCoinValue, formatPounds } from '@/constants/coins';
import { useTheme } from '@/context/ThemeContext';
import { loadHistory, saveCount, deleteCount, SavedCount } from '@/utils/storage';
import CoinRow from '@/components/CoinRow';
import SummaryCard from '@/components/SummaryCard';
import TotalFooter from '@/components/TotalFooter';
import ResetModal from '@/components/ResetModal';
import SaveModal from '@/components/SaveModal';
import HistoryModal from '@/components/HistoryModal';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

type Weights = Record<string, string>;

const emptyWeights = (): Weights =>
  COINS.reduce((acc, c) => ({ ...acc, [c.id]: '' }), {} as Weights);

export default function CounterScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [weights, setWeights] = useState<Weights>(emptyWeights);
  const [showReset, setShowReset] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SavedCount[]>([]);
  const inputRefs = useRef<Array<React.RefObject<TextInput | null>>>(
    COINS.map(() => React.createRef<TextInput | null>())
  );

  useEffect(() => {
    loadHistory().then(setHistory);
  }, []);

  const totals = COINS.reduce(
    (acc, coin) => {
      const w = parseFloat(weights[coin.id]) || 0;
      const count = calcCoinCount(w, coin.weightGrams);
      const value = calcCoinValue(count, coin.valuePounds);
      acc.value += value;
      acc.coins += count;
      acc.weight += w;
      return acc;
    },
    { value: 0, coins: 0, weight: 0 }
  );

  const summaryText = [
    'coin_counter Summary',
    '================================',
    ...COINS.map((coin) => {
      const w = parseFloat(weights[coin.id]) || 0;
      const count = calcCoinCount(w, coin.weightGrams);
      const value = calcCoinValue(count, coin.valuePounds);
      if (count === 0) return null;
      return `${coin.label}: ${count} coins = ${formatPounds(value)}`;
    }).filter(Boolean),
    '--------------------------------',
    `Total Coins: ${totals.coins}`,
    `Total Weight: ${totals.weight.toFixed(1)}g`,
    `Total Value: ${formatPounds(totals.value)}`,
  ].join('\n');

  const handleReset = () => {
    setWeights(emptyWeights());
    setShowReset(false);
  };

  const handleSave = async () => {
    const breakdown = COINS.map((coin) => {
      const w = parseFloat(weights[coin.id]) || 0;
      const count = calcCoinCount(w, coin.weightGrams);
      const value = calcCoinValue(count, coin.valuePounds);
      return { coinId: coin.id, label: coin.label, weightGrams: w, count, value };
    });
    const updated = await saveCount({
      totalValue: totals.value,
      totalCoins: totals.coins,
      totalWeight: totals.weight,
      breakdown,
    });
    setHistory((prev) => [updated, ...prev]);
    setShowSave(false);
  };

  const handleDelete = async (id: string) => {
    const updated = await deleteCount(id);
    setHistory(updated);
  };

  const setWeight = useCallback((id: string, val: string) => {
    setWeights((prev) => ({ ...prev, [id]: val }));
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.header, paddingTop: insets.top + 8 },
        ]}
      >
        <View style={isTablet ? styles.headerInnerTablet : styles.headerInner}>
          <Text style={[styles.headerTitle, { color: colors.headerText }]}>coin_counter</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={toggleTheme}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {theme === 'dark' ? (
                <Sun size={20} color="rgba(255,255,255,0.85)" strokeWidth={2} />
              ) : (
                <Moon size={20} color="rgba(255,255,255,0.85)" strokeWidth={2} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => setShowHistory(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <History size={20} color="rgba(255,255,255,0.85)" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerBtn, styles.headerBtnDestructive]}
              onPress={() => setShowReset(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <RotateCcw size={20} color="rgba(255,255,255,0.85)" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && styles.scrollContentTablet,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Section label */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            ENTER WEIGHT PER COIN TYPE
          </Text>

          {COINS.map((coin, index) => (
            <CoinRow
              key={coin.id}
              coin={coin}
              weightInput={weights[coin.id]}
              onChangeWeight={(val) => setWeight(coin.id, val)}
              inputRef={inputRefs.current[index]}
              onSubmitEditing={() => {
                const nextRef = inputRefs.current[index + 1];
                if (nextRef?.current) nextRef.current.focus();
              }}
            />
          ))}

          {/* Summary Card */}
          <View style={styles.summaryWrap}>
            <SummaryCard
              totalValue={totals.value}
              totalCoins={totals.coins}
              totalWeight={totals.weight}
              summaryText={summaryText}
            />
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[
              styles.saveBtn,
              {
                backgroundColor: totals.coins > 0 ? colors.accent : colors.border,
                opacity: totals.coins > 0 ? 1 : 0.5,
              },
            ]}
            onPress={() => totals.coins > 0 && setShowSave(true)}
            activeOpacity={0.8}
            disabled={totals.coins === 0}
          >
            <BookmarkPlus size={18} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.saveBtnText}>Save Count</Text>
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>

        {/* Total Footer */}
        <TotalFooter totalValue={totals.value} totalCoins={totals.coins} />
        <View style={{ height: insets.bottom, backgroundColor: colors.totalBg }} />
      </KeyboardAvoidingView>

      {/* Modals */}
      <ResetModal
        visible={showReset}
        onCancel={() => setShowReset(false)}
        onConfirm={handleReset}
      />
      <SaveModal
        visible={showSave}
        totalValue={totals.value}
        totalCoins={totals.coins}
        onCancel={() => setShowSave(false)}
        onConfirm={handleSave}
      />
      <HistoryModal
        visible={showHistory}
        history={history}
        onClose={() => setShowHistory(false)}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInnerTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  headerBtnDestructive: {
    backgroundColor: 'rgba(220,38,38,0.25)',
  },
  scrollContent: {
    padding: 16,
  },
  scrollContentTablet: {
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  summaryWrap: {
    marginTop: 8,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    marginTop: 10,
    gap: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
});
