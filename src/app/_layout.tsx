import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * Layout raiz do app.
 * Aqui entram os providers globais (tema, autenticação, cliente de dados...)
 * conforme formos construindo nas aulas.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* TODO (aula): envolver com <AuthProvider> quando a autenticação existir. */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="incomes/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="bills/new" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
