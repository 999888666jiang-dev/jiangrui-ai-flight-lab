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
  const isFullLoading = ref(false);
  const fullLoadProgress = ref(0);
  const fullLoadPercent = computed(() => Math.max(0, Math.min(100, Math.round(fullLoadProgress.value * 100))));
  const fullLoadStyle = computed(() => ({ '--media-full-progress': `${fullLoadPercent.value}%` }));
  let fullLoadResetTimer: number | undefined;

  function clearFullLoadResetTimer() {
    if (fullLoadResetTimer === undefined) return;
    window.clearTimeout(fullLoadResetTimer);
    fullLoadResetTimer = undefined;
  }

  function setFullLoadProgress(value: number) {
    fullLoadProgress.value = Math.max(0, Math.min(1, value));
  }

  function readBufferedProgress(video?: HTMLVideoElement) {
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0 || video.buffered.length === 0) {
      return undefined;
    }

    let bufferedEnd = 0;
    for (let index = 0; index < video.buffered.length; index += 1) {
      bufferedEnd = Math.max(bufferedEnd, video.buffered.end(index));
    }

    return Math.max(0, Math.min(0.98, bufferedEnd / video.duration));
  }

  function beginFullLoad() {
    clearFullLoadResetTimer();
    isFullLoading.value = true;
    setFullLoadProgress(Math.max(fullLoadProgress.value, 0.04));
  }

  function syncFullLoadProgress(video?: HTMLVideoElement, minimum = 0) {
    if (!isFullLoading.value) return;

    const bufferedProgress = readBufferedProgress(video);
    const fallbackProgress = Math.min(0.88, fullLoadProgress.value + 0.045);
    setFullLoadProgress(Math.max(fullLoadProgress.value, minimum, bufferedProgress ?? fallbackProgress));
  }

  function completeFullLoad(video?: HTMLVideoElement) {
    if (!isFullLoading.value) return;

    const bufferedProgress = readBufferedProgress(video);
    setFullLoadProgress(Math.max(fullLoadProgress.value, bufferedProgress ?? 0, 1));
    clearFullLoadResetTimer();
    fullLoadResetTimer = window.setTimeout(() => {
      isFullLoading.value = false;
    }, 850);
  }

  function failFullLoad() {
    clearFullLoadResetTimer();
    isFullLoading.value = false;
    setFullLoadProgress(0);
  }

  function resetToPreview() {
    quality.value = 'preview';
    failFullLoad();
  }

  function switchToFull() {
    if (!fullSrc.value) return false;
    beginFullLoad();
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
    clearFullLoadResetTimer();
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
    isFullLoading,
    fullLoadProgress,
    fullLoadPercent,
    fullLoadStyle,
    resetToPreview,
    switchToFull,
    syncFullLoadProgress,
    completeFullLoad,
    failFullLoad,
    releaseVideoElement,
  };
}
