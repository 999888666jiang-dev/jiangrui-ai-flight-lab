import { onMounted, onUnmounted, ref } from 'vue';
import { useEnvironment } from './useEnvironment';

export function useScrollProgress() {
  const progress = ref(0);

  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.value = Math.min(1, Math.max(0, window.scrollY / max));
  };

  onMounted(() => {
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  });

  return progress;
}

export function usePointerCssVars() {
  const { profile } = useEnvironment();
  let frame = 0;

  const update = (event: PointerEvent) => {
    if (!profile.value.motion.hoverMotion) return;

    if (frame) {
      window.cancelAnimationFrame(frame);
    }

    frame = window.requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--pointer-x', `${(event.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--pointer-y', `${(event.clientY / window.innerHeight) * 100}%`);
    });
  };

  onMounted(() => {
    if (profile.value.motion.hoverMotion) {
      window.addEventListener('pointermove', update, { passive: true });
    }
  });

  onUnmounted(() => {
    if (frame) {
      window.cancelAnimationFrame(frame);
    }
    window.removeEventListener('pointermove', update);
  });
}

export function useWeChatDetect() {
  const isWeChat = ref(false);

  onMounted(() => {
    isWeChat.value = /micromessenger/i.test(window.navigator.userAgent);
  });

  return isWeChat;
}

export function useMediaQuery(query: string) {
  const matches = ref(false);
  let media: MediaQueryList | undefined;

  const update = () => {
    matches.value = Boolean(media?.matches);
  };

  onMounted(() => {
    media = window.matchMedia(query);
    update();
    media.addEventListener('change', update);
  });

  onUnmounted(() => {
    media?.removeEventListener('change', update);
  });

  return matches;
}
