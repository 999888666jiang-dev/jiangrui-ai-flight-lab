import { resolveAdaptiveMediaSources, type AdaptiveMediaItem } from './adaptiveMedia';
import { showcaseReleaseAssetName } from './releaseMedia';
import { publicAsset } from '../utils/publicAsset';

export type ShowcaseMediaGroup = 'fpv-flight-video' | 'deal-results-showcase';

export type ShowcaseMediaItem = {
  id: string;
  group: ShowcaseMediaGroup;
  kind: 'video';
  src: string;
  posterSrc?: string;
  previewSrc?: string;
  fullSrc?: string;
  cdnPoster?: string;
  cdnPreview?: string;
  cdnFull?: string;
  releasePreview?: string;
  releaseFull?: string;
  variantHash?: string;
  originalName: string;
  title: {
    zh: string;
    en: string;
  };
  sizeMB: number;
  featured?: boolean;
  poster?: string;
  duration?: number;
  width?: number;
  height?: number;
  streamUrl?: string;
  fallbackSrc?: string;
};

export const showcaseMediaItems: ShowcaseMediaItem[] = [
  {
    id: 'fpv-001',
    group: 'fpv-flight-video',
    kind: 'video',
    src: publicAsset('media/fpv-flight-video/fpv-001.mp4'),
    originalName: '1771081446088458.MP4',
    title: { zh: 'FPV 片段 01', en: 'FPV clip 01' },
    sizeMB: 115.5,
    featured: true,
  },
  {
    id: 'fpv-002',
    group: 'fpv-flight-video',
    kind: 'video',
    src: publicAsset('media/fpv-flight-video/fpv-002.mp4'),
    originalName: '1月13日 (1).MP4',
    title: { zh: 'FPV 片段 02', en: 'FPV clip 02' },
    sizeMB: 154.6,
  },
  {
    id: 'fpv-003',
    group: 'fpv-flight-video',
    kind: 'video',
    src: publicAsset('media/fpv-flight-video/fpv-003.mp4'),
    originalName: '2月16日 (1)(1).mp4',
    title: { zh: 'FPV 片段 03', en: 'FPV clip 03' },
    sizeMB: 239.8,
  },
  {
    id: 'fpv-004',
    group: 'fpv-flight-video',
    kind: 'video',
    src: publicAsset('media/fpv-flight-video/fpv-004.mp4'),
    originalName: '2月16日.mp4',
    title: { zh: 'FPV 片段 04', en: 'FPV clip 04' },
    sizeMB: 67.9,
  },
  {
    id: 'fpv-005',
    group: 'fpv-flight-video',
    kind: 'video',
    src: publicAsset('media/fpv-flight-video/fpv-005.mp4'),
    originalName: '3月13日(1).mp4',
    title: { zh: 'FPV 片段 05', en: 'FPV clip 05' },
    sizeMB: 238.4,
  },
  {
    id: 'fpv-006',
    group: 'fpv-flight-video',
    kind: 'video',
    src: publicAsset('media/fpv-flight-video/fpv-006.mp4'),
    originalName: '3月13日.mp4',
    title: { zh: 'FPV 片段 06', en: 'FPV clip 06' },
    sizeMB: 254.7,
  },
  {
    id: 'fpv-007',
    group: 'fpv-flight-video',
    kind: 'video',
    src: publicAsset('media/fpv-flight-video/fpv-007.mp4'),
    originalName: '3月14日.mp4',
    title: { zh: 'FPV 片段 07', en: 'FPV clip 07' },
    sizeMB: 262,
  },
  {
    id: 'fpv-008',
    group: 'fpv-flight-video',
    kind: 'video',
    src: publicAsset('media/fpv-flight-video/fpv-008.mp4'),
    originalName: '3月16日(1).mp4',
    title: { zh: 'FPV 片段 08', en: 'FPV clip 08' },
    sizeMB: 110.7,
  },
  {
    id: 'fpv-009',
    group: 'fpv-flight-video',
    kind: 'video',
    src: publicAsset('media/fpv-flight-video/fpv-009.mp4'),
    originalName: '48dbc2b29d445ee5505e56921e5bca98_WC-EditVideo_1.MP4',
    title: { zh: 'FPV 片段 09', en: 'FPV clip 09' },
    sizeMB: 14.1,
  },
  {
    id: 'fpv-010',
    group: 'fpv-flight-video',
    kind: 'video',
    src: publicAsset('media/fpv-flight-video/fpv-010.mp4'),
    originalName: '4月17日.mp4',
    title: { zh: 'FPV 片段 10', en: 'FPV clip 10' },
    sizeMB: 203.3,
  },
  {
    id: 'fpv-011',
    group: 'fpv-flight-video',
    kind: 'video',
    src: publicAsset('media/fpv-flight-video/fpv-011.mp4'),
    originalName: '4月8日.mp4',
    title: { zh: 'FPV 片段 11', en: 'FPV clip 11' },
    sizeMB: 137.1,
  },
  {
    id: 'deal-001',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-001.mp4'),
    originalName: '2月18日 (1)(1).mp4',
    title: { zh: '成交成果片段 01', en: 'Deal result clip 01' },
    sizeMB: 630.6,
    featured: true,
  },
  {
    id: 'deal-002',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-002.mp4'),
    originalName: '2月18日.mp4',
    title: { zh: '成交成果片段 02', en: 'Deal result clip 02' },
    sizeMB: 188.4,
  },
  {
    id: 'deal-003',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-003.mp4'),
    originalName: '2月22日 (1)(4).mp4',
    title: { zh: '成交成果片段 03', en: 'Deal result clip 03' },
    sizeMB: 25.7,
  },
  {
    id: 'deal-004',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-004.mp4'),
    originalName: '2月22日(1).mp4',
    title: { zh: '成交成果片段 04', en: 'Deal result clip 04' },
    sizeMB: 59.8,
  },
  {
    id: 'deal-005',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-005.mp4'),
    originalName: '2月23日.mp4',
    title: { zh: '成交成果片段 05', en: 'Deal result clip 05' },
    sizeMB: 82.6,
  },
  {
    id: 'deal-006',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-006.mp4'),
    originalName: '3月10日(1).mp4',
    title: { zh: '成交成果片段 06', en: 'Deal result clip 06' },
    sizeMB: 28.1,
  },
  {
    id: 'deal-007',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-007.mp4'),
    originalName: '3月16日 (2)(4).mp4',
    title: { zh: '成交成果片段 07', en: 'Deal result clip 07' },
    sizeMB: 860,
  },
  {
    id: 'deal-008',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-008.mp4'),
    originalName: '3月2日 (1).mp4',
    title: { zh: '成交成果片段 08', en: 'Deal result clip 08' },
    sizeMB: 36.1,
  },
  {
    id: 'deal-009',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-009.mp4'),
    originalName: '3月2日.mp4',
    title: { zh: '成交成果片段 09', en: 'Deal result clip 09' },
    sizeMB: 27.6,
  },
  {
    id: 'deal-010',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-010.mp4'),
    originalName: '3月3日.mp4',
    title: { zh: '成交成果片段 10', en: 'Deal result clip 10' },
    sizeMB: 63.9,
  },
  {
    id: 'deal-011',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-011.mp4'),
    originalName: '3月4日 (2)(1).mp4',
    title: { zh: '成交成果片段 11', en: 'Deal result clip 11' },
    sizeMB: 69.4,
  },
  {
    id: 'deal-012',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-012.mp4'),
    originalName: '3月4日.mp4',
    title: { zh: '成交成果片段 12', en: 'Deal result clip 12' },
    sizeMB: 52.8,
  },
  {
    id: 'deal-013',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-013.mp4'),
    originalName: '3月5日(1).mp4',
    title: { zh: '成交成果片段 13', en: 'Deal result clip 13' },
    sizeMB: 33.4,
  },
  {
    id: 'deal-014',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-014.mp4'),
    originalName: '4月12日 (1)(6).mp4',
    title: { zh: '成交成果片段 14', en: 'Deal result clip 14' },
    sizeMB: 206.1,
  },
  {
    id: 'deal-015',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-015.mp4'),
    originalName: '4月22日 (3).mp4',
    title: { zh: '成交成果片段 15', en: 'Deal result clip 15' },
    sizeMB: 15.7,
  },
  {
    id: 'deal-016',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-016.mp4'),
    originalName: '4月25日 (4).mp4',
    title: { zh: '成交成果片段 16', en: 'Deal result clip 16' },
    sizeMB: 34.3,
  },
  {
    id: 'deal-017',
    group: 'deal-results-showcase',
    kind: 'video',
    src: publicAsset('media/deal-results-showcase/deal-017.mp4'),
    originalName: '4月25日 (6).mp4',
    title: { zh: '成交成果片段 17', en: 'Deal result clip 17' },
    sizeMB: 28.8,
  },
];

