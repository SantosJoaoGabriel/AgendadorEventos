import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Screen, TextField } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import { addIncome, INCOME_CATEGORY_OPTIONS, type IncomeCategory } from '../../features/incomes';
import { useAuthUser } from '../../features/auth';
import { formatInputDate, parseInputDate } from '../../lib/date';

export default function NewIncomeScreen() {
  const { user } = useAuthUser();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [receivedAt, setReceivedAt] = useState(() => formatInputDate(new Date()));
  const [category, setCategory] = useState<IncomeCategory>('work');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const parsedAmount = Number(amount.replace(',', '.'));
    const parsedDate = parseInputDate(receivedAt);

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
      await addIncome(uid, {
        amount: parsedAmount,
        description: description.trim(),
        receivedAt: parsedDate.toISOString(),
        category,
      });
      router.back();
    } catch (err) {
      console.error('[incomes/new] falha ao salvar receita:', err);
      const message = err instanceof Error ? err.message : String(err);
      setError(`Não foi possível salvar a receita: ${message}`);
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
        <Text style={styles.title}>Nova receita</Text>
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
          placeholder="Ex.: Salário, freelance…"
          leftIcon={<Feather name="align-left" size={18} color={colors.textMuted} />}
          value={description}
          onChangeText={setDescription}
        />

        <TextField
          label="Data de recebimento"
          placeholder="dd/mm/aaaa"
          keyboardType="numbers-and-punctuation"
          leftIcon={<Feather name="calendar" size={18} color={colors.textMuted} />}
          value={receivedAt}
          onChangeText={setReceivedAt}
        />

        <View style={styles.categoryField}>
          <Text style={styles.categoryLabel}>Categoria</Text>
          <View style={styles.categoryOptions}>
            {INCOME_CATEGORY_OPTIONS.map((option) => {
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

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Button title="Salvar receita" onPress={handleSave} loading={saving} />
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
  error: {
    ...typography.caption,
    color: colors.statusOverdue,
    textAlign: 'center',
  },
});
