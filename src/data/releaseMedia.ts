import { localMediaEnabled, publicAsset } from '../utils/publicAsset';
import { releaseMediaVersionByAsset } from './releaseMediaManifest';

const releaseOwner =
  import.meta.env.VITE_GITHUB_OWNER ||
  import.meta.env.VITE_GITHUB_REPOSITORY_OWNER ||
  '';
const releaseRepository = import.meta.env.VITE_GITHUB_REPOSITORY_NAME || 'jiangrui-ai-flight-lab';
const releaseTag = import.meta.env.VITE_GITHUB_MEDIA_TAG || 'media-current';

export type ReleaseMediaSource = {
  localSrc: string;
  assetName: string;
  fallbackSrc?: string;
};

export const videoBayReleaseMedia: ReleaseMediaSource = {
  localSrc: publicAsset('videos/fpv-lab-background.mp4'),
  assetName: 'video-bay__fpv-lab-background.mp4',
};

export function showcaseReleaseAssetName(group: string, id: string) {
  return `${group}__${id}.mp4`;
}

export function githubReleaseAssetUrl(assetName: string) {
  if (!releaseOwner) return undefined;

  const version = releaseMediaVersionByAsset[assetName] ?? 'pending';
  const encodedAsset = encodeURIComponent(assetName);
  const encodedVersion = encodeURIComponent(version);

  return `https://github.com/${releaseOwner}/${releaseRepository}/releases/download/${releaseTag}/${encodedAsset}?v=${encodedVersion}`;
}

export function resolveReleaseMediaSource(source: ReleaseMediaSource) {
  const releaseUrl = githubReleaseAssetUrl(source.assetName);
  if (releaseUrl) return releaseUrl;
  if (localMediaEnabled) return source.localSrc;

  return source.fallbackSrc;
}
