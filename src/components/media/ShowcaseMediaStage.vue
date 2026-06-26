<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { pickText, useLanguage } from '../../composables/useLanguage';
import { useVideoPolicy } from '../../composables/useVideoPolicy';
import {
  getFeaturedShowcaseMedia,
  getShowcaseMedia,
  resolveShowcaseMediaSrc,
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
const currentMediaSrc = computed(() => resolveShowcaseMediaSrc(currentMedia.value));
const reelPath = computed(() => `/evidence-vault/${props.group}/reel`);
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

function pickRandomMedia() {
  if (mediaItems.value.length <= 1) return;
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

watch(currentMedia, syncVideoPlayback);
watch(
  () => props.group,
  () => {
    const featured = featuredMedia.value;
    currentIndex.value = Math.max(0, mediaItems.value.findIndex((item) => item.id === featured?.id));
    syncVideoPlayback();
  },
);

onMounted(() => {
  if (props.variant === 'outcome' && mediaItems.value.length > 1) {
    currentIndex.value = Math.floor(Math.random() * mediaItems.value.length);
  } else {
    const featured = featuredMedia.value;
    currentIndex.value = Math.max(0, mediaItems.value.findIndex((item) => item.id === featured?.id));
  }
  syncVideoPlayback();
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
      v-if="currentMedia && currentMediaSrc"
      ref="videoRef"
      :key="currentMedia.id"
      :src="currentMediaSrc"
      :muted="isMuted"
      autoplay
      playsinline
      webkit-playsinline
      x5-video-player-type="h5"
      x5-video-orientation="portrait"
      :preload="policy.preload"
      class="media-stage__video"
      @loadedmetadata="syncVideoPlayback"
      @playing="clearPlaybackBlock"
      @ended="pickRandomMedia"
    />
    <div v-else class="media-stage__placeholder" aria-hidden="true">
      <span>{{ variant === 'velocity' ? 'FPV MEDIA SOURCE PENDING' : 'OUTCOME MEDIA SOURCE PENDING' }}</span>
    </div>
    <button v-if="playbackBlocked" class="media-stage__playback-gate" type="button" @click="playFromGate">
      <span>{{ language === 'zh' ? '点击播放当前视频' : 'Tap to play current video' }}</span>
      <small>{{ playbackReasonText || (language === 'zh' ? '浏览器需要一次手势解锁' : 'Gesture required by browser') }}</small>
    </button>
    <div class="media-stage__hud">
      <small>{{ pickText(stageTitle, language) }}</small>
      <strong>{{ currentMedia ? pickText(currentMedia.title, language) : 'NO MEDIA' }}</strong>
      <span>{{ currentMedia?.originalName }} / {{ currentMedia?.sizeMB }}MB</span>
    </div>
    <div class="media-stage__controls">
      <button type="button" @click="toggleSound">
        {{ isMuted ? (language === 'zh' ? '开启声音' : 'Sound on') : (language === 'zh' ? '静音播放' : 'Mute') }}
      </button>
      <button type="button" @click="pickRandomMedia">
        {{ pickText(actionLabel, language) }}
      </button>
      <RouterLink :to="reelPath">
        {{ language === 'zh' ? '查看更多' : 'View more' }}
      </RouterLink>
    </div>
  </div>
</template>
