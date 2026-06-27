import { localMediaEnabled, publicAsset } from '../utils/publicAsset';
import { releaseMediaVersionByAsset } from './releaseMediaManifest';
import { mediaVariantVersionByAsset } from './mediaVariantsManifest';

const releaseOwner =
  import.meta.env.VITE_GITHUB_OWNER ||
  import.meta.env.VITE_GITHUB_REPOSITORY_OWNER ||
  '';
const releaseRepository = import.meta.env.VITE_GITHUB_REPOSITORY_NAME || 'jiangrui-ai-flight-lab';
const releaseTag = import.meta.env.VITE_GITHUB_MEDIA_TAG || 'media-current';
const mediaCdnBaseUrl = (import.meta.env.VITE_MEDIA_CDN_BASE_URL || '').replace(/\/+$/, '');

export type ReleaseMediaSource = {
  localSrc: string;
  assetName: string;
  fallbackSrc?: string;
};

export const videoBayReleaseMedia: ReleaseMediaSource = {
  localSrc: publicAsset('videos/fpv-lab-background.mp4'),
  assetName: 'video-bay__fpv-lab-background.mp4',
};

export type MediaReleaseUrlOptions = {
  requireKnownVersion?: boolean;
};

export function showcaseReleaseAssetName(group: string, id: string) {
  return `${group}__${id}.mp4`;
}

export function githubReleaseAssetUrl(assetName: string, options: MediaReleaseUrlOptions = {}) {
  if (!releaseOwner) return undefined;

  const version = releaseMediaVersionByAsset[assetName] ?? mediaVariantVersionByAsset[assetName];
  if (options.requireKnownVersion !== false && !version) return undefined;

  const encodedAsset = encodeURIComponent(assetName);
  const encodedVersion = encodeURIComponent(version ?? 'pending');

  return `https://github.com/${releaseOwner}/${releaseRepository}/releases/download/${releaseTag}/${encodedAsset}?v=${encodedVersion}`;
}

export function mediaCdnAssetUrl(assetPath?: string) {
  if (!mediaCdnBaseUrl || !assetPath) return undefined;

  const normalizedPath = assetPath.replace(/^\/+/, '');
  const version = mediaVariantVersionByAsset[normalizedPath];
  const query = version ? `?v=${encodeURIComponent(version)}` : '';

  return `${mediaCdnBaseUrl}/${normalizedPath}${query}`;
}

export function resolveReleaseMediaSource(source: ReleaseMediaSource) {
  const releaseUrl = githubReleaseAssetUrl(source.assetName);
  if (releaseUrl) return releaseUrl;
  if (localMediaEnabled) return source.localSrc;

  return source.fallbackSrc;
}
