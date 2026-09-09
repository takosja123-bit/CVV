// Best-effort browser device identification.
// NOTE: This is a client-side-only signal. A determined user can clear storage,
// use a private/incognito window, or switch browsers to obtain a new ID. There is
// no way to achieve a truly unspoofable device ban without a server component
// (e.g. IP-based blocking via Cloud Functions). This gives a strong deterrent
// against casual repeat troll accounts, not a guarantee.

const DEVICE_ID_KEY = 'jobcraft_device_id_v1';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `dev-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Returns a persistent random ID stored in localStorage for this browser.
 * This is the primary identifier used for blocking.
 */
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode edge cases) — fall back to a
    // session-only id so the app doesn't crash; blocking simply won't persist.
    return generateId();
  }
}

/**
 * A lightweight secondary fingerprint derived from browser/environment
 * characteristics. It is far weaker than the stored device ID (many users can
 * share the same fingerprint, and it changes with browser updates), but it adds
 * a second signal an admin can optionally block on if a troll clears storage
 * but keeps using the same machine/browser.
 */
export function getBrowserFingerprint(): string {
  try {
    const parts = [
      navigator.userAgent,
      navigator.language,
      String(screen.colorDepth),
      `${screen.width}x${screen.height}`,
      String(new Date().getTimezoneOffset()),
      String((navigator as any).hardwareConcurrency || ''),
    ];
    const raw = parts.join('|');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `fp-${Math.abs(hash)}`;
  } catch {
    return 'fp-unknown';
  }
}
