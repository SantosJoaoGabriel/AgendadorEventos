import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Screen, ScreenHeader, TextField } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import { useAuthUser } from '../../features/auth';
import { addEvent } from '../../features/events';

export default function NewEventScreen() {
  const { user } = useAuthUser();
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [searchingCep, setSearchingCep] = useState(false);
  const [cepMessage, setCepMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Formatação de data no padrão dd/mm/aaaa
  function formatDateMask(value: string) {
    const nums = value.replace(/\D/g, '').slice(0, 8);
    if (nums.length <= 2) return nums;
    if (nums.length <= 4) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
    return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4)}`;
  }

  // Formatação de CEP 00000-000 e busca automática ao completar 8 dígitos
  async function handleCepChange(text: string) {
    const raw = text.replace(/\D/g, '').slice(0, 8);
    let formatted = raw;
    if (raw.length > 5) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    }
    setCep(formatted);

    if (raw.length === 8) {
      await fetchAddressByCep(raw);
    } else {
      setCepMessage('');
    }
  }

  async function fetchAddressByCep(cleanCep: string) {
    setSearchingCep(true);
    setCepMessage('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepMessage('CEP não encontrado.');
      } else {
        const fullAddress = [data.logradouro, data.bairro, `${data.localidade} - ${data.uf}`]
          .filter(Boolean)
          .join(', ');
        setAddress(fullAddress);
        setCepMessage('Endereço preenchido automaticamente!');
      }
    } catch {
      setCepMessage('Falha ao consultar o CEP.');
    } finally {
      setSearchingCep(false);
    }
  }

  async function handleSave() {
    if (!description.trim()) {
      setError('Informe a descrição do evento.');
      return;
    }
    if (!startDate.trim() || startDate.length < 10) {
      setError('Informe a data de início válida (dd/mm/aaaa).');
      return;
    }
    if (!endDate.trim() || endDate.length < 10) {
      setError('Informe a data de término válida (dd/mm/aaaa).');
      return;
    }
    if (!user?.uid) {
      setError('Faça login novamente para continuar.');
      return;
    }

    setError('');
    setSaving(true);
    try {
      await addEvent(user.uid, {
        description: description.trim(),
        startDate,
        endDate,
        cep,
        address: address.trim(),
      });
      router.back();
    } catch (err) {
      console.error('[NewEventScreen] erro ao salvar:', err);
      setError('Não foi possível salvar o evento. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <ScreenHeader
        title="Novo Evento"
        subtitle="Preencha os dados para agendar seu evento."
      />

      <View style={styles.form}>
        <TextField
          label="Descrição do Evento"
          placeholder="Ex: Reunião de Planejamento, Aniversário..."
          leftIcon={<Feather name="calendar" size={18} color={colors.textMuted} />}
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <TextField
              label="Data de Início"
              placeholder="dd/mm/aaaa"
              keyboardType="numeric"
              maxLength={10}
              leftIcon={<Feather name="clock" size={18} color={colors.textMuted} />}
              value={startDate}
              onChangeText={(text) => setStartDate(formatDateMask(text))}
            />
          </View>
          <View style={styles.dateField}>
            <TextField
              label="Data de Término"
              placeholder="dd/mm/aaaa"
              keyboardType="numeric"
              maxLength={10}
              leftIcon={<Feather name="clock" size={18} color={colors.textMuted} />}
              value={endDate}
              onChangeText={(text) => setEndDate(formatDateMask(text))}
            />
          </View>
        </View>

        <View>
          <TextField
            label="CEP do Local"
            placeholder="00000-000"
            keyboardType="numeric"
            maxLength={9}
            leftIcon={<Feather name="map-pin" size={18} color={colors.textMuted} />}
            rightElement={
              searchingCep ? (
                <ActivityIndicator size="small" color={colors.brand} />
              ) : undefined
            }
            value={cep}
            onChangeText={handleCepChange}
          />
          {!!cepMessage && (
            <Text
              style={[
                styles.cepMessage,
                cepMessage.includes('Endereço') ? styles.cepSuccess : styles.cepError,
              ]}
            >
              {cepMessage}
            </Text>
          )}
        </View>

        {!!address && (
          <Card style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Feather name="check-circle" size={16} color={colors.brand} />
              <Text style={styles.addressLabel}>Endereço Identificado:</Text>
            </View>
            <Text style={styles.addressValue}>{address}</Text>
          </Card>
        )}

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.actions}>
          <Button
            title="Salvar Evento"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
          />
          <Button
            title="Cancelar"
            variant="ghost"
            onPress={() => router.back()}
            disabled={saving}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateField: {
    flex: 1,
  },
  cepMessage: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  cepSuccess: {
    color: colors.brand,
    fontWeight: '500',
  },
  cepError: {
    color: colors.statusOverdue,
  },
  addressCard: {
    backgroundColor: colors.brandSoft,
    borderColor: 'transparent',
    gap: spacing.xs,
    padding: spacing.md,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  addressLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.brandDark,
  },
  addressValue: {
    ...typography.body,
    color: colors.text,
  },
  errorText: {
    ...typography.caption,
    color: colors.statusOverdue,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});

