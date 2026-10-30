import { Feather } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Screen, ScreenHeader, TextField } from '../../components/ui';
import { colors, radius, spacing, typography } from '../../constants';
import { getAuthErrorMessage, signUp } from '../../features/auth';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!name.trim() || !email.trim() || !password || !passwordConfirmation) {
      setError('Preencha todos os campos para continuar.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('As senhas não coincidem.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        passwordConfirmation,
      });
      router.replace('/home');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Criar conta', headerShown: false }} />

      <ScreenHeader
        title="Criar conta"
        subtitle="Crie sua conta para gerenciar seus eventos e compromissos."
      />

      <View style={styles.form}>
        <TextField
          label="Nome completo"
          placeholder="Ex: João da Silva"
          autoCapitalize="words"
          autoComplete="name"
          leftIcon={<Feather name="user" size={18} color={colors.textMuted} />}
          value={name}
          onChangeText={setName}
        />

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

        <TextField
          label="Senha"
          placeholder="Mínimo 6 caracteres"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="new-password"
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

        <TextField
          label="Confirmar senha"
          placeholder="Repita sua senha"
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          autoComplete="new-password"
          leftIcon={<Feather name="lock" size={18} color={colors.textMuted} />}
          rightElement={
            <Pressable
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <Feather
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          }
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
        />

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.actions}>
          <Button title="Cadastrar" onPress={handleSignUp} loading={loading} />

          <View style={styles.footerLink}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <Link href="/sign-in" asChild>
              <Pressable hitSlop={8}>
                <Text style={styles.signInLink}>Fazer login</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: colors.statusOverdue,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  signInLink: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.brand,
  },
});