export function getShowcaseMedia(group: ShowcaseMediaGroup) {
  return showcaseMediaItems.filter((item) => item.group === group);
}

export function getFeaturedShowcaseMedia(group: ShowcaseMediaGroup) {
  return getShowcaseMedia(group).find((item) => item.featured) ?? getShowcaseMedia(group)[0];
}

export function toAdaptiveShowcaseMedia(item?: ShowcaseMediaItem): AdaptiveMediaItem | undefined {
  if (!item) return undefined;

  return {
    key: `${item.group}/${item.id}`,
    id: item.id,
    group: item.group,
    posterSrc: item.posterSrc ?? item.poster,
    previewSrc: item.previewSrc,
    fullSrc: item.fullSrc ?? item.src,
    cdnPoster: item.cdnPoster,
    cdnPreview: item.cdnPreview,
    cdnFull: item.cdnFull,
    releasePreviewAsset: item.releasePreview,
    releaseFullAsset: item.releaseFull ?? showcaseReleaseAssetName(item.group, item.id),
    originalName: item.originalName,
    sizeMB: item.sizeMB,
  };
}

export function resolveShowcaseMediaSources(item?: ShowcaseMediaItem) {
  return resolveAdaptiveMediaSources(toAdaptiveShowcaseMedia(item));
}

export function resolveShowcaseMediaSrc(item?: ShowcaseMediaItem, quality: 'preview' | 'full' = 'preview') {
  const sources = resolveShowcaseMediaSources(item);
  if (quality === 'full') return sources.full;

  return sources.preview;
}

