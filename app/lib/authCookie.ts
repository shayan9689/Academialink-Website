/**
 * Simple session flag for "signed in" state. Replace with real auth/cookies later.
 * Uses sessionStorage so state is per-tab and cleared when tab closes.
 */

const KEY = 'academialink_signed_in';

export function setSessionCookie(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(KEY, '1');
  }
}

export function clearSessionCookie(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(KEY);
  }
}

export function isSignedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(KEY) === '1';
}
