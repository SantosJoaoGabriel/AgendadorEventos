import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Screen, ScreenHeader } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import { useAuthUser } from '../../features/auth';
import { EventListItem, useEvents } from '../../features/events';

const ITEMS_PER_PAGE = 5;

function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia,';
  if (hour < 18) return 'Boa tarde,';
  return 'Boa noite,';
}

export default function HomeScreen() {
  const { user } = useAuthUser();
  const { events, loading } = useEvents();
  const [currentPage, setCurrentPage] = useState(1);

  const displayName = user?.displayName || user?.email?.split('@')[0] || '';

  // Cálculo da paginação
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function handlePrevPage() {
    if (safeCurrentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }

  function handleNextPage() {
    if (safeCurrentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }

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
        {events.length > 0 && (
          <Text style={styles.pageIndicator}>
            Página {safeCurrentPage} de {totalPages}
          </Text>
        )}
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
        <>
          <View style={styles.list}>
            {paginatedEvents.map((event) => (
              <EventListItem key={event.id} event={event} />
            ))}
          </View>

          {totalPages > 1 && (
            <View style={styles.paginationRow}>
              <Button
                title="← Anterior"
                variant="secondary"
                onPress={handlePrevPage}
                disabled={safeCurrentPage <= 1}
                style={styles.paginationButton}
              />

              <View style={styles.pageBadge}>
                <Text style={styles.pageBadgeText}>
                  {safeCurrentPage} / {totalPages}
                </Text>
              </View>

              <Button
                title="Próxima →"
                variant="secondary"
                onPress={handleNextPage}
                disabled={safeCurrentPage >= totalPages}
                style={styles.paginationButton}
              />
            </View>
          )}
        </>
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
  pageIndicator: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
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
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  paginationButton: {
    flex: 1,
    height: 42,
  },
  pageBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBadgeText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
});
