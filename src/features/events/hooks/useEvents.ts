import { useEffect, useState } from 'react';
import { useAuthUser } from '../../auth';
import type { EventItem } from '../types';
import { subscribeToEvents } from '../services/eventsService';

export function useEvents() {
  const { user } = useAuthUser();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToEvents(
      user.uid,
      (nextEvents) => {
        setEvents(nextEvents);
        setLoading(false);
      },
      (err) => {
        console.error('[useEvents] erro ao carregar eventos:', err);
        setError(err);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user?.uid]);

  return { events, loading, error };
}

