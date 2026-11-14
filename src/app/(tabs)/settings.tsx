import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button, Card, Screen, ScreenHeader } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import { signOut, useAuthUser } from '../../features/auth';

export default function SettingsScreen() {
  const { user } = useAuthUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const displayName = user?.displayName || 'Usuário';
  const email = user?.email || 'Não informado';

  async function executeSignOut() {
    try {
      setSigningOut(true);
      await signOut();
      setModalVisible(false);
      router.replace('/sign-in');
    } catch (err) {
      console.error('[settings] erro ao sair:', err);
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert('Erro ao sair', msg);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      <Screen>
        <ScreenHeader
          title="Configurações"
          subtitle="Gerencie seu perfil e preferências do aplicativo."
        />

        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Feather name="user" size={32} color={colors.brand} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Conta</Text>

          <Card style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityLabel="Sair da conta"
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.statusOverdueBg }]}>
                <Feather name="log-out" size={18} color={colors.statusOverdue} />
              </View>
              <Text style={[styles.menuText, { color: colors.statusOverdue }]}>
                Sair da conta
              </Text>
              <Feather name="chevron-right" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sobre o aplicativo</Text>

          <Card style={styles.menuCard}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Nome</Text>
              <Text style={styles.aboutValue}>Agendador de Eventos</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Versão</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
          </Card>
        </View>
      </Screen>

      {/* Modal Customizado de Confirmação de Logout */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !signingOut && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => !signingOut && setModalVisible(false)}
          />

          <View style={styles.modalCard}>
            <View style={styles.alertIconBadge}>
              <Feather name="log-out" size={28} color={colors.statusOverdue} />
            </View>

            <Text style={styles.modalTitle}>Sair da conta?</Text>

            <Text style={styles.modalMessage}>
              Tem certeza que deseja desconectar de{' '}
              <Text style={styles.userHighlight}>{email}</Text>? Você precisará fazer login
              novamente para acessar seus eventos.
            </Text>

            <View style={styles.modalActions}>
              <Button
                title="Sim, sair da conta"
                variant="primary"
                onPress={executeSignOut}
                loading={signingOut}
                disabled={signingOut}
                style={styles.confirmSignOutButton}
              />

              <Button
                title="Cancelar"
                variant="ghost"
                onPress={() => setModalVisible(false)}
                disabled={signingOut}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  profileName: {
    ...typography.subheading,
    color: colors.text,
  },
  profileEmail: {
    ...typography.caption,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    ...typography.body,
    fontWeight: '500',
    flex: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  aboutLabel: {
    ...typography.body,
    color: colors.textMuted,
  },
  aboutValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Estilos do Modal de Logout
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
  userHighlight: {
    color: colors.text,
    fontWeight: '700',
  },
  modalActions: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  confirmSignOutButton: {
    backgroundColor: colors.statusOverdue,
  },
});
