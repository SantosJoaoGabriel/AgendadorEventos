import type { ID, Money } from '../../types';

export type BillCategory = 'housing' | 'services' | 'education' | 'card' | 'other';

export type BillStatus = 'paid' | 'pending' | 'dueSoon' | 'overdue';

export type Bill = {
  id: ID;
  amount: Money;
  description: string;
  dueAt: string; // ISO
  category: BillCategory;
  paidAt: string | null;
  /** Repetir todo mês (switch da tela "Nova conta a pagar"). */
  recurring: boolean;
};

export type NewBillInput = Omit<Bill, 'id' | 'paidAt'>;
