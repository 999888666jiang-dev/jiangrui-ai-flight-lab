<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useAdaptiveMediaSource } from '../../composables/useAdaptiveMediaSource';
import { pickText, useLanguage } from '../../composables/useLanguage';
import { useVideoPolicy } from '../../composables/useVideoPolicy';
import {
  getFeaturedShowcaseMedia,
  getShowcaseMedia,
  toAdaptiveShowcaseMedia,
  type ShowcaseMediaGroup,
} from '../../data/showcaseMedia';

const props = defineProps<{
  group: ShowcaseMediaGroup;
  variant: 'velocity' | 'outcome';
}>();

const { language } = useLanguage();
const { policy, playbackBlocked, playbackReasonText, applyInlineAttributes, attemptPlayback, requestPlayback, clearPlaybackBlock } = useVideoPolicy();
const videoRef = ref<HTMLVideoElement>();
const isMuted = ref(true);
const mediaItems = computed(() => getShowcaseMedia(props.group));
const featuredMedia = computed(() => getFeaturedShowcaseMedia(props.group));
const currentIndex = ref(0);

const currentMedia = computed(() => mediaItems.value[currentIndex.value] ?? featuredMedia.value);
const adaptiveMedia = computed(() => toAdaptiveShowcaseMedia(currentMedia.value));
const {
  quality,
  poster,
  activeSrc,
  canSwitchToFull,
  isFullActive,
  isPreviewMissing,
  resetToPreview,
  switchToFull,
  releaseVideoElement,
} = useAdaptiveMediaSource(adaptiveMedia);
const reelPath = computed(() => `/evidence-vault/${props.group}/reel`);
const isLoading = ref(false);
const loadError = ref(false);
const resumeTime = ref(0);
const stageTitle = computed(() =>
  props.variant === 'velocity'
    ? { zh: 'Velocity Media Stage', en: 'Velocity Media Stage' }
    : { zh: 'Outcome Prism Stage', en: 'Outcome Prism Stage' },
);
const actionLabel = computed(() =>
  props.variant === 'velocity'
    ? { zh: '随机切片', en: 'Random slice' }
    : { zh: '随机抽取成果', en: 'Shuffle outcome' },
);

function syncVideoPlayback() {
  nextTick(() => {
    const video = videoRef.value;
    if (!video) return;
    applyInlineAttributes(video);
    void attemptPlayback(video, isMuted.value);
  });
}

function handleLoadedMetadata() {
  isLoading.value = false;
  loadError.value = false;

  if (resumeTime.value > 0 && videoRef.value) {
    videoRef.value.currentTime = Math.min(resumeTime.value, Math.max(0, videoRef.value.duration - 0.2));
    resumeTime.value = 0;
  }

  syncVideoPlayback();
}

function handleLoadStart() {
  isLoading.value = true;
  loadError.value = false;
}

function handleMediaError() {
  isLoading.value = false;
  loadError.value = true;
}

function pickRandomMedia() {
  if (mediaItems.value.length <= 1) return;
  releaseVideoElement(videoRef.value);
  resetToPreview();
  let nextIndex = currentIndex.value;
  while (nextIndex === currentIndex.value) {
    nextIndex = Math.floor(Math.random() * mediaItems.value.length);
  }
  currentIndex.value = nextIndex;
}

function toggleSound() {
  isMuted.value = !isMuted.value;
  if (videoRef.value) {
    videoRef.value.muted = isMuted.value;
    if (!isMuted.value) {
      void requestPlayback(videoRef.value, false);
    }
  }
}

function playFromGate() {
  if (!videoRef.value) return;
  void requestPlayback(videoRef.value, isMuted.value);
}

function playFullVersion() {
  if (!videoRef.value || !canSwitchToFull.value) return;

  resumeTime.value = videoRef.value.currentTime || 0;
  releaseVideoElement(videoRef.value);
  if (switchToFull()) {
    syncVideoPlayback();
  }
}

function retryMedia() {
  loadError.value = false;
  syncVideoPlayback();
}

