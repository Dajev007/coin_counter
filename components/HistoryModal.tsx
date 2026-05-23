import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { X, Trash2, History, ChevronDown } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { SavedCount } from '@/utils/storage';
import { formatPounds } from '@/constants/coins';

type Props = {
  visible: boolean;
  history: SavedCount[];
  onClose: () => void;
  onDelete: (id: string) => void;
};

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryModal({ visible, history, onClose, onDelete }: Props) {
  const { colors } = useTheme();

  return (
    <Modal transparent visible={visible} animationType="slide" statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <History size={20} color={colors.accent} strokeWidth={2} />
              <Text style={[styles.title, { color: colors.text }]}>Saved History</Text>
            </View>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: colors.inputBg }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={18} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {history.length === 0 ? (
            <View style={styles.empty}>
              <ChevronDown size={40} color={colors.textMuted} strokeWidth={1.5} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No saved counts yet</Text>
              <Text style={[styles.emptySubText, { color: colors.textMuted }]}>
                Use the save button to record your counts
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              bounces={true}
            >
              {history.map((item) => (
                <View
                  key={item.id}
                  style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.itemMain}>
                    <Text style={[styles.itemValue, { color: colors.accent }]}>
                      {formatPounds(item.totalValue)}
                    </Text>
                    <Text style={[styles.itemDate, { color: colors.textSecondary }]}>
                      {formatDate(item.timestamp)}
                    </Text>
                    <Text style={[styles.itemMeta, { color: colors.textMuted }]}>
                      {item.totalCoins} {item.totalCoins === 1 ? 'coin' : 'coins'}
                    </Text>
                  </View>
                  <View style={styles.itemBreakdown}>
                    {item.breakdown
                      .filter((b) => b.count > 0)
                      .map((b) => (
                        <View
                          key={b.coinId}
                          style={[styles.breakdownBadge, { backgroundColor: colors.accentLight }]}
                        >
                          <Text style={[styles.breakdownText, { color: colors.coinBadgeText }]}>
                            {b.label}: {b.count}
                          </Text>
                        </View>
                      ))}
                  </View>
                  <TouchableOpacity
                    style={[styles.deleteBtn, { backgroundColor: colors.destructiveLight }]}
                    onPress={() => onDelete(item.id)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={16} color={colors.destructive} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '50%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  item: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  itemMain: {
    marginBottom: 10,
  },
  itemValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  itemDate: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  itemMeta: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  itemBreakdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  breakdownBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  breakdownText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
