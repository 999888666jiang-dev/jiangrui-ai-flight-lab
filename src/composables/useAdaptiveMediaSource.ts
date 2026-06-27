import { computed, onUnmounted, ref, watch, type Ref } from 'vue';
import { useEnvironment } from './useEnvironment';
import {
  resolveAdaptiveMediaSources,
  type AdaptiveMediaItem,
  type AdaptiveMediaQuality,
} from '../data/adaptiveMedia';

export function useAdaptiveMediaSource(media: Ref<AdaptiveMediaItem | undefined>) {
  const environment = useEnvironment();
  const quality = ref<AdaptiveMediaQuality>('preview');
  const sources = computed(() => resolveAdaptiveMediaSources(media.value));
  const profile = computed(() => environment.profile.value);
  const canUseFullAsInitialSource = computed(
    () =>
      profile.value.runtime === 'desktop' &&
      profile.value.deviceTier === 'high' &&
      !profile.value.saveData &&
      !profile.value.isWeChat,
  );
  const poster = computed(() => sources.value.poster);
  const previewSrc = computed(() => sources.value.preview);
  const fullSrc = computed(() => sources.value.full);
  const defaultSrc = computed(() => previewSrc.value ?? (canUseFullAsInitialSource.value ? fullSrc.value : undefined));
  const activeSrc = computed(() => (quality.value === 'full' ? fullSrc.value ?? previewSrc.value : defaultSrc.value));
  const canSwitchToFull = computed(() => Boolean(fullSrc.value) && quality.value !== 'full');
  const isFullActive = computed(() => quality.value === 'full' && Boolean(fullSrc.value));
  const isPreviewMissing = computed(() => !previewSrc.value);

  function resetToPreview() {
    quality.value = 'preview';
  }

  function switchToFull() {
    if (!fullSrc.value) return false;
    quality.value = 'full';
    return true;
  }

  function releaseVideoElement(video?: HTMLVideoElement) {
    if (!video) return;

    video.pause();

    if (profile.value.runtime !== 'desktop' || profile.value.deviceTier === 'low' || profile.value.deviceTier === 'minimal') {
      video.removeAttribute('src');
      video.load();
    }
  }

  watch(
    () => media.value?.key,
    () => resetToPreview(),
  );

  onUnmounted(() => {
    resetToPreview();
  });

  return {
    profile,
    quality,
    sources,
    poster,
    previewSrc,
    fullSrc,
    activeSrc,
    canSwitchToFull,
    isFullActive,
    isPreviewMissing,
    resetToPreview,
    switchToFull,
    releaseVideoElement,
  };
}
