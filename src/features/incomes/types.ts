import type { ID, Money } from '../../types';

export type IncomeCategory = 'work' | 'extra' | 'sale' | 'other';

export type Income = {
  id: ID;
  amount: Money;
  description: string;
  receivedAt: string; // ISO
  category: IncomeCategory;
};

export type NewIncomeInput = Omit<Income, 'id'>;
