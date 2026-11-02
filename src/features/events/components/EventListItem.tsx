import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../../components/ui';
import { colors, radius, spacing, typography } from '../../../constants';
import { useAuthUser } from '../../auth';
import { deleteEvent } from '../services/eventsService';
import type { EventItem } from '../types';

type EventListItemProps = {
  event: EventItem;
};

export function EventListItem({ event }: EventListItemProps) {
  const { user } = useAuthUser();

  function handleDelete() {
    if (!user?.uid) return;
    Alert.alert('Excluir evento', `Deseja remover "${event.description}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEvent(user.uid, event.id);
          } catch (err) {
            console.error('[EventListItem] erro ao excluir:', err);
          }
        },
      },
    ]);
  }

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.calendarBadge}>
          <Feather name="calendar" size={18} color={colors.brand} />
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>
        <Pressable
          onPress={handleDelete}
          hitSlop={8}
          style={styles.deleteButton}
          accessibilityLabel="Excluir evento"
        >
          <Feather name="trash-2" size={16} color={colors.statusOverdue} />
        </Pressable>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Feather name="clock" size={14} color={colors.textMuted} />
          <Text style={styles.detailText}>
            De <Text style={styles.bold}>{event.startDate}</Text> até{' '}
            <Text style={styles.bold}>{event.endDate}</Text>
          </Text>
        </View>

        {!!event.address && (
          <View style={styles.detailRow}>
            <Feather name="map-pin" size={14} color={colors.textMuted} />
            <Text style={styles.detailText} numberOfLines={2}>
              {event.address} {event.cep ? `(CEP: ${event.cep})` : ''}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  calendarBadge: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    ...typography.subheading,
    color: colors.text,
    flex: 1,
    fontSize: 16,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  details: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
  bold: {
    color: colors.text,
    fontWeight: '600',
  },
});

