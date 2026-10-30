import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Screen, ScreenHeader } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import { signOut, useAuthUser } from '../../features/auth';

export default function SettingsScreen() {
  const { user } = useAuthUser();

  const displayName = user?.displayName || 'Usuário';
  const email = user?.email || 'Não informado';

  async function handleSignOut() {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/sign-in');
          } catch (err) {
            console.error('[settings] erro ao sair:', err);
          }
        },
      },
    ]);
  }

  return (
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
          <Pressable style={styles.menuItem} onPress={handleSignOut}>
            <View style={[styles.menuIcon, { backgroundColor: colors.statusOverdueBg }]}>
              <Feather name="log-out" size={18} color={colors.statusOverdue} />
            </View>
            <Text style={[styles.menuText, { color: colors.statusOverdue }]}>
              Sair da conta
            </Text>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </Pressable>
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
});

