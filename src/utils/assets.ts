/**
 * Resolves static image asset URLs against Vite's configured BASE_URL.
 * Ensures both `/assets/images/...` and legacy `/src/assets/images/...` paths
 * resolve to the served `public/assets/images/...` files in dev and production builds.
 */
export function resolveAssetUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (/^(https?:|data:|blob:)/i.test(url)) {
    return url;
  }

  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  let normalized = url.trim();
  if (normalized.startsWith('/src/assets/')) {
    normalized = normalized.slice('/src'.length);
  } else if (normalized.startsWith('src/assets/')) {
    normalized = '/' + normalized.slice('src/'.length);
  } else if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }

  return `${base}${normalized}`;
}
