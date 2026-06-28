import { computed, onMounted, onUnmounted, ref, watch, type WatchStopHandle } from 'vue';
import {
  createMotionBudget,
  createVideoPolicy,
  createWebglPolicy,
  resolveDeviceTier,
  resolveRuntimeShell,
  type AdaptationProfile,
  type ViewportSnapshot,
} from '../config/adaptation';

type NavigatorWithCapabilities = Navigator & {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
  standalone?: boolean;
};

const viewport = ref<ViewportSnapshot>({ width: 1280, height: 720, dpr: 1 });
const userAgent = ref('');
const reducedMotion = ref(false);
const isTouch = ref(false);
const isIOS = ref(false);
const isAndroid = ref(false);
const isWeChat = ref(false);
const isStandalone = ref(false);
const isCapacitor = ref(false);
const saveData = ref(false);
const networkType = ref('unknown');
const hardwareConcurrency = ref(4);
const deviceMemory = ref<number | undefined>();

let installed = false;
let consumerCount = 0;
let reduceMotionQuery: MediaQueryList | undefined;
let profileStop: WatchStopHandle | undefined;

function getNavigator() {
  return window.navigator as NavigatorWithCapabilities;
}

function readEnvironment() {
  const nav = getNavigator();
  const ua = nav.userAgent || '';

  viewport.value = {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: Math.max(1, window.devicePixelRatio || 1),
  };
  userAgent.value = ua;
  reducedMotion.value = Boolean(reduceMotionQuery?.matches ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  isTouch.value = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  isIOS.value = /iphone|ipad|ipod/i.test(ua) || (nav.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  isAndroid.value = /android/i.test(ua);
  isWeChat.value = /micromessenger/i.test(ua);
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
  isCapacitor.value = /capacitor/i.test(ua) || window.location.protocol === 'capacitor:';
  saveData.value = Boolean(nav.connection?.saveData);
  networkType.value = nav.connection?.effectiveType || 'unknown';
  hardwareConcurrency.value = nav.hardwareConcurrency || 4;
  deviceMemory.value = nav.deviceMemory;
}

const runtime = computed(() =>
  resolveRuntimeShell({
    width: viewport.value.width,
    isWeChat: isWeChat.value,
    isStandalone: isStandalone.value,
    isCapacitor: isCapacitor.value,
  }),
);

const deviceTier = computed(() =>
  resolveDeviceTier({
    runtime: runtime.value,
    width: viewport.value.width,
    cores: hardwareConcurrency.value,
    memoryGB: deviceMemory.value,
    reducedMotion: reducedMotion.value,
    saveData: saveData.value,
  }),
);

const profile = computed<AdaptationProfile>(() => {
  const motion = createMotionBudget({
    runtime: runtime.value,
    tier: deviceTier.value,
    reducedMotion: reducedMotion.value,
    width: viewport.value.width,
  });

  return {
    runtime: runtime.value,
    deviceTier: deviceTier.value,
    reducedMotion: reducedMotion.value,
    isTouch: isTouch.value,
    isIOS: isIOS.value,
    isWeChat: isWeChat.value,
    saveData: saveData.value,
    networkType: networkType.value,
    viewport: viewport.value,
    motion,
    video: createVideoPolicy({
      runtime: runtime.value,
      tier: deviceTier.value,
      isIOS: isIOS.value,
      isWeChat: isWeChat.value,
      saveData: saveData.value,
      networkType: networkType.value,
    }),
    webgl: createWebglPolicy({
      tier: deviceTier.value,
      motion,
      dpr: viewport.value.dpr,
      runtime: runtime.value,
      width: viewport.value.width,
      reducedMotion: reducedMotion.value,
      saveData: saveData.value,
    }),
  };
});

function applyDocumentProfile(current: AdaptationProfile) {
  const root = document.documentElement;
  root.dataset.runtimeShell = current.runtime;
  root.dataset.deviceTier = current.deviceTier;
  root.dataset.motion = current.reducedMotion ? 'reduced' : 'full';
  root.dataset.touch = String(current.isTouch);
  root.dataset.wechat = String(current.isWeChat);
  root.style.setProperty('--app-vh', `${current.viewport.height * 0.01}px`);
  root.style.setProperty('--motion-particle-factor', String(current.motion.particleFactor));
}

function handleReducedMotionChange() {
  reducedMotion.value = Boolean(reduceMotionQuery?.matches);
}

function installEnvironmentListeners() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  readEnvironment();
  applyDocumentProfile(profile.value);

  window.addEventListener('resize', readEnvironment, { passive: true });
  window.addEventListener('orientationchange', readEnvironment, { passive: true });
  document.addEventListener('visibilitychange', readEnvironment, { passive: true });
  reduceMotionQuery.addEventListener('change', handleReducedMotionChange);

  profileStop = watch(profile, applyDocumentProfile, { deep: true });
}

function removeEnvironmentListeners() {
  if (!installed || typeof window === 'undefined') return;
  installed = false;

  window.removeEventListener('resize', readEnvironment);
  window.removeEventListener('orientationchange', readEnvironment);
  document.removeEventListener('visibilitychange', readEnvironment);
  reduceMotionQuery?.removeEventListener('change', handleReducedMotionChange);
  profileStop?.();
  profileStop = undefined;
}

export function useEnvironment() {
  consumerCount += 1;
  onMounted(installEnvironmentListeners);
  onUnmounted(() => {
    consumerCount = Math.max(0, consumerCount - 1);
    if (consumerCount === 0) {
      removeEnvironmentListeners();
    }
  });

  return {
    profile,
    viewport,
    userAgent,
    runtime,
    deviceTier,
    reducedMotion,
    isTouch,
    isIOS,
    isAndroid,
    isWeChat,
    isStandalone,
    isCapacitor,
    saveData,
    networkType,
    refreshEnvironment: readEnvironment,
  };
}
