<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import VideoPreviewTile from '../components/media/VideoPreviewTile.vue';
import { useAdaptiveMediaSource } from '../composables/useAdaptiveMediaSource';
import { pickText, useLanguage } from '../composables/useLanguage';
import { useVideoPolicy } from '../composables/useVideoPolicy';
import { evidenceItems } from '../data/siteContent';
import {
  getShowcaseMedia,
  resolveShowcaseMediaSources,
  toAdaptiveShowcaseMedia,
  type ShowcaseMediaGroup,
  type ShowcaseMediaItem,
} from '../data/showcaseMedia';

const route = useRoute();
const { language } = useLanguage();
const { policy, playbackBlocked, playbackReasonText, applyInlineAttributes, attemptPlayback, requestPlayback, clearPlaybackBlock } = useVideoPolicy();
const selectedMedia = ref<ShowcaseMediaItem>();
const isMuted = ref(true);
const lightboxVideoRef = ref<HTMLVideoElement>();

const slug = computed(() => {
  const value = route.params.slug;
  return Array.isArray(value) ? value[0] : value;
});
const mediaGroup = computed<ShowcaseMediaGroup | undefined>(() => {
  if (slug.value === 'fpv-flight-video' || slug.value === 'deal-results-showcase') return slug.value;
  return undefined;
});
const item = computed(() => evidenceItems.find((entry) => entry.slug === slug.value));
const mediaItems = computed(() => (mediaGroup.value ? getShowcaseMedia(mediaGroup.value) : []));
const isOutcome = computed(() => mediaGroup.value === 'deal-results-showcase');
const selectedAdaptiveMedia = computed(() => toAdaptiveShowcaseMedia(selectedMedia.value));
const {
  quality,
  poster,
  activeSrc: selectedMediaSrc,
  canSwitchToFull,
  isFullActive,
  isFullLoading,
  fullLoadPercent,
  fullLoadStyle,
  resetToPreview,
  switchToFull,
  syncFullLoadProgress,
  completeFullLoad,
  failFullLoad,
  releaseVideoElement,
} = useAdaptiveMediaSource(selectedAdaptiveMedia);
const isLoading = ref(false);
const loadError = ref(false);
const resumeTime = ref(0);
const pageTitle = computed(() =>
  isOutcome.value
    ? { zh: '成交成果流光展柜', en: 'Deal Results Prism Gallery' }
    : { zh: 'FPV 回忆胶卷', en: 'FPV Memory Reel' },
);
const pageIntro = computed(() =>
  isOutcome.value
    ? {
        zh: '所有成交成果视频以展柜方式排列，点击任意卡片进入聚光播放。',
        en: 'All deal result videos are arranged as a prism gallery. Select any card for spotlight playback.',
      }
    : {
        zh: '所有 FPV 视频像胶卷一样展开，滚动浏览并点击卡片观看飞行片段。',
        en: 'All FPV clips unfold like a film roll. Scroll the reel and select a card to watch.',
      },
);

function openMedia(media: ShowcaseMediaItem) {
  resetToPreview();
  loadError.value = false;
  selectedMedia.value = media;
  isMuted.value = true;
}

function mediaPreviewSources(media: ShowcaseMediaItem) {
  return resolveShowcaseMediaSources(media);
}

function closeMedia() {
  releaseVideoElement(lightboxVideoRef.value);
  selectedMedia.value = undefined;
}

function syncLightboxPlayback() {
  nextTick(() => {
    const video = lightboxVideoRef.value;
    if (!video) return;
    applyInlineAttributes(video);
    void attemptPlayback(video, isMuted.value);
  });
}

function handleLightboxLoadedMetadata() {
  isLoading.value = false;
  loadError.value = false;
  syncFullLoadProgress(lightboxVideoRef.value, 0.34);

  if (resumeTime.value > 0 && lightboxVideoRef.value) {
    lightboxVideoRef.value.currentTime = Math.min(resumeTime.value, Math.max(0, lightboxVideoRef.value.duration - 0.2));
    resumeTime.value = 0;
  }

  syncLightboxPlayback();
}

