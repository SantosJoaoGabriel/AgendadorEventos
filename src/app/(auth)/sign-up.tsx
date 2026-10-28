import React from 'react';
import { Stack } from 'expo-router';
import { Text } from 'react-native';

import { Screen, ScreenHeader } from '../../components/ui';
import { colors, typography } from '../../constants';

/**
 * Tela: Criar conta (wireframe 5/7).
 * TODO (aula): nome, e-mail, senha, confirmação e validação.
 */
export default function SignUpScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Criar conta' }} />
      <ScreenHeader
        title="Criar conta"
        subtitle="Leva menos de um minuto. Depois é só entrar e começar a organizar."
      />
      <Text style={styles}>TODO: formulário de cadastro.</Text>
    </Screen>
  );
}

const styles = { ...typography.body, color: colors.textMuted };
