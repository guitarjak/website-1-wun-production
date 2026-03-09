import { dev } from '$app/environment';

const FBCLID_COOKIE_NAME = 'fbclid';
const FBCLID_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const FBCLID_PATTERN = /^[A-Za-z0-9._-]{8,500}$/;

function logDev(message: string, value?: unknown) {
  if (!dev) return;

  if (value === undefined) {
    console.debug(`[fbclid] ${message}`);
    return;
  }

  console.debug(`[fbclid] ${message}`, value);
}

function isValidFbclid(value: string | null | undefined): value is string {
  return typeof value === 'string' && FBCLID_PATTERN.test(value);
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${name}=${encodeURIComponent(value)}; Max-Age=${FBCLID_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

export function getFbclidFromUrl(url = typeof window !== 'undefined' ? window.location.href : '') {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url, typeof window !== 'undefined' ? window.location.origin : undefined);
    const fbclid = parsedUrl.searchParams.get('fbclid');

    return isValidFbclid(fbclid) ? fbclid : null;
  } catch {
    return null;
  }
}

export function getStoredFbclid() {
  const cookieValue = readCookie(FBCLID_COOKIE_NAME);
  if (isValidFbclid(cookieValue)) {
    return cookieValue;
  }

  if (typeof window === 'undefined') return null;

  try {
    const storageValue = window.localStorage.getItem(FBCLID_COOKIE_NAME);
    return isValidFbclid(storageValue) ? storageValue : null;
  } catch {
    return null;
  }
}

export function storeFbclid(fbclid: string | null | undefined) {
  if (!isValidFbclid(fbclid) || typeof window === 'undefined') return;

  writeCookie(FBCLID_COOKIE_NAME, fbclid);

  try {
    window.localStorage.setItem(FBCLID_COOKIE_NAME, fbclid);
  } catch {
    // Ignore storage failures and rely on the cookie.
  }

  logDev('fbclid persisted', fbclid);
}

export function appendFbclidToUrl(url: string) {
  const fbclid = getFbclidFromUrl() ?? getStoredFbclid();

  if (!fbclid) {
    return url;
  }

  try {
    const parsedUrl = new URL(url, typeof window !== 'undefined' ? window.location.origin : undefined);
    parsedUrl.searchParams.set('fbclid', fbclid);
    const finalUrl = parsedUrl.toString();

    logDev('final Buy Now redirect URL', finalUrl);
    return finalUrl;
  } catch {
    return url;
  }
}

export function captureAndStoreFbclid() {
  const fbclid = getFbclidFromUrl();

  if (!fbclid) return null;

  logDev('fbclid captured', fbclid);
  storeFbclid(fbclid);
  return fbclid;
}