function handleLightboxLoadStart() {
  isLoading.value = true;
  loadError.value = false;
  syncFullLoadProgress(lightboxVideoRef.value, 0.08);
}

function handleLightboxProgress() {
  syncFullLoadProgress(lightboxVideoRef.value);
}

function handleLightboxLoadedData() {
  syncFullLoadProgress(lightboxVideoRef.value, 0.62);
}

function handleLightboxCanPlay() {
  syncFullLoadProgress(lightboxVideoRef.value, 0.92);
  completeFullLoad(lightboxVideoRef.value);
}

function handleLightboxPlaying() {
  clearPlaybackBlock();
  completeFullLoad(lightboxVideoRef.value);
}

function handleLightboxError() {
  isLoading.value = false;
  loadError.value = true;
  failFullLoad();
}

function playLightboxFromGate() {
  const video = lightboxVideoRef.value;
  if (!video) return;
  void requestPlayback(video, isMuted.value);
}

function toggleLightboxSound() {
  isMuted.value = !isMuted.value;
  if (lightboxVideoRef.value) {
    lightboxVideoRef.value.muted = isMuted.value;
    if (!isMuted.value) {
      void requestPlayback(lightboxVideoRef.value, false);
    }
  }
}

function playFullVersion() {
  const video = lightboxVideoRef.value;
  if (!canSwitchToFull.value) return;

  if (video) {
    resumeTime.value = video.currentTime || 0;
    releaseVideoElement(video);
  }
  if (switchToFull()) {
    syncLightboxPlayback();
  }
}

