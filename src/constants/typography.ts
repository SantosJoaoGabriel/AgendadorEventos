import { TextStyle } from 'react-native';

/** Estilos de texto reutilizáveis. Trocar a família da fonte aqui afeta o app inteiro. */
export const typography = {
  title: { fontSize: 28, fontWeight: '700' },
  heading: { fontSize: 20, fontWeight: '700' },
  subheading: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
  amount: { fontSize: 32, fontWeight: '700' },
} satisfies Record<string, TextStyle>;
