import { useEffect, useMemo, useState } from 'react';

import { useAuthUser } from '../../auth';
import { addMonths } from '../../../lib/date';
import { subscribeToMonthlyBills } from '../services/billsService';
import { getBillStatus } from '../status';
import { Bill } from '../types';

export type BillFilter = 'all' | 'pending' | 'paid';

/** Mês atual + lista de contas em tempo real (Firestore) para o usuário logado. */
export function useMonthlyBills(filter: BillFilter) {
  const { user, initializing } = useAuthUser();
  const uid = user?.uid;
  const [month, setMonth] = useState(() => new Date());
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initializing) return;

    if (!uid) {
      setBills([]);
      setLoading(false);
      setError('Faça login para ver suas contas.');
      return;
    }

    setLoading(true);
    setError('');

    const unsubscribe = subscribeToMonthlyBills(
      uid,
      month,
      (data) => {
        setBills(data);
        setLoading(false);
      },
      () => {
        setError('Não foi possível carregar as contas.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [uid, initializing, month]);

  const unpaidBills = useMemo(
    () => bills.filter((bill) => getBillStatus(bill) !== 'paid'),
    [bills],
  );
  const paidBills = useMemo(() => bills.filter((bill) => getBillStatus(bill) === 'paid'), [bills]);

  const dueTotal = useMemo(
    () => unpaidBills.reduce((sum, bill) => sum + bill.amount, 0),
    [unpaidBills],
  );
  const paidTotal = useMemo(
    () => paidBills.reduce((sum, bill) => sum + bill.amount, 0),
    [paidBills],
  );

  const filteredBills = useMemo(() => {
    if (filter === 'paid') return paidBills;
    if (filter === 'pending') return unpaidBills;
    return bills;
  }, [bills, filter, paidBills, unpaidBills]);

  return {
    month,
    bills: filteredBills,
    dueTotal,
    dueCount: unpaidBills.length,
    paidTotal,
    paidCount: paidBills.length,
    loading,
    error,
    goToPreviousMonth: () => setMonth((current) => addMonths(current, -1)),
    goToNextMonth: () => setMonth((current) => addMonths(current, 1)),
  };
}
