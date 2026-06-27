<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useEnvironment } from '../../composables/useEnvironment';

const props = withDefaults(
  defineProps<{
    poster?: string;
    teaser?: string;
    variant?: 'flight' | 'outcome' | 'neutral';
    eager?: boolean;
  }>(),
  {
    variant: 'neutral',
    eager: false,
  },
);

const { profile } = useEnvironment();
const rootRef = ref<HTMLElement>();
const teaserRef = ref<HTMLVideoElement>();
const hovering = ref(false);
const teaserReady = ref(false);
const teaserFailed = ref(false);
let hoverHost: HTMLElement | undefined;

const canUseHoverPreview = computed(
  () =>
    Boolean(props.teaser) &&
    profile.value.runtime === 'desktop' &&
    !profile.value.reducedMotion &&
    profile.value.deviceTier !== 'minimal',
);
const shouldRenderTeaser = computed(() => canUseHoverPreview.value && hovering.value && !teaserFailed.value);

function releaseTeaser() {
  const video = teaserRef.value;
  if (!video) return;

  video.pause();
  video.removeAttribute('src');
  video.load();
}

async function playTeaser() {
  if (!shouldRenderTeaser.value) return;

  await nextTick();
  const video = teaserRef.value;
  if (!video) return;

  try {
    video.currentTime = 0;
    video.muted = true;
    await video.play();
  } catch {
    teaserFailed.value = true;
    releaseTeaser();
  }
}

function startHoverPreview() {
  if (!canUseHoverPreview.value) return;
  hovering.value = true;
  void playTeaser();
}

function stopHoverPreview() {
  hovering.value = false;
  teaserReady.value = false;
  releaseTeaser();
}

function handleTeaserReady() {
  teaserReady.value = true;
}

function handleTeaserError() {
  teaserFailed.value = true;
  stopHoverPreview();
}

function bindHoverHost() {
  const root = rootRef.value;
  const host = root?.closest<HTMLElement>('.media-reel-card, .video-card');
  if (!host || host === root) return;

  hoverHost = host;
  hoverHost.addEventListener('mouseenter', startHoverPreview);
  hoverHost.addEventListener('mouseleave', stopHoverPreview);
  hoverHost.addEventListener('focusin', startHoverPreview);
  hoverHost.addEventListener('focusout', stopHoverPreview);
}

function unbindHoverHost() {
  if (!hoverHost) return;

  hoverHost.removeEventListener('mouseenter', startHoverPreview);
  hoverHost.removeEventListener('mouseleave', stopHoverPreview);
  hoverHost.removeEventListener('focusin', startHoverPreview);
  hoverHost.removeEventListener('focusout', stopHoverPreview);
  hoverHost = undefined;
}

watch(
  () => props.teaser,
  () => {
    teaserFailed.value = false;
    stopHoverPreview();
  },
);

onMounted(bindHoverHost);

onUnmounted(() => {
  unbindHoverHost();
  stopHoverPreview();
});
</script>

<template>
  <span
    ref="rootRef"
    class="video-preview-tile"
    :class="[
      `video-preview-tile--${variant}`,
      {
        'video-preview-tile--poster': poster,
        'video-preview-tile--playing': teaserReady && shouldRenderTeaser,
        'video-preview-tile--failed': teaserFailed,
      },
    ]"
    aria-hidden="true"
    @mouseenter="startHoverPreview"
    @mouseleave="stopHoverPreview"
  >
    <img v-if="poster" :src="poster" alt="" :loading="eager ? 'eager' : 'lazy'" decoding="async" />
    <video
      v-if="shouldRenderTeaser"
      ref="teaserRef"
      :src="teaser"
      muted
      loop
      playsinline
      webkit-playsinline
      preload="metadata"
      @loadeddata="handleTeaserReady"
      @canplay="handleTeaserReady"
      @error="handleTeaserError"
    />
    <i class="video-preview-tile__play" />
    <i class="video-preview-tile__scan" />
    <em class="video-preview-tile__badge">
      {{ teaser && !teaserFailed ? '3S PREVIEW' : 'POSTER LOCK' }}
    </em>
  </span>
</template>
