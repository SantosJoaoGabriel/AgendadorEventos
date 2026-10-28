import { Feather, Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Screen } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import { signOut, useAuthUser } from '../../features/auth';
import { BillListItem, getBillStatus, setBillPaid, useMonthlyBills } from '../../features/bills';
import type { Bill } from '../../features/bills';
import { useMonthlyIncomes } from '../../features/incomes';
import { formatCurrency, formatMonthName } from '../../lib/format';

function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia,';
  if (hour < 18) return 'Boa tarde,';
  return 'Boa noite,';
}

export default function HomeScreen() {
  const { user } = useAuthUser();
  const { total: incomeTotal } = useMonthlyIncomes();
  const { month, bills, dueTotal, paidTotal } = useMonthlyBills('all');

  const billsTotal = dueTotal + paidTotal;
  const balance = incomeTotal - billsTotal;
  const committedPercent = incomeTotal > 0 ? Math.round((billsTotal / incomeTotal) * 100) : 0;

  const upcomingBills = bills
    .filter((bill) => {
      const status = getBillStatus(bill);
      return status === 'pending' || status === 'dueSoon';
    })
    .slice(0, 3);

  const displayName = user?.displayName || user?.email?.split('@')[0] || '';

  async function handleTogglePaid(bill: Bill) {
    if (!user) return;
    try {
      await setBillPaid(user.uid, bill.id, getBillStatus(bill) !== 'paid');
    } catch (err) {
      console.error('[home] falha ao atualizar status da conta:', err);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (err) {
      console.error('[home] falha ao sair:', err);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting(new Date())}</Text>
          {!!displayName && <Text style={styles.name}>{displayName}</Text>}
        </View>
        <Pressable
          onPress={handleSignOut}
          style={styles.logoutButton}
          accessibilityRole="button"
          accessibilityLabel="Sair"
        >
          <Feather name="log-out" size={18} color={colors.text} />
        </Pressable>
      </View>

      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo de {formatMonthName(month)}</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceItemLabel}>Receitas</Text>
            <Text style={styles.balanceItemValue}>{formatCurrency(incomeTotal)}</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceItemLabel}>Contas</Text>
            <Text style={styles.balanceItemValue}>{formatCurrency(billsTotal)}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próximos vencimentos</Text>
        <Link href="/bills" style={styles.sectionLink}>
          Ver todas
        </Link>
      </View>

      {upcomingBills.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>Nenhuma conta pendente por aqui.</Text>
        </Card>
      ) : (
        <View style={styles.list}>
          {upcomingBills.map((bill) => (
            <BillListItem key={bill.id} bill={bill} onTogglePaid={handleTogglePaid} />
          ))}
        </View>
      )}

      <Card style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <Ionicons name="bulb-outline" size={18} color={colors.brand} />
        </View>
        <View style={styles.tipTexts}>
          <Text style={styles.tipTitle}>Dica do guia</Text>
          <Text style={styles.tipBody}>
            Você já comprometeu {committedPercent}% das receitas do mês. Tente reservar 10% antes de
            pagar as contas.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  greeting: {
    ...typography.body,
    color: colors.textMuted,
  },
  name: {
    ...typography.heading,
    color: colors.text,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    backgroundColor: colors.brandDark,
    borderColor: 'transparent',
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.brandSoft,
  },
  balanceAmount: {
    ...typography.amount,
    color: colors.textInverse,
    marginTop: spacing.xs,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  balanceItem: {
    flex: 1,
    backgroundColor: colors.overlayLight,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  balanceItemLabel: {
    ...typography.caption,
    color: colors.brandSoft,
  },
  balanceItemValue: {
    ...typography.subheading,
    color: colors.textInverse,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  sectionLink: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.brand,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  list: {
    gap: spacing.sm,
  },
  tipCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.brandSoft,
    borderColor: 'transparent',
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTexts: {
    flex: 1,
    gap: spacing.xs,
  },
  tipTitle: {
    ...typography.subheading,
    fontSize: 15,
    color: colors.text,
  },
  tipBody: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
