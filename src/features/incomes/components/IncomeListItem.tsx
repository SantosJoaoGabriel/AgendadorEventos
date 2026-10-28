import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../../components/ui';
import { colors, radius, spacing, typography } from '../../../constants';
import { formatCurrency, formatDate } from '../../../lib/format';
import { INCOME_CATEGORY_ICONS, INCOME_CATEGORY_LABELS } from '../categories';
import { Income } from '../types';

export function IncomeListItem({ income }: { income: Income }) {
  return (
    <Card style={styles.card}>
      <View style={styles.icon}>
        <Feather name={INCOME_CATEGORY_ICONS[income.category]} size={18} color={colors.brand} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1}>
          {income.description}
        </Text>
        <Text style={styles.subtitle}>
          {formatDate(new Date(income.receivedAt))} · {INCOME_CATEGORY_LABELS[income.category]}
        </Text>
      </View>
      <Text style={styles.amount}>+ {formatCurrency(income.amount)}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
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
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  amount: {
    ...typography.subheading,
    color: colors.income,
  },
});
