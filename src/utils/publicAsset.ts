const baseUrl = import.meta.env.BASE_URL || '/';
const absoluteUrlPattern = /^(https?:|data:|blob:)/i;

export const localMediaEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOCAL_MEDIA === 'true';

export function publicAsset(path: string) {
  if (absoluteUrlPattern.test(path)) return path;

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.replace(/^\/+/, '');

  return `${normalizedBase}${normalizedPath}`;
}

export function optionalPublicMedia(path: string) {
  return localMediaEnabled ? publicAsset(path) : undefined;
}
