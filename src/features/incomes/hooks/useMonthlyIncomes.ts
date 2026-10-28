import { useEffect, useMemo, useState } from 'react';

import { useAuthUser } from '../../auth';
import { addMonths } from '../../../lib/date';
import { subscribeToMonthlyIncomes } from '../services/incomesService';
import { Income } from '../types';

/** Mês atual + lista de receitas em tempo real (Firestore) para o usuário logado. */
export function useMonthlyIncomes() {
  const { user, initializing } = useAuthUser();
  const uid = user?.uid;
  const [month, setMonth] = useState(() => new Date());
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initializing) return;

    if (!uid) {
      setIncomes([]);
      setLoading(false);
      setError('Faça login para ver suas receitas.');
      return;
    }

    setLoading(true);
    setError('');

    const unsubscribe = subscribeToMonthlyIncomes(
      uid,
      month,
      (data) => {
        setIncomes(data);
        setLoading(false);
      },
      () => {
        setError('Não foi possível carregar as receitas.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [uid, initializing, month]);

  const total = useMemo(() => incomes.reduce((sum, income) => sum + income.amount, 0), [incomes]);

  return {
    month,
    incomes,
    total,
    loading,
    error,
    goToPreviousMonth: () => setMonth((current) => addMonths(current, -1)),
    goToNextMonth: () => setMonth((current) => addMonths(current, 1)),
  };
}
