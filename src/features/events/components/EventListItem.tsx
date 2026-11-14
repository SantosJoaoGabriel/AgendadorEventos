import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button, Card } from '../../../components/ui';
import { colors, radius, spacing, typography } from '../../../constants';
import { useAuthUser } from '../../auth';
import { deleteEvent } from '../services/eventsService';
import type { EventItem } from '../types';

type EventListItemProps = {
  event: EventItem;
  onDeleted?: (eventId: string) => void;
};

export function EventListItem({ event, onDeleted }: EventListItemProps) {
  const { user } = useAuthUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function executeDelete() {
    if (!user?.uid) {
      setModalVisible(false);
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      setDeleting(true);
      await deleteEvent(user.uid, event.id);
      setModalVisible(false);
      onDeleted?.(event.id);
    } catch (err) {
      console.error('[EventListItem] erro ao excluir:', err);
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert('Erro', `Não foi possível excluir o evento: ${msg}`);
    } finally {
      setDeleting(false);
    }
  }

  function handleOpenConfirm() {
    setModalVisible(true);
  }

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.calendarBadge}>
            <Feather name="calendar" size={18} color={colors.brand} />
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>

          <TouchableOpacity
            onPress={handleOpenConfirm}
            activeOpacity={0.6}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.deleteButton}
            accessibilityRole="button"
            accessibilityLabel="Excluir evento"
          >
            <Feather name="trash-2" size={18} color={colors.statusOverdue} />
          </TouchableOpacity>
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

      {/* Modal Customizado e Moderno de Confirmação */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !deleting && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => !deleting && setModalVisible(false)}
          />

          <View style={styles.modalCard}>
            <View style={styles.alertIconBadge}>
              <Feather name="alert-triangle" size={28} color={colors.statusOverdue} />
            </View>

            <Text style={styles.modalTitle}>Excluir Evento?</Text>

            <Text style={styles.modalMessage}>
              Você tem certeza de que deseja excluir o evento{' '}
              <Text style={styles.eventHighlight}>"{event.description}"</Text>? Essa ação não
              poderá ser desfeita.
            </Text>

            <View style={styles.eventInfoBox}>
              <View style={styles.eventInfoRow}>
                <Feather name="calendar" size={14} color={colors.textMuted} />
                <Text style={styles.eventInfoText}>
                  {event.startDate} até {event.endDate}
                </Text>
              </View>
              {!!event.address && (
                <View style={styles.eventInfoRow}>
                  <Feather name="map-pin" size={14} color={colors.textMuted} />
                  <Text style={styles.eventInfoText} numberOfLines={1}>
                    {event.address}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Sim, excluir evento"
                variant="primary"
                onPress={executeDelete}
                loading={deleting}
                disabled={deleting}
                style={styles.confirmDeleteButton}
              />

              <Button
                title="Cancelar"
                variant="ghost"
                onPress={() => setModalVisible(false)}
                disabled={deleting}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    borderRadius: radius.md,
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.statusOverdueBg,
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

  // Estilos do Modal de Confirmação
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  alertIconBadge: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.statusOverdueBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  modalTitle: {
    ...typography.heading,
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },
  modalMessage: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  eventHighlight: {
    color: colors.text,
    fontWeight: '700',
  },
  eventInfoBox: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventInfoText: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
  modalActions: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  confirmDeleteButton: {
    backgroundColor: colors.statusOverdue,
  },
});
