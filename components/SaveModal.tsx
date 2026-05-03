import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BookmarkCheck } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { formatPounds } from '@/constants/coins';

type Props = {
  visible: boolean;
  totalValue: number;
  totalCoins: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function SaveModal({ visible, totalValue, totalCoins, onCancel, onConfirm }: Props) {
  const { colors } = useTheme();

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={[styles.iconWrap, { backgroundColor: colors.successLight }]}>
            <BookmarkCheck size={28} color={colors.success} strokeWidth={2} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Save Count</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            Save this count to history?
          </Text>
          <View style={[styles.preview, { backgroundColor: colors.accentLight, borderColor: colors.accent }]}>
            <Text style={[styles.previewValue, { color: colors.accent }]}>{formatPounds(totalValue)}</Text>
            <Text style={[styles.previewSub, { color: colors.textSecondary }]}>{totalCoins} coins</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.confirmBtn, { backgroundColor: colors.accent }]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  preview: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  previewValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  previewSub: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
  },
  confirmBtn: {},
  btnText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
});
