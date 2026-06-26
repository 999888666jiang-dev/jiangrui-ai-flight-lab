import { computed, onMounted, ref } from 'vue';
import { useEnvironment } from './useEnvironment';
import { useWeChatBridge } from './useWeChatBridge';

export type VideoPlaybackResult = {
  ok: boolean;
  reason?: string;
};

const gestureUnlocked = ref(false);
let gestureListenersInstalled = false;

function markGestureUnlocked() {
  gestureUnlocked.value = true;
}

function installGestureUnlockListeners() {
  if (gestureListenersInstalled || typeof window === 'undefined') return;
  gestureListenersInstalled = true;

  const unlock = () => {
    markGestureUnlocked();
    window.removeEventListener('pointerup', unlock);
    window.removeEventListener('touchend', unlock);
    window.removeEventListener('click', unlock);
  };

  window.addEventListener('pointerup', unlock, { passive: true });
  window.addEventListener('touchend', unlock, { passive: true });
  window.addEventListener('click', unlock, { passive: true });
}

function playbackReason(error: unknown) {
  if (error instanceof DOMException) return error.name;
  if (error instanceof Error) return error.message;
  return 'playback-blocked';
}

export function useVideoPolicy() {
  const environment = useEnvironment();
  const weChatBridge = useWeChatBridge();
  const playbackBlocked = ref(false);
  const playbackReasonText = ref<string | undefined>();
  const policy = computed(() => environment.profile.value.video);

  onMounted(installGestureUnlockListeners);

  function clearPlaybackBlock() {
    playbackBlocked.value = false;
    playbackReasonText.value = undefined;
  }

  function hasNativePlaybackStarted(video: HTMLVideoElement) {
    return !video.paused && video.readyState >= 2;
  }

  function applyInlineAttributes(video: HTMLVideoElement) {
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-video-player-type', 'h5');
    video.setAttribute('x5-video-orientation', 'portrait');
    video.preload = policy.value.preload;
  }

  async function attemptPlayback(video: HTMLVideoElement, muted: boolean): Promise<VideoPlaybackResult> {
    applyInlineAttributes(video);
    video.muted = muted || policy.value.mutedRequired;

    if (!policy.value.autoplay && policy.value.gestureRequired && !gestureUnlocked.value) {
      if (hasNativePlaybackStarted(video)) {
        clearPlaybackBlock();
        return { ok: true };
      }
      playbackBlocked.value = true;
      playbackReasonText.value = 'gesture-required';
      return { ok: false, reason: 'gesture-required' };
    }

    try {
      await weChatBridge.playInlineVideo(video);
      clearPlaybackBlock();
      return { ok: true };
    } catch (error) {
      if (hasNativePlaybackStarted(video)) {
        clearPlaybackBlock();
        return { ok: true };
      }
      playbackBlocked.value = true;
      playbackReasonText.value = playbackReason(error);
      return { ok: false, reason: playbackReasonText.value };
    }
  }

  async function requestPlayback(video: HTMLVideoElement, muted: boolean) {
    markGestureUnlocked();
    return attemptPlayback(video, muted);
  }

  return {
    policy,
    gestureUnlocked,
    playbackBlocked,
    playbackReasonText,
    applyInlineAttributes,
    attemptPlayback,
    requestPlayback,
    clearPlaybackBlock,
  };
}
