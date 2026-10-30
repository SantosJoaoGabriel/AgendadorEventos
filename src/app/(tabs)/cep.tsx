import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Screen, ScreenHeader, TextField } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';

type CepData = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

export default function CepScreen() {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cepData, setCepData] = useState<CepData | null>(null);

  function formatCep(value: string) {
    const numbers = value.replace(/\D/g, '').slice(0, 8);
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  }

  function handleCepChange(text: string) {
    setCep(formatCep(text));
    if (error) setError('');
  }

  async function handleSearchCep() {
    const rawCep = cep.replace(/\D/g, '');
    if (rawCep.length !== 8) {
      setError('Informe um CEP válido com 8 dígitos.');
      return;
    }

    setError('');
    setCepData(null);
    setLoading(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado.');
      } else {
        setCepData(data);
      }
    } catch {
      setError('Falha ao consultar o CEP. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScreenHeader
        title="Validar CEP"
        subtitle="Consulte endereços rapidamente para seus eventos."
      />

      <View style={styles.searchSection}>
        <TextField
          label="CEP"
          placeholder="00000-000"
          keyboardType="numeric"
          maxLength={9}
          leftIcon={<Feather name="map-pin" size={18} color={colors.textMuted} />}
          value={cep}
          onChangeText={handleCepChange}
        />

        <Button
          title="Buscar Endereço"
          onPress={handleSearchCep}
          loading={loading}
          disabled={loading}
        />
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.brand} />
          <Text style={styles.loadingText}>Buscando endereço...</Text>
        </View>
      )}

      {cepData && !loading && (
        <Card style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.pinBadge}>
              <Feather name="map-pin" size={20} color={colors.brand} />
            </View>
            <View style={styles.resultTitles}>
              <Text style={styles.resultCity}>
                {cepData.localidade} - {cepData.uf}
              </Text>
              <Text style={styles.resultCep}>CEP: {cepData.cep}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Logradouro</Text>
            <Text style={styles.infoValue}>{cepData.logradouro || 'Não informado'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bairro</Text>
            <Text style={styles.infoValue}>{cepData.bairro || 'Não informado'}</Text>
          </View>

          {!!cepData.complemento && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Complemento</Text>
              <Text style={styles.infoValue}>{cepData.complemento}</Text>
            </View>
          )}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    gap: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: colors.statusOverdue,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  loadingText: {
    ...typography.body,
    color: colors.textMuted,
  },
  resultCard: {
    gap: spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pinBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitles: {
    flex: 1,
  },
  resultCity: {
    ...typography.subheading,
    color: colors.text,
  },
  resultCep: {
    ...typography.caption,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.body,
    fontWeight: '500',
    color: colors.text,
  },
});

