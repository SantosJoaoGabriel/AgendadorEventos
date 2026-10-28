import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '../../../lib/firebase';

/**
 * A sessão do Firebase é restaurada de forma assíncrona (AsyncStorage/IndexedDB).
 * `auth.currentUser` pode estar null por um instante logo após o app abrir —
 * por isso `initializing` deve ser checado antes de decidir "usuário deslogado".
 */
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [initializing, setInitializing] = useState(auth.currentUser === null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  return { user, initializing };
}
