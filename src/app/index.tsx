import React from 'react';
import { Redirect } from 'expo-router';

/**
 * Rota inicial: por enquanto sempre manda para o login.
 * TODO (aula): decidir o destino a partir da sessão do usuário.
 */
export default function Index() {
  return <Redirect href="/sign-in" />;
}
