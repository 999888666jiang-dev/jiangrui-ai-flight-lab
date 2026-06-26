import { computed, onMounted, ref, watch } from 'vue';
import { useEnvironment } from './useEnvironment';

const supportState = ref<'unknown' | 'supported' | 'blocked'>('unknown');

function canCreateWebGLContext() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return Boolean(context);
  } catch {
    return false;
  }
}

export function useWebGLSupport() {
  const environment = useEnvironment();

  function detect() {
    if (!environment.profile.value.webgl.three) {
      supportState.value = 'blocked';
      return;
    }

    supportState.value = canCreateWebGLContext() ? 'supported' : 'blocked';
  }

  onMounted(detect);
  watch(() => environment.profile.value.webgl.three, detect);

  return {
    supportState,
    shouldUseThree: computed(() => supportState.value === 'supported' && environment.profile.value.webgl.three),
    webglPolicy: computed(() => environment.profile.value.webgl),
  };
}
