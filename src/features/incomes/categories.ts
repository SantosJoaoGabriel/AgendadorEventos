import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import type { IncomeCategory } from './types';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

export const INCOME_CATEGORY_OPTIONS: { value: IncomeCategory; label: string }[] = [
  { value: 'work', label: 'Trabalho' },
  { value: 'extra', label: 'Extra' },
  { value: 'sale', label: 'Venda' },
  { value: 'other', label: 'Outros' },
];

export const INCOME_CATEGORY_LABELS: Record<IncomeCategory, string> = {
  work: 'Trabalho',
  extra: 'Extra',
  sale: 'Venda',
  other: 'Outros',
};

export const INCOME_CATEGORY_ICONS: Record<IncomeCategory, FeatherIconName> = {
  work: 'briefcase',
  extra: 'monitor',
  sale: 'tag',
  other: 'dollar-sign',
};