function retryLightbox() {
  loadError.value = false;
  syncLightboxPlayback();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMedia();
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

watch(selectedMedia, syncLightboxPlayback);
watch(selectedMediaSrc, () => {
  loadError.value = false;
  syncLightboxPlayback();
});
</script>

<template>
  <section v-if="item && mediaGroup" class="media-reel-page" :class="isOutcome ? 'media-reel-page--outcome' : 'media-reel-page--flight'">
    <header class="media-reel-hero">
      <RouterLink class="showcase-back" :to="`/evidence-vault/${item.slug}`">
        {{ language === 'zh' ? '返回展示页' : 'Back to showcase' }}
      </RouterLink>
      <p class="section-code">{{ item.index }} / {{ pickText(item.world, language) }}</p>
      <h1>{{ pickText(pageTitle, language) }}</h1>
      <p>{{ pickText(pageIntro, language) }}</p>
      <div class="media-reel-stats" aria-label="Media archive stats">
        <span>{{ mediaItems.length }} {{ language === 'zh' ? '条视频' : 'videos' }}</span>
        <span>{{ language === 'zh' ? '默认静音' : 'Muted by default' }}</span>
        <span>{{ language === 'zh' ? '点击卡片播放' : 'Click to play' }}</span>
      </div>
    </header>

    <div class="media-reel-grid" :class="isOutcome ? 'media-reel-grid--prism' : 'media-reel-grid--film'">
      <button
        v-for="(media, index) in mediaItems"
        :key="media.id"
        type="button"
        class="media-reel-card"
        :style="{ '--media-index': index }"
        @click="openMedia(media)"
      >
        <VideoPreviewTile
          class="media-reel-card__frame"
          :poster="mediaPreviewSources(media).poster"
          :teaser="mediaPreviewSources(media).teaser"
          :variant="isOutcome ? 'outcome' : 'flight'"
        />
        <small>{{ media.id.toUpperCase() }} / {{ media.sizeMB }}MB</small>
        <strong>{{ pickText(media.title, language) }}</strong>
        <span>{{ media.originalName }}</span>
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="selectedMedia"
        class="media-lightbox"
        :class="isOutcome ? 'media-lightbox--outcome' : 'media-lightbox--flight'"
        role="dialog"
        aria-modal="true"
        :aria-label="pickText(selectedMedia.title, language)"
      >
        <button class="media-lightbox__close" type="button" @click="closeMedia">
          {{ language === 'zh' ? '关闭' : 'Close' }}
        </button>
        <div class="media-lightbox__player">
          <video
            v-if="selectedMediaSrc"
            ref="lightboxVideoRef"
            :key="`${selectedMedia.id}-${quality}`"
            :src="selectedMediaSrc"
            :poster="poster"
            :muted="isMuted"
            autoplay
            controls
            playsinline
            webkit-playsinline
            x5-video-player-type="h5"
            x5-video-orientation="portrait"
            :preload="policy.preload"
            @loadstart="handleLightboxLoadStart"
            @progress="handleLightboxProgress"
            @loadedmetadata="handleLightboxLoadedMetadata"
            @loadeddata="handleLightboxLoadedData"
            @canplay="handleLightboxCanPlay"
            @playing="handleLightboxPlaying"
            @error="handleLightboxError"
          />
          <div v-else class="media-lightbox__placeholder" aria-hidden="true">
            <img v-if="poster" :src="poster" alt="" loading="eager" />
            <span>{{ isOutcome ? 'OUTCOME MEDIA SOURCE PENDING' : 'FPV MEDIA SOURCE PENDING' }}</span>
          </div>
          <div v-if="isLoading" class="media-lightbox__status" aria-live="polite">
            {{ language === 'zh' ? '媒体流接入中' : 'Loading media stream' }}
          </div>
          <button v-if="loadError" class="media-lightbox__playback-gate" type="button" @click="retryLightbox">
            <span>{{ language === 'zh' ? '视频加载失败，点击重试' : 'Video failed. Tap to retry' }}</span>
            <small>{{ language === 'zh' ? '当前会优先重试轻量预览版' : 'Retry uses the lightweight preview first' }}</small>
          </button>
          <button v-if="playbackBlocked" class="media-lightbox__playback-gate" type="button" @click="playLightboxFromGate">
            <span>{{ language === 'zh' ? '点击播放素材' : 'Tap to play media' }}</span>
            <small>{{ playbackReasonText || (language === 'zh' ? '浏览器需要一次手势解锁' : 'Gesture required by browser') }}</small>
          </button>
          <div class="media-lightbox__meta">
            <small>{{ selectedMedia.id.toUpperCase() }}</small>
            <h2>{{ pickText(selectedMedia.title, language) }}</h2>
            <p>{{ selectedMedia.originalName }} / {{ selectedMedia.sizeMB }}MB</p>
            <button type="button" @click="toggleLightboxSound">
              {{ isMuted ? (language === 'zh' ? '开启声音' : 'Sound on') : (language === 'zh' ? '静音播放' : 'Mute') }}
            </button>
            <button
              type="button"
              class="media-full-button"
              :class="{ 'media-full-button--loading': isFullLoading, 'media-full-button--active': isFullActive && !isFullLoading }"
              :style="fullLoadStyle"
              :disabled="!canSwitchToFull && !isFullLoading"
              @click="playFullVersion"
            >
              <span>
                {{
                  isFullLoading
                    ? (language === 'zh' ? `高清接入 ${fullLoadPercent}%` : `Loading full ${fullLoadPercent}%`)
                    : isFullActive
                      ? (language === 'zh' ? '高清播放中' : 'Full active')
                      : (language === 'zh' ? '查看高清完整版本' : 'Load full version')
                }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>

  <section v-else class="section evidence-route-page showcase-missing">
    <div class="section-heading">
      <p class="section-code">404 / MEDIA REEL</p>
      <h1>{{ language === 'zh' ? '媒体集合不存在' : 'Media reel missing' }}</h1>
      <p>{{ language === 'zh' ? '该展示页没有独立媒体集合，请返回证据库。' : 'This showcase has no media reel. Return to the evidence vault.' }}</p>
      <RouterLink class="button button--primary" to="/evidence-vault">
        {{ language === 'zh' ? '返回证据库' : 'Back to Evidence Vault' }}
      </RouterLink>
    </div>
  </section>
</template>
