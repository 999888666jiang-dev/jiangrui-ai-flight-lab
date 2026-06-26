<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { pickText, useLanguage } from '../composables/useLanguage';
import { useVideoPolicy } from '../composables/useVideoPolicy';
import { resolveReleaseMediaSource, videoBayReleaseMedia } from '../data/releaseMedia';

const { language } = useLanguage();
const { policy, playbackBlocked, playbackReasonText, applyInlineAttributes, attemptPlayback, requestPlayback, clearPlaybackBlock } = useVideoPolicy();
const videoRef = ref<HTMLVideoElement>();
const isMuted = ref(true);
const videoSrc = resolveReleaseMediaSource(videoBayReleaseMedia) ?? '';
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
  const video = videoRef.value;
  if (!video) return;
  applyInlineAttributes(video);
  void attemptPlayback(video, isMuted.value);
}

function playFromGate() {
  const video = videoRef.value;
  if (!video) return;
  void requestPlayback(video, isMuted.value);
}

onMounted(syncVideoPlayback);
</script>

<template>
  <section class="section section--video-bay video-route-page">
    <div class="video-bay">
      <div class="video-bay__media" data-reveal>
        <video
          v-if="videoSrc"
          ref="videoRef"
          :src="videoSrc"
          :muted="isMuted"
          autoplay
          loop
          playsinline
          webkit-playsinline
          x5-video-player-type="h5"
          x5-video-orientation="portrait"
          :preload="policy.preload"
          aria-label="FPV background video"
          @loadedmetadata="syncVideoPlayback"
          @playing="clearPlaybackBlock"
        />
        <div v-if="!videoSrc" class="video-bay__placeholder" aria-hidden="true">
          <span>VIDEO SOURCE PENDING</span>
        </div>
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
          <RouterLink class="button button--primary" to="/evidence-vault">
            {{ pickText({ zh: '进入证据库', en: 'Open Evidence Vault' }, language) }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
