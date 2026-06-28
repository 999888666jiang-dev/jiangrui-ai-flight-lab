export type DeviceTier = 'high' | 'medium' | 'low' | 'minimal';
export type RuntimeShell = 'desktop' | 'mobile-browser' | 'wechat' | 'pwa' | 'capacitor';

export type ViewportSnapshot = {
  width: number;
  height: number;
  dpr: number;
};

export type MotionBudget = {
  particleFactor: number;
  canvasFps: number;
  canvasDpr: number;
  three: boolean;
  scanLines: boolean;
  hoverMotion: boolean;
  compositeOperation: 'lighter' | 'source-over';
};

export type VideoPolicy = {
  autoplay: boolean;
  mutedRequired: boolean;
  gestureRequired: boolean;
  preload: 'none' | 'metadata' | 'auto';
};

export type WebglPolicy = {
  three: boolean;
  pixelRatio: number;
  antialias: boolean;
  heroParticles: number;
};

export type AdaptationProfile = {
  runtime: RuntimeShell;
  deviceTier: DeviceTier;
  reducedMotion: boolean;
  isTouch: boolean;
  isIOS: boolean;
  isWeChat: boolean;
  saveData: boolean;
  networkType: string;
  viewport: ViewportSnapshot;
  motion: MotionBudget;
  video: VideoPolicy;
  webgl: WebglPolicy;
};

export const ADAPTATION_BREAKPOINTS = {
  tiny: 360,
  small: 480,
  phone: 680,
  tablet: 980,
  compact: 1160,
};

export function resolveRuntimeShell(input: {
  width: number;
  isWeChat: boolean;
  isStandalone: boolean;
  isCapacitor: boolean;
}): RuntimeShell {
  if (input.isCapacitor) return 'capacitor';
  if (input.isStandalone) return 'pwa';
  if (input.isWeChat) return 'wechat';
  if (input.width <= ADAPTATION_BREAKPOINTS.tablet) return 'mobile-browser';
  return 'desktop';
}

export function resolveDeviceTier(input: {
  runtime: RuntimeShell;
  width: number;
  cores: number;
  memoryGB?: number;
  reducedMotion: boolean;
  saveData: boolean;
}): DeviceTier {
  if (input.reducedMotion || input.runtime === 'wechat' || input.saveData || input.width <= ADAPTATION_BREAKPOINTS.tiny) {
    return 'minimal';
  }

  if ((input.memoryGB !== undefined && input.memoryGB <= 2) || input.cores <= 2 || input.width <= ADAPTATION_BREAKPOINTS.phone) {
    return 'low';
  }

  if ((input.memoryGB !== undefined && input.memoryGB <= 4) || input.cores <= 4 || input.width <= ADAPTATION_BREAKPOINTS.compact) {
    return 'medium';
  }

  return 'high';
}

export function createMotionBudget(input: {
  runtime: RuntimeShell;
  tier: DeviceTier;
  reducedMotion: boolean;
  width: number;
}): MotionBudget {
  if (input.reducedMotion || input.tier === 'minimal') {
    return {
      particleFactor: 0.22,
      canvasFps: 24,
      canvasDpr: 1,
      three: false,
      scanLines: false,
      hoverMotion: false,
      compositeOperation: 'source-over',
    };
  }

  if (input.tier === 'low') {
    return {
      particleFactor: 0.42,
      canvasFps: 30,
      canvasDpr: 1.15,
      three: false,
      scanLines: input.runtime !== 'wechat',
      hoverMotion: false,
      compositeOperation: 'source-over',
    };
  }

  if (input.tier === 'medium') {
    return {
      particleFactor: 0.68,
      canvasFps: 45,
      canvasDpr: 1.35,
      three: input.width >= 768 && input.runtime !== 'wechat',
      scanLines: true,
      hoverMotion: input.width >= ADAPTATION_BREAKPOINTS.tablet,
      compositeOperation: 'source-over',
    };
  }

  return {
    particleFactor: 1,
    canvasFps: 60,
    canvasDpr: 1.6,
    three: input.runtime !== 'wechat',
    scanLines: true,
    hoverMotion: true,
    compositeOperation: 'lighter',
  };
}

export function createVideoPolicy(input: {
  runtime: RuntimeShell;
  tier: DeviceTier;
  isIOS: boolean;
  isWeChat: boolean;
  saveData: boolean;
  networkType: string;
}): VideoPolicy {
  const weakNetwork = input.saveData || /(^slow-2g$|^2g$|^3g$)/i.test(input.networkType);
  const gestureRequired = input.isIOS || input.isWeChat || weakNetwork;

  return {
    autoplay: !weakNetwork && input.tier !== 'minimal',
    mutedRequired: true,
    gestureRequired,
    preload: weakNetwork || input.tier === 'minimal' ? 'none' : 'metadata',
  };
}

export function createWebglPolicy(input: {
  tier: DeviceTier;
  motion: MotionBudget;
  dpr: number;
  runtime: RuntimeShell;
  width: number;
  reducedMotion: boolean;
  saveData: boolean;
}): WebglPolicy {
  if (input.reducedMotion || input.saveData) {
    return {
      three: false,
      pixelRatio: 1,
      antialias: false,
      heroParticles: 0,
    };
  }

  if (input.width <= ADAPTATION_BREAKPOINTS.tablet || input.runtime === 'wechat' || input.tier === 'minimal' || input.tier === 'low') {
    return {
      three: true,
      pixelRatio: Math.min(input.dpr, 1.4),
      antialias: true,
      heroParticles: 360,
    };
  }

  if (!input.motion.three) {
    return {
      three: false,
      pixelRatio: 1,
      antialias: false,
      heroParticles: 0,
    };
  }

  if (input.tier === 'medium') {
    return {
      three: true,
      pixelRatio: Math.min(input.dpr, 1.25),
      antialias: false,
      heroParticles: 420,
    };
  }

  return {
    three: true,
    pixelRatio: Math.min(input.dpr, 1.6),
    antialias: true,
    heroParticles: 900,
  };
}
