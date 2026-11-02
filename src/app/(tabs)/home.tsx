import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Screen, ScreenHeader } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import { useAuthUser } from '../../features/auth';
import { EventListItem, useEvents } from '../../features/events';

function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia,';
  if (hour < 18) return 'Boa tarde,';
  return 'Boa noite,';
}

export default function HomeScreen() {
  const { user } = useAuthUser();
  const { events, loading } = useEvents();

  const displayName = user?.displayName || user?.email?.split('@')[0] || '';

  return (
    <Screen>
      <ScreenHeader
        title={`${getGreeting(new Date())} ${displayName}`}
        subtitle="Gerencie seus eventos e compromissos agendados."
        action={
          <Button
            title="+ Novo Evento"
            onPress={() => router.push('/events/new')}
            style={styles.addButton}
          />
        }
      />

      <Card style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Feather name="calendar" size={24} color={colors.brand} />
        </View>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryLabel}>Total de Eventos</Text>
          <Text style={styles.summaryValue}>
            {events.length} {events.length === 1 ? 'evento agendado' : 'eventos agendados'}
          </Text>
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Seus Eventos</Text>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.brand} />
          <Text style={styles.loadingText}>Carregando eventos...</Text>
        </View>
      )}

      {!loading && events.length === 0 && (
        <Card style={styles.emptyCard}>
          <View style={styles.emptyIconContainer}>
            <Feather name="calendar" size={32} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum evento agendado</Text>
          <Text style={styles.emptySubtitle}>
            Toque no botão "+ Novo Evento" acima para cadastrar seu primeiro compromisso.
          </Text>
        </Card>
      )}

      {!loading && events.length > 0 && (
        <View style={styles.list}>
          {events.map((event) => (
            <EventListItem key={event.id} event={event} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  addButton: {
    height: 38,
    paddingHorizontal: spacing.md,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.brandSoft,
    borderColor: 'transparent',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.brandDark,
    fontWeight: '600',
  },
  summaryValue: {
    ...typography.subheading,
    color: colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textMuted,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  emptySubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  list: {
    gap: spacing.md,
  },
});
