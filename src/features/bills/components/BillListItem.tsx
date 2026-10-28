import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../../components/ui';
import { colors, radius, spacing, typography } from '../../../constants';
import { formatCurrency, formatDate } from '../../../lib/format';
import { BILL_CATEGORY_ICONS, BILL_STATUS_COLORS, BILL_STATUS_LABELS } from '../categories';
import { getBillStatus } from '../status';
import { Bill } from '../types';

export function BillListItem({
  bill,
  onTogglePaid,
}: {
  bill: Bill;
  onTogglePaid: (bill: Bill) => void;
}) {
  const status = getBillStatus(bill);
  const paid = status === 'paid';
  const statusColors = BILL_STATUS_COLORS[status];

  const subtitle = paid
    ? `Pago em ${formatDate(new Date(bill.paidAt as string))}`
    : status === 'overdue'
      ? `Venceu em ${formatDate(new Date(bill.dueAt))}`
      : `Vence em ${formatDate(new Date(bill.dueAt))}`;

  return (
    <Card style={styles.card}>
      <Pressable
        onPress={() => onTogglePaid(bill)}
        style={[styles.checkbox, paid ? styles.checkboxPaid : { borderColor: statusColors.text }]}
        accessibilityRole="button"
        accessibilityLabel={paid ? 'Marcar como não paga' : 'Marcar como paga'}
      >
        {paid && <Feather name="check" size={14} color={colors.textInverse} />}
      </Pressable>

      <View style={styles.icon}>
        <Feather name={BILL_CATEGORY_ICONS[bill.category]} size={18} color={colors.text} />
      </View>

      <View style={styles.texts}>
        <Text style={[styles.title, paid && styles.titlePaid]} numberOfLines={1}>
          {bill.description}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.amountColumn}>
        <Text style={styles.amount}>{formatCurrency(bill.amount)}</Text>
        <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
          <Text style={[styles.badgeText, { color: statusColors.text }]}>
            {BILL_STATUS_LABELS[status]}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxPaid: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.statusPendingBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
  },
  titlePaid: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  amountColumn: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  amount: {
    ...typography.subheading,
    color: colors.text,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
});
