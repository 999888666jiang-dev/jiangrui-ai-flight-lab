<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useAdaptiveMediaSource } from '../composables/useAdaptiveMediaSource';
import { pickText, useLanguage } from '../composables/useLanguage';
import { useVideoPolicy } from '../composables/useVideoPolicy';
import { videoBayAdaptiveMedia } from '../data/adaptiveMedia';

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
  switchToFull,
  releaseVideoElement,
} = useAdaptiveMediaSource(adaptiveMedia);
const isLoading = ref(false);
const loadError = ref(false);
const resumeTime = ref(0);
const futureVideoPath = 'public/videos/fpv-lab-background.mp4';

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

function playFromGate() {
  const video = videoRef.value;
  if (!video) return;
  void requestPlayback(video, isMuted.value);
}

function playFullVersion() {
  const video = videoRef.value;
  if (!video || !canSwitchToFull.value) return;

  resumeTime.value = video.currentTime || 0;
  releaseVideoElement(video);
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
          @loadedmetadata="handleLoadedMetadata"
          @playing="clearPlaybackBlock"
          @error="handleMediaError"
        />
        <div v-if="!activeSrc" class="video-bay__placeholder" aria-hidden="true">
          <img v-if="poster" class="video-bay__poster" :src="poster" alt="" loading="eager" />
          <span>{{ isPreviewMissing ? 'PREVIEW SOURCE PENDING' : 'VIDEO SOURCE PENDING' }}</span>
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
        <h1>{{ language === 'zh' ? '真实视频背景舱' : 'Real Video Background Bay' }}</h1>
        <p>
          {{
            language === 'zh'
              ? `展示.mp4 已接入到 ${futureVideoPath}，当前作为视频舱真实背景自动播放。默认静音，保留声音开关。`
              : `The showcase video is now connected at ${futureVideoPath} and auto-plays as the real Video Bay background. It starts muted with a sound toggle.`
          }}
        </p>
        <p class="video-bay__quality">
          {{
            isFullActive
              ? (language === 'zh' ? '当前播放高清完整版本。移动端仍会在离开页面或后台时释放资源。' : 'Full quality is active. Mobile devices still release media when hidden or leaving the route.')
              : (language === 'zh' ? '生产环境优先使用 CDN 轻量预览版；高清完整版本只在手动点击后加载。' : 'Production prefers the CDN preview stream. The full version loads only after manual unlock.')
          }}
        </p>
        <div class="video-brief">
          <strong>{{ language === 'zh' ? '建议视频风格' : 'Recommended video style' }}</strong>
          <span>
            {{
              language === 'zh'
                ? '8-15 秒无缝循环，FPV 或无人机主观视角，夜航/城市/山谷/起降均可；画面稳定、有速度感、少字幕、无水印，中心区域不要有重要主体，方便叠加 HUD。'
                : '8-15 second seamless loop, FPV or drone POV, night flight / city / valley / takeoff are all suitable; stable, fast, low text, no watermark, and no critical subject in the center so HUD layers remain readable.'
            }}
          </span>
        </div>
        <div class="video-bay__actions">
          <button class="button button--secondary" type="button" @click="toggleSound">
            {{ isMuted ? pickText({ zh: '开启声音', en: 'Sound on' }, language) : pickText({ zh: '静音播放', en: 'Mute' }, language) }}
          </button>
          <button class="button button--secondary" type="button" :disabled="!canSwitchToFull" @click="playFullVersion">
            {{ isFullActive ? pickText({ zh: '高清播放中', en: 'Full active' }, language) : pickText({ zh: '查看高清完整版本', en: 'Load full version' }, language) }}
          </button>
          <RouterLink class="button button--primary" to="/evidence-vault">
            {{ pickText({ zh: '进入证据库', en: 'Open Evidence Vault' }, language) }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
