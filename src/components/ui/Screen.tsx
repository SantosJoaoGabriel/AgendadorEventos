import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../../constants';

type ScreenProps = {
  children: ReactNode;
  /** Quando true, o conteúdo rola. Use false em telas com lista própria (FlatList). */
  scroll?: boolean;
  style?: ViewStyle;
};

/** Container padrão de todas as telas: safe area + fundo + padding horizontal. */
export function Screen({ children, scroll = true, style }: ScreenProps) {
  const Container = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Container
        style={[styles.container, style]}
        contentContainerStyle={scroll ? styles.content : undefined}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
});
