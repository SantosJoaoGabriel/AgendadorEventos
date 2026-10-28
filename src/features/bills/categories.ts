import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { colors } from '../../constants';
import type { BillCategory, BillStatus } from './types';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

export const BILL_CATEGORY_OPTIONS: { value: BillCategory; label: string }[] = [
  { value: 'housing', label: 'Moradia' },
  { value: 'services', label: 'Serviços' },
  { value: 'education', label: 'Educação' },
  { value: 'card', label: 'Cartão' },
  { value: 'other', label: 'Outros' },
];

export const BILL_CATEGORY_LABELS: Record<BillCategory, string> = {
  housing: 'Moradia',
  services: 'Serviços',
  education: 'Educação',
  card: 'Cartão',
  other: 'Outros',
};

export const BILL_CATEGORY_ICONS: Record<BillCategory, FeatherIconName> = {
  housing: 'home',
  services: 'zap',
  education: 'book',
  card: 'credit-card',
  other: 'more-horizontal',
};

export const BILL_STATUS_LABELS: Record<BillStatus, string> = {
  paid: 'Paga',
  pending: 'Pendente',
  dueSoon: 'Amanhã',
  overdue: 'Atrasada',
};

export const BILL_STATUS_COLORS: Record<BillStatus, { text: string; bg: string }> = {
  paid: { text: colors.statusPaid, bg: colors.statusPaidBg },
  pending: { text: colors.statusPending, bg: colors.statusPendingBg },
  dueSoon: { text: colors.statusDueSoon, bg: colors.statusDueSoonBg },
  overdue: { text: colors.statusOverdue, bg: colors.statusOverdueBg },
};
