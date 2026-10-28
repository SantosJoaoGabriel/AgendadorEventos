import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, EmptyState, Screen, ScreenHeader } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import {
  BillListItem,
  getBillStatus,
  setBillPaid,
  useMonthlyBills,
  type Bill,
  type BillFilter,
} from '../../features/bills';
import { formatCurrency, formatMonthYear } from '../../lib/format';
import { auth } from '../../lib/firebase';

const FILTER_OPTIONS: { value: BillFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'paid', label: 'Pagas' },
];

export default function BillsScreen() {
  const [filter, setFilter] = useState<BillFilter>('all');
  const {
    month,
    bills,
    dueTotal,
    dueCount,
    paidTotal,
    paidCount,
    loading,
    error,
    goToPreviousMonth,
    goToNextMonth,
  } = useMonthlyBills(filter);

  async function handleTogglePaid(bill: Bill) {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      await setBillPaid(uid, bill.id, getBillStatus(bill) !== 'paid');
    } catch (err) {
      console.error('[bills] falha ao atualizar status da conta:', err);
    }
  }

  return (
    <Screen scroll={false}>
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <ScreenHeader
              title="Contas a Pagar"
              action={
                <Pressable
                  onPress={() => router.push('/bills/new')}
                  style={styles.addButton}
                  accessibilityRole="button"
                  accessibilityLabel="Nova conta"
                >
                  <Feather name="plus" size={20} color={colors.textInverse} />
                </Pressable>
              }
            />

            <View style={styles.filterRow}>
              {FILTER_OPTIONS.map((option) => {
                const selected = option.value === filter;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setFilter(option.value)}
                    style={[styles.filterPill, selected && styles.filterPillSelected]}
                  >
                    <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.summaryRow}>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>A pagar</Text>
                <Text style={[styles.summaryAmount, styles.summaryAmountDue]}>
                  {formatCurrency(dueTotal)}
                </Text>
                <Text style={styles.summaryCount}>
                  {dueCount} {dueCount === 1 ? 'conta' : 'contas'}
                </Text>
              </Card>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Pago no mês</Text>
                <Text style={[styles.summaryAmount, styles.summaryAmountPaid]}>
                  {formatCurrency(paidTotal)}
                </Text>
                <Text style={styles.summaryCount}>
                  {paidCount} {paidCount === 1 ? 'conta' : 'contas'}
                </Text>
              </Card>
            </View>

            {!!error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.monthRow}>
              <Pressable onPress={goToPreviousMonth} hitSlop={8} accessibilityRole="button">
                <Feather name="chevron-left" size={18} color={colors.text} />
              </Pressable>
              <Text style={styles.sectionTitle}>{formatMonthYear(month)}</Text>
              <Pressable onPress={goToNextMonth} hitSlop={8} accessibilityRole="button">
                <Feather name="chevron-right" size={18} color={colors.text} />
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? null : <EmptyState message="Toque em + para registrar uma nova conta" />
        }
        renderItem={({ item }) => <BillListItem bill={item} onTogglePaid={handleTogglePaid} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterPill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterPillSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  filterText: {
    ...typography.subheading,
    fontSize: 14,
    color: colors.text,
  },
  filterTextSelected: {
    color: colors.textInverse,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryCard: {
    flex: 1,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  summaryAmount: {
    ...typography.heading,
    fontSize: 22,
    marginTop: spacing.xs,
  },
  summaryAmountDue: {
    color: colors.statusOverdue,
  },
  summaryAmountPaid: {
    color: colors.income,
  },
  summaryCount: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.statusOverdue,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  separator: {
    height: spacing.sm,
  },
});
