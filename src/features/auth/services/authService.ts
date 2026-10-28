import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type AuthError,
} from 'firebase/auth';

import { auth } from '../../../lib/firebase';
import { SignInInput } from '../types';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente em instantes.',
  'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
};

/** Traduz erros do Firebase Auth para mensagens amigáveis em pt-BR. */
export function getAuthErrorMessage(error: unknown): string {
  const code = (error as AuthError)?.code;
  return (code && ERROR_MESSAGES[code]) || 'Não foi possível entrar. Tente novamente.';
}

export async function signIn({ email, password }: SignInInput) {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function signOut() {
  await firebaseSignOut(auth);
}
