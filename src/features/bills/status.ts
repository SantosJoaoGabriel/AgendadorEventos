import type { Bill, BillStatus } from './types';

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Deriva o status visual da conta a partir de paidAt/dueAt.
 * "dueSoon" cobre contas que vencem hoje ou amanhã (rótulo "Amanhã" no wireframe).
 */
export function getBillStatus(bill: Bill, referenceDate: Date = new Date()): BillStatus {
  if (bill.paidAt) return 'paid';

  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(
    (startOfDay(new Date(bill.dueAt)).getTime() - startOfDay(referenceDate).getTime()) / oneDay,
  );

  if (diffDays < 0) return 'overdue';
  if (diffDays <= 1) return 'dueSoon';
  return 'pending';
}
