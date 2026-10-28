import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type FirestoreError,
} from 'firebase/firestore';

import { endOfMonth, startOfMonth } from '../../../lib/date';
import { db } from '../../../lib/firebase';
import { Bill, NewBillInput } from '../types';

function billsCollection(uid: string) {
  return collection(db, 'users', uid, 'bills');
}

export async function addBill(uid: string, input: NewBillInput) {
  await addDoc(billsCollection(uid), {
    amount: input.amount,
    description: input.description,
    category: input.category,
    recurring: input.recurring,
    dueAt: Timestamp.fromDate(new Date(input.dueAt)),
    paidAt: null,
  });
}

/** Marca/desmarca uma conta como paga (toque no círculo da lista). */
export async function setBillPaid(uid: string, billId: string, paid: boolean) {
  await updateDoc(doc(db, 'users', uid, 'bills', billId), {
    paidAt: paid ? Timestamp.now() : null,
  });
}

/** Observa em tempo real as contas do usuário com vencimento dentro do mês informado. */
export function subscribeToMonthlyBills(
  uid: string,
  month: Date,
  onChange: (bills: Bill[]) => void,
  onError: (error: FirestoreError) => void,
) {
  const monthQuery = query(
    billsCollection(uid),
    where('dueAt', '>=', Timestamp.fromDate(startOfMonth(month))),
    where('dueAt', '<=', Timestamp.fromDate(endOfMonth(month))),
    orderBy('dueAt', 'asc'),
  );

  return onSnapshot(
    monthQuery,
    (snapshot) => {
      const bills = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          amount: data.amount as number,
          description: data.description as string,
          category: data.category as Bill['category'],
          recurring: Boolean(data.recurring),
          dueAt: (data.dueAt as Timestamp).toDate().toISOString(),
          paidAt: data.paidAt ? (data.paidAt as Timestamp).toDate().toISOString() : null,
        };
      });
      onChange(bills);
    },
    onError,
  );
}