watch(currentMedia, syncVideoPlayback);
watch(
  () => props.group,
  () => {
    const featured = featuredMedia.value;
    currentIndex.value = Math.max(0, mediaItems.value.findIndex((item) => item.id === featured?.id));
    syncVideoPlayback();
  },
);

watch(activeSrc, () => {
  loadError.value = false;
  syncVideoPlayback();
});

onMounted(() => {
  if (props.variant === 'outcome' && mediaItems.value.length > 1) {
    currentIndex.value = Math.floor(Math.random() * mediaItems.value.length);
  } else {
    const featured = featuredMedia.value;
    currentIndex.value = Math.max(0, mediaItems.value.findIndex((item) => item.id === featured?.id));
  }
  syncVideoPlayback();
});

onUnmounted(() => {
  releaseVideoElement(videoRef.value);
});
</script>

<template>
  <div class="media-stage" :class="`media-stage--${variant}`">
    <div class="media-stage__chrome" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
    <video
      v-if="currentMedia && activeSrc"
      ref="videoRef"
      :key="`${currentMedia.id}-${quality}`"
      :src="activeSrc"
      :poster="poster"
      :muted="isMuted"
      autoplay
      playsinline
      webkit-playsinline
      x5-video-player-type="h5"
      x5-video-orientation="portrait"
      :preload="policy.preload"
      class="media-stage__video"
      @loadstart="handleLoadStart"
      @loadedmetadata="handleLoadedMetadata"
      @playing="clearPlaybackBlock"
      @error="handleMediaError"
      @ended="pickRandomMedia"
    />
    <div v-else class="media-stage__placeholder" aria-hidden="true">
      <img v-if="poster" class="media-stage__poster" :src="poster" alt="" loading="eager" />
      <span>{{ isPreviewMissing ? 'PREVIEW SOURCE PENDING' : (variant === 'velocity' ? 'FPV MEDIA SOURCE PENDING' : 'OUTCOME MEDIA SOURCE PENDING') }}</span>
    </div>
    <div v-if="isLoading" class="media-stage__status" aria-live="polite">
      {{ language === 'zh' ? '媒体流接入中' : 'Loading media stream' }}
    </div>
    <button v-if="loadError" class="media-stage__playback-gate" type="button" @click="retryMedia">
      <span>{{ language === 'zh' ? '视频加载失败，点击重试' : 'Video failed. Tap to retry' }}</span>
      <small>{{ language === 'zh' ? '当前会优先重试轻量预览版' : 'Retry uses the lightweight preview first' }}</small>
    </button>
    <button v-if="playbackBlocked" class="media-stage__playback-gate" type="button" @click="playFromGate">
      <span>{{ language === 'zh' ? '点击播放当前视频' : 'Tap to play current video' }}</span>
      <small>{{ playbackReasonText || (language === 'zh' ? '浏览器需要一次手势解锁' : 'Gesture required by browser') }}</small>
    </button>
    <div class="media-stage__hud">
      <small>{{ pickText(stageTitle, language) }}</small>
      <strong>{{ currentMedia ? pickText(currentMedia.title, language) : 'NO MEDIA' }}</strong>
      <span>{{ currentMedia?.originalName }} / {{ currentMedia?.sizeMB }}MB</span>
      <em>{{ isFullActive ? (language === 'zh' ? '高清完整版本' : 'Full quality') : (language === 'zh' ? '轻量预览版本' : 'Preview stream') }}</em>
    </div>
    <div class="media-stage__controls">
      <button type="button" @click="toggleSound">
        {{ isMuted ? (language === 'zh' ? '开启声音' : 'Sound on') : (language === 'zh' ? '静音播放' : 'Mute') }}
      </button>
      <button type="button" @click="pickRandomMedia">
        {{ pickText(actionLabel, language) }}
      </button>
      <button type="button" :disabled="!canSwitchToFull" @click="playFullVersion">
        {{ isFullActive ? (language === 'zh' ? '高清播放中' : 'Full active') : (language === 'zh' ? '查看高清完整版本' : 'Load full version') }}
      </button>
      <RouterLink :to="reelPath">
        {{ language === 'zh' ? '查看更多' : 'View more' }}
      </RouterLink>
    </div>
  </div>
</template>
