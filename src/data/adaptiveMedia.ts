import { localMediaEnabled, publicAsset } from '../utils/publicAsset';
import { githubReleaseAssetUrl, mediaCdnAssetUrl } from './releaseMedia';
import { mediaVariantManifest } from './mediaVariantsManifest';

export type AdaptiveMediaQuality = 'preview' | 'full';
export type AdaptiveMediaGroup = 'video-bay' | 'fpv-flight-video' | 'deal-results-showcase';

export type AdaptiveMediaItem = {
  key: string;
  id: string;
  group: AdaptiveMediaGroup;
  title?: string;
  posterSrc?: string;
  previewSrc?: string;
  fullSrc?: string;
  cdnPoster?: string;
  cdnPreview?: string;
  cdnFull?: string;
  cdnPosterAsset?: string;
  cdnPreviewAsset?: string;
  cdnFullAsset?: string;
  releasePreviewAsset?: string;
  releaseFullAsset?: string;
  originalName?: string;
  sizeMB?: number;
};

export type ResolvedAdaptiveMediaSources = {
  poster?: string;
  preview?: string;
  full?: string;
  hasPreview: boolean;
  hasFull: boolean;
};

export const videoBayAdaptiveMedia: AdaptiveMediaItem = {
  key: 'video-bay/fpv-lab-background',
  id: 'fpv-lab-background',
  group: 'video-bay',
  fullSrc: publicAsset('videos/fpv-lab-background.mp4'),
  releaseFullAsset: 'video-bay__fpv-lab-background.mp4',
};

function localSource(src?: string) {
  return localMediaEnabled ? src : undefined;
}

function localVariantSource(assetPath?: string) {
  return localMediaEnabled && assetPath ? publicAsset(`media-variants/${assetPath}`) : undefined;
}

function firstDefined(...values: Array<string | undefined>) {
  return values.find((value) => Boolean(value));
}

export function resolveAdaptiveMediaSources(item?: AdaptiveMediaItem): ResolvedAdaptiveMediaSources {
  if (!item) {
    return { hasPreview: false, hasFull: false };
  }

  const variant = mediaVariantManifest[item.key];
  const cdnPosterAsset = item.cdnPosterAsset ?? variant?.posterAsset;
  const cdnPreviewAsset = item.cdnPreviewAsset ?? variant?.previewAsset;
  const cdnFullAsset = item.cdnFullAsset ?? variant?.fullAsset;

  const poster = firstDefined(
    item.cdnPoster,
    mediaCdnAssetUrl(cdnPosterAsset),
    localVariantSource(variant?.posterAsset),
    localSource(item.posterSrc),
  );
  const preview = firstDefined(
    item.cdnPreview,
    mediaCdnAssetUrl(cdnPreviewAsset),
    item.releasePreviewAsset ? githubReleaseAssetUrl(item.releasePreviewAsset) : undefined,
    localVariantSource(variant?.previewAsset),
    localSource(item.previewSrc),
  );
  const full = firstDefined(
    item.cdnFull,
    mediaCdnAssetUrl(cdnFullAsset),
    item.releaseFullAsset ? githubReleaseAssetUrl(item.releaseFullAsset) : undefined,
    localVariantSource(variant?.fullAsset),
    localSource(item.fullSrc),
  );

  return {
    poster,
    preview,
    full,
    hasPreview: Boolean(preview),
    hasFull: Boolean(full),
  };
}
