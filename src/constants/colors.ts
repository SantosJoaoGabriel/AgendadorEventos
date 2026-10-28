/**
 * Paleta do Guia Financeiro (extraída do wireframe).
 * Regra do projeto: nenhum componente escreve cor "na mão" — sempre importar daqui.
 */
export const colors = {
  brand: '#167E57',
  brandDark: '#0F5D3F',
  brandSoft: '#E7F3EC',

  background: '#F4F5F6',
  surface: '#FFFFFF',
  border: '#E4E6E8',

  text: '#1B1D1E',
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',

  income: '#167E57',
  expense: '#C2410C',

  /** Painel translúcido sobre o card de saldo (fundo brandDark) na tela Início. */
  overlayLight: 'rgba(255, 255, 255, 0.14)',

  // status das contas a pagar
  statusPaid: '#167E57',
  statusPaidBg: '#E7F3EC',
  statusPending: '#6B7280',
  statusPendingBg: '#EFF1F2',
  statusDueSoon: '#B45309',
  statusDueSoonBg: '#FDF3DC',
  statusOverdue: '#B91C1C',
  statusOverdueBg: '#FDE8E8',
} as const;

export type ColorName = keyof typeof colors;
