import React from 'react';
import { Tabs } from 'expo-router';

import { colors } from '../../constants';

/**
 * Navegação principal (wireframes 2, 3 e 4): Início · Receitas · Contas.
 * TODO (aula): adicionar os ícones da tab bar (@expo/vector-icons ou expo-symbols).
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Início' }} />
      <Tabs.Screen name="incomes" options={{ title: 'Receitas' }} />
      <Tabs.Screen name="bills" options={{ title: 'Contas' }} />
    </Tabs>
  );
}
