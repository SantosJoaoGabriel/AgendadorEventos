import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Screen, TextField } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import { getAuthErrorMessage, resetPassword, signIn } from '../../features/auth';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) {
      setError('Informe e-mail e senha para continuar.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signIn({ email, password });
      router.replace('/home');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Informe seu e-mail para receber o link de redefinição.');
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert('E-mail enviado', 'Verifique sua caixa de entrada para redefinir a senha.');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  }

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons
              name="notebook-outline"
              size={42}
              color={colors.brand}
            />
          </View>
          <Text style={styles.title}>Agendador de Eventos</Text>
          <Text style={styles.subtitle}>Gerencie e acompanhe seus compromissos.</Text>
        </View>

        <View style={styles.form}>
          <TextField
            label="E-mail"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={<Feather name="mail" size={18} color={colors.textMuted} />}
            value={email}
            onChangeText={setEmail}
          />

          <View>
            <TextField
              label="Senha"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              leftIcon={<Feather name="lock" size={18} color={colors.textMuted} />}
              rightElement={
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={colors.textMuted}
                  />
                </Pressable>
              }
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={handleForgotPassword} hitSlop={8} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </Pressable>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.actions}>
            <Button title="Entrar" onPress={handleSignIn} loading={loading} />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <Link href="/sign-up" asChild>
              <Button title="Criar conta" variant="secondary" />
            </Link>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: radius.xl,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.heading,
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  form: {
    gap: spacing.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  forgotPasswordText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.brand,
  },
  errorText: {
    ...typography.caption,
    color: colors.statusOverdue,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
