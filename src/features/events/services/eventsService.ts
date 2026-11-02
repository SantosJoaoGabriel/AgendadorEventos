import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  type FirestoreError,
} from 'firebase/firestore';

import { db } from '../../../lib/firebase';
import type { EventItem, NewEventInput } from '../types';

function eventsCollection(uid: string) {
  return collection(db, 'users', uid, 'events');
}

export async function addEvent(uid: string, input: NewEventInput) {
  await addDoc(eventsCollection(uid), {
    description: input.description,
    startDate: input.startDate,
    endDate: input.endDate,
    cep: input.cep,
    address: input.address,
    createdAt: Timestamp.now(),
  });
}

export async function deleteEvent(uid: string, eventId: string) {
  await deleteDoc(doc(db, 'users', uid, 'events', eventId));
}

/** Observa os eventos cadastrados pelo usuário em tempo real */
export function subscribeToEvents(
  uid: string,
  onChange: (events: EventItem[]) => void,
  onError: (error: FirestoreError) => void,
) {
  const eventsQuery = query(eventsCollection(uid), orderBy('createdAt', 'desc'));

  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      const events: EventItem[] = snapshot.docs.map((document) => {
        const data = document.data();
        return {
          id: document.id,
          description: data.description || '',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          cep: data.cep || '',
          address: data.address || '',
          createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
        };
      });
      onChange(events);
    },
    onError,
  );
}

