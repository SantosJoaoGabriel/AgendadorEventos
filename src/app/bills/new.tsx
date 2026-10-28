import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Button, Card, Screen, TextField } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import { addBill, BILL_CATEGORY_OPTIONS, type BillCategory } from '../../features/bills';
import { useAuthUser } from '../../features/auth';
import { formatInputDate, parseInputDate } from '../../lib/date';

export default function NewBillScreen() {
  const { user } = useAuthUser();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueAt, setDueAt] = useState(() => formatInputDate(new Date()));
  const [category, setCategory] = useState<BillCategory>('housing');
  const [recurring, setRecurring] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const parsedAmount = Number(amount.replace(',', '.'));
    const parsedDate = parseInputDate(dueAt);

    if (!parsedAmount || parsedAmount <= 0) {
      setError('Informe um valor válido.');
      return;
    }
    if (!description.trim()) {
      setError('Informe uma descrição.');
      return;
    }
    if (!parsedDate) {
      setError('Informe a data no formato dd/mm/aaaa.');
      return;
    }

    const uid = user?.uid;
    if (!uid) {
      setError('Faça login novamente para continuar.');
      return;
    }

    setError('');
    setSaving(true);
    try {
      await addBill(uid, {
        amount: parsedAmount,
        description: description.trim(),
        dueAt: parsedDate.toISOString(),
        category,
        recurring,
      });
      router.back();
    } catch (err) {
      console.error('[bills/new] falha ao salvar conta:', err);
      const message = err instanceof Error ? err.message : String(err);
      setError(`Não foi possível salvar a conta: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Nova conta a pagar</Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Valor"
          placeholder="0,00"
          keyboardType="decimal-pad"
          leftIcon={<Text style={styles.currencyPrefix}>R$</Text>}
          value={amount}
          onChangeText={setAmount}
        />

        <TextField
          label="Descrição"
          placeholder="Ex.: Aluguel, internet…"
          leftIcon={<Feather name="align-left" size={18} color={colors.textMuted} />}
          value={description}
          onChangeText={setDescription}
        />

        <TextField
          label="Vencimento"
          placeholder="dd/mm/aaaa"
          keyboardType="numbers-and-punctuation"
          leftIcon={<Feather name="calendar" size={18} color={colors.textMuted} />}
          value={dueAt}
          onChangeText={setDueAt}
        />

        <View style={styles.categoryField}>
          <Text style={styles.categoryLabel}>Categoria</Text>
          <View style={styles.categoryOptions}>
            {BILL_CATEGORY_OPTIONS.map((option) => {
              const selected = option.value === category;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setCategory(option.value)}
                  style={[styles.categoryPill, selected && styles.categoryPillSelected]}
                >
                  <Text
                    style={[styles.categoryPillText, selected && styles.categoryPillTextSelected]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Card style={styles.recurringCard}>
          <View style={styles.recurringTexts}>
            <Text style={styles.recurringTitle}>Repetir todo mês</Text>
            <Text style={styles.recurringSubtitle}>
              Cria a conta automaticamente nos próximos meses
            </Text>
          </View>
          <Switch
            value={recurring}
            onValueChange={setRecurring}
            trackColor={{ false: colors.border, true: colors.brand }}
            thumbColor={colors.surface}
          />
        </Card>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Button title="Salvar conta" onPress={handleSave} loading={saving} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  form: {
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  currencyPrefix: {
    ...typography.subheading,
    color: colors.textMuted,
  },
  categoryField: {
    gap: spacing.sm,
  },
  categoryLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryPill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryPillSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  categoryPillText: {
    ...typography.subheading,
    fontSize: 14,
    color: colors.text,
  },
  categoryPillTextSelected: {
    color: colors.textInverse,
  },
  recurringCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  recurringTexts: {
    flex: 1,
    gap: spacing.xs,
  },
  recurringTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  recurringSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  error: {
    ...typography.caption,
    color: colors.statusOverdue,
    textAlign: 'center',
  },
});
