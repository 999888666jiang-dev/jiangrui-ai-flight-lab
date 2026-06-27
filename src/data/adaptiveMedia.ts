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
  teaserSrc?: string;
  previewSrc?: string;
  fullSrc?: string;
  cdnPoster?: string;
  cdnTeaser?: string;
  cdnPreview?: string;
  cdnFull?: string;
  cdnPosterAsset?: string;
  cdnTeaserAsset?: string;
  cdnPreviewAsset?: string;
  cdnFullAsset?: string;
  releasePosterAsset?: string;
  releaseTeaserAsset?: string;
  releasePreviewAsset?: string;
  releaseFullAsset?: string;
  originalName?: string;
  sizeMB?: number;
};

export type ResolvedAdaptiveMediaSources = {
  poster?: string;
  teaser?: string;
  preview?: string;
  full?: string;
  hasTeaser: boolean;
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
    return { hasTeaser: false, hasPreview: false, hasFull: false };
  }

  const variant = mediaVariantManifest[item.key];
  const canUseVariantReleaseAssets = item.group !== 'video-bay';
  const cdnPosterAsset = item.cdnPosterAsset ?? variant?.posterAsset;
  const cdnTeaserAsset = item.cdnTeaserAsset ?? variant?.teaserAsset;
  const cdnPreviewAsset = item.cdnPreviewAsset ?? variant?.previewAsset;
  const cdnFullAsset = item.cdnFullAsset ?? variant?.fullAsset;

  const poster = firstDefined(
    item.cdnPoster,
    mediaCdnAssetUrl(cdnPosterAsset),
    item.releasePosterAsset ? githubReleaseAssetUrl(item.releasePosterAsset) : undefined,
    canUseVariantReleaseAssets && variant?.releasePosterAsset ? githubReleaseAssetUrl(variant.releasePosterAsset) : undefined,
    localVariantSource(variant?.posterAsset),
    localSource(item.posterSrc),
  );
  const teaser = firstDefined(
    item.cdnTeaser,
    mediaCdnAssetUrl(cdnTeaserAsset),
    item.releaseTeaserAsset ? githubReleaseAssetUrl(item.releaseTeaserAsset) : undefined,
    canUseVariantReleaseAssets && variant?.releaseTeaserAsset ? githubReleaseAssetUrl(variant.releaseTeaserAsset) : undefined,
    localVariantSource(variant?.teaserAsset),
    localSource(item.teaserSrc),
  );
  const preview = firstDefined(
    item.cdnPreview,
    mediaCdnAssetUrl(cdnPreviewAsset),
    item.releasePreviewAsset ? githubReleaseAssetUrl(item.releasePreviewAsset) : undefined,
    canUseVariantReleaseAssets && variant?.releasePreviewAsset ? githubReleaseAssetUrl(variant.releasePreviewAsset) : undefined,
    localVariantSource(variant?.previewAsset),
    localSource(item.previewSrc),
  );
  const full = firstDefined(
    item.cdnFull,
    mediaCdnAssetUrl(cdnFullAsset),
    item.releaseFullAsset ? githubReleaseAssetUrl(item.releaseFullAsset) : undefined,
    canUseVariantReleaseAssets && variant?.releaseFullAsset ? githubReleaseAssetUrl(variant.releaseFullAsset) : undefined,
    localVariantSource(variant?.fullAsset),
    localSource(item.fullSrc),
  );

  return {
    poster,
    teaser,
    preview,
    full,
    hasTeaser: Boolean(teaser),
    hasPreview: Boolean(preview),
    hasFull: Boolean(full),
  };
}
