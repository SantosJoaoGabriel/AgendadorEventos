import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, EmptyState, Screen, ScreenHeader } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import { IncomeListItem, useMonthlyIncomes } from '../../features/incomes';
import { formatCurrency, formatMonthYear } from '../../lib/format';

export default function IncomesScreen() {
  const { month, incomes, total, loading, error, goToPreviousMonth, goToNextMonth } =
    useMonthlyIncomes();

  return (
    <Screen scroll={false}>
      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <ScreenHeader
              title="Receitas"
              action={
                <Pressable
                  onPress={() => router.push('/incomes/new')}
                  style={styles.addButton}
                  accessibilityRole="button"
                  accessibilityLabel="Nova receita"
                >
                  <Feather name="plus" size={20} color={colors.textInverse} />
                </Pressable>
              }
            />

            <View style={styles.monthSelector}>
              <Pressable onPress={goToPreviousMonth} hitSlop={8} accessibilityRole="button">
                <Feather name="chevron-left" size={20} color={colors.text} />
              </Pressable>
              <Text style={styles.monthLabel}>{formatMonthYear(month)}</Text>
              <Pressable onPress={goToNextMonth} hitSlop={8} accessibilityRole="button">
                <Feather name="chevron-right" size={20} color={colors.text} />
              </Pressable>
            </View>

            <Card>
              <Text style={styles.totalLabel}>Total recebido no mês</Text>
              <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
              <Text style={styles.totalCount}>
                {incomes.length} {incomes.length === 1 ? 'lançamento' : 'lançamentos'}
              </Text>
            </Card>

            {!!error && <Text style={styles.error}>{error}</Text>}

            <Text style={styles.sectionTitle}>Lançamentos</Text>
          </View>
        }
        ListEmptyComponent={
          loading ? null : <EmptyState message="Toque em + para registrar uma nova receita" />
        }
        renderItem={({ item }) => <IncomeListItem income={item} />}
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
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  monthLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  totalLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  totalAmount: {
    ...typography.heading,
    fontSize: 28,
    color: colors.income,
    marginTop: spacing.xs,
  },
  totalCount: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.statusOverdue,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  separator: {
    height: spacing.sm,
  },
});
