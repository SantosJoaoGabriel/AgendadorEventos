import React from 'react';
import { Stack } from 'expo-router';

/** Fluxo de entrada: login e cadastro. */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
