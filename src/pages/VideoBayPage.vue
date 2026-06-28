<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useAdaptiveMediaSource } from '../composables/useAdaptiveMediaSource';
import { pickText, useLanguage } from '../composables/useLanguage';
import { useVideoPolicy } from '../composables/useVideoPolicy';
import { videoBayAdaptiveMedia } from '../data/adaptiveMedia';
import { pageCopy } from '../data/siteContent';

const { language } = useLanguage();
const { policy, playbackBlocked, playbackReasonText, applyInlineAttributes, attemptPlayback, requestPlayback, clearPlaybackBlock } = useVideoPolicy();
const videoRef = ref<HTMLVideoElement>();
const isMuted = ref(true);
const adaptiveMedia = computed(() => videoBayAdaptiveMedia);
const {
  quality,
  poster,
  activeSrc,
  canSwitchToFull,
  isFullActive,
  isPreviewMissing,
  isFullLoading,
  fullLoadPercent,
  fullLoadStyle,
  switchToFull,
  syncFullLoadProgress,
  completeFullLoad,
  failFullLoad,
  releaseVideoElement,
} = useAdaptiveMediaSource(adaptiveMedia);
const isLoading = ref(false);
const loadError = ref(false);
const resumeTime = ref(0);
const videoBayCopy = pageCopy.videoBay;

function toggleSound() {
  isMuted.value = !isMuted.value;
  if (videoRef.value) {
    videoRef.value.muted = isMuted.value;
    if (!isMuted.value) {
      void requestPlayback(videoRef.value, false);
    }
  }
}

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
  syncFullLoadProgress(videoRef.value, 0.34);

  if (resumeTime.value > 0 && videoRef.value) {
    videoRef.value.currentTime = Math.min(resumeTime.value, Math.max(0, videoRef.value.duration - 0.2));
    resumeTime.value = 0;
  }

  syncVideoPlayback();
}

function handleLoadStart() {
  isLoading.value = true;
  loadError.value = false;
  syncFullLoadProgress(videoRef.value, 0.08);
}

function handleMediaProgress() {
  syncFullLoadProgress(videoRef.value);
}

function handleLoadedData() {
  syncFullLoadProgress(videoRef.value, 0.62);
}

function handleCanPlay() {
  syncFullLoadProgress(videoRef.value, 0.92);
  completeFullLoad(videoRef.value);
}

function handleMediaPlaying() {
  clearPlaybackBlock();
  completeFullLoad(videoRef.value);
}

function handleMediaError() {
  isLoading.value = false;
  loadError.value = true;
  failFullLoad();
}

function playFromGate() {
  const video = videoRef.value;
  if (!video) return;
  void requestPlayback(video, isMuted.value);
}

function playFullVersion() {
  const video = videoRef.value;
  if (!canSwitchToFull.value) return;

  if (video) {
    resumeTime.value = video.currentTime || 0;
    releaseVideoElement(video);
  }
  if (switchToFull()) {
    syncVideoPlayback();
  }
}

function retryVideo() {
  loadError.value = false;
  syncVideoPlayback();
}

watch(activeSrc, () => {
  loadError.value = false;
  syncVideoPlayback();
});

onMounted(syncVideoPlayback);
onUnmounted(() => {
  releaseVideoElement(videoRef.value);
});
</script>

<template>
  <section class="section section--video-bay video-route-page">
    <div class="video-bay">
      <div class="video-bay__media" data-reveal>
        <video
          v-if="activeSrc"
          ref="videoRef"
          :key="`video-bay-${quality}`"
          :src="activeSrc"
          :poster="poster"
          :muted="isMuted"
          autoplay
          loop
          playsinline
          webkit-playsinline
          x5-video-player-type="h5"
          x5-video-orientation="portrait"
          :preload="policy.preload"
          aria-label="FPV background video"
          @loadstart="handleLoadStart"
          @progress="handleMediaProgress"
          @loadedmetadata="handleLoadedMetadata"
          @loadeddata="handleLoadedData"
          @canplay="handleCanPlay"
          @playing="handleMediaPlaying"
          @error="handleMediaError"
        />
        <div v-if="!activeSrc" class="video-bay__placeholder" aria-hidden="true">
          <img v-if="poster" class="video-bay__poster" :src="poster" alt="" loading="eager" />
          <span>{{ isPreviewMissing ? 'PREVIEW SOURCE STANDBY' : 'VIDEO SOURCE STANDBY' }}</span>
        </div>
        <div v-if="isLoading" class="video-bay__status" aria-live="polite">
          {{ language === 'zh' ? '媒体流接入中' : 'Loading media stream' }}
        </div>
        <button v-if="loadError" class="video-bay__playback-gate" type="button" @click="retryVideo">
          <span>{{ language === 'zh' ? '视频加载失败，点击重试' : 'Video failed. Tap to retry' }}</span>
          <small>{{ language === 'zh' ? '当前会优先重试轻量预览版' : 'Retry uses the lightweight preview first' }}</small>
        </button>
        <button v-if="playbackBlocked" class="video-bay__playback-gate" type="button" @click="playFromGate">
          <span>{{ language === 'zh' ? '点击启动视频背景' : 'Tap to arm video background' }}</span>
          <small>{{ playbackReasonText || (language === 'zh' ? '当前浏览器需要手势播放' : 'This browser requires a gesture') }}</small>
        </button>
        <div class="video-bay__hud" aria-hidden="true">
          <span>REC</span>
          <span>FPV / UAV / AI</span>
          <span>00:00:15 LOOP</span>
        </div>
      </div>

      <div class="video-bay__copy" data-reveal>
        <p class="section-code">04 / VIDEO BAY</p>
        <h1>{{ pickText(videoBayCopy.title, language) }}</h1>
        <p>{{ pickText(videoBayCopy.intro, language) }}</p>
        <p class="video-bay__quality">
          {{
            isFullActive
              ? pickText(videoBayCopy.qualityFull, language)
              : pickText(videoBayCopy.qualityPreview, language)
          }}
        </p>
        <div class="video-brief">
          <strong>{{ pickText(videoBayCopy.briefTitle, language) }}</strong>
          <span>{{ pickText(videoBayCopy.briefBody, language) }}</span>
        </div>
        <div class="video-bay__actions">
          <button class="button button--secondary" type="button" @click="toggleSound">
            {{ isMuted ? pickText({ zh: '开启声音', en: 'Sound on' }, language) : pickText({ zh: '静音播放', en: 'Mute' }, language) }}
          </button>
          <button
            class="button button--secondary media-full-button"
            :class="{ 'media-full-button--loading': isFullLoading, 'media-full-button--active': isFullActive && !isFullLoading }"
            :style="fullLoadStyle"
            type="button"
            :disabled="!canSwitchToFull && !isFullLoading"
            @click="playFullVersion"
          >
            <span>
              {{
                isFullLoading
                  ? pickText({ zh: `高清接入 ${fullLoadPercent}%`, en: `Loading full ${fullLoadPercent}%` }, language)
                  : isFullActive
                    ? pickText({ zh: '高清播放中', en: 'Full active' }, language)
                    : pickText({ zh: '查看高清完整版本', en: 'Load full version' }, language)
              }}
            </span>
          </button>
          <RouterLink class="button button--primary" to="/evidence-vault">
            {{ pickText({ zh: '进入资料库', en: 'Open Resource Library' }, language) }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
