import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  type FirestoreError,
} from 'firebase/firestore';

import { endOfMonth, startOfMonth } from '../../../lib/date';
import { db } from '../../../lib/firebase';
import { Income, NewIncomeInput } from '../types';

function incomesCollection(uid: string) {
  return collection(db, 'users', uid, 'incomes');
}

export async function addIncome(uid: string, input: NewIncomeInput) {
  await addDoc(incomesCollection(uid), {
    amount: input.amount,
    description: input.description,
    category: input.category,
    receivedAt: Timestamp.fromDate(new Date(input.receivedAt)),
  });
}

/** Observa em tempo real os lançamentos do usuário dentro do mês informado. */
export function subscribeToMonthlyIncomes(
  uid: string,
  month: Date,
  onChange: (incomes: Income[]) => void,
  onError: (error: FirestoreError) => void,
) {
  const monthQuery = query(
    incomesCollection(uid),
    where('receivedAt', '>=', Timestamp.fromDate(startOfMonth(month))),
    where('receivedAt', '<=', Timestamp.fromDate(endOfMonth(month))),
    orderBy('receivedAt', 'desc'),
  );

  return onSnapshot(
    monthQuery,
    (snapshot) => {
      const incomes = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          amount: data.amount as number,
          description: data.description as string,
          category: data.category as Income['category'],
          receivedAt: (data.receivedAt as Timestamp).toDate().toISOString(),
        };
      });
      onChange(incomes);
    },
    onError,
  );
}
