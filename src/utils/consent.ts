export type ConsentChoice = 'accepted' | 'declined';

const STORAGE_KEY = 'analytics_consent';

export function getConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'accepted' || stored === 'declined') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    return;
  }
  try {
    window.dispatchEvent(
      new CustomEvent('consent:change', { detail: { choice } })
    );
  } catch {
    return;
  }
}

export function hasConsented(): boolean {
  return getConsent() === 'accepted';
}
