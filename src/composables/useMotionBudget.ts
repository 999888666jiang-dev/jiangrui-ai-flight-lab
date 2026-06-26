import { computed } from 'vue';
import { useEnvironment } from './useEnvironment';

export type ParticleCountProfile = {
  desktop: number;
  compact?: number;
  mobile?: number;
  reduced?: number;
  minimal?: number;
};

export function useMotionBudget() {
  const environment = useEnvironment();
  const motionBudget = computed(() => environment.profile.value.motion);

  function resolveParticleCount(counts: ParticleCountProfile, density = 1) {
    const profile = environment.profile.value;
    let base = counts.desktop;

    if (profile.reducedMotion) {
      base = counts.reduced ?? counts.minimal ?? counts.mobile ?? counts.desktop;
    } else if (profile.deviceTier === 'minimal') {
      base = counts.minimal ?? counts.reduced ?? counts.mobile ?? counts.desktop;
    } else if (profile.deviceTier === 'low') {
      base = counts.mobile ?? counts.compact ?? counts.desktop;
    } else if (profile.deviceTier === 'medium') {
      base = counts.compact ?? counts.desktop;
    }

    return Math.max(1, Math.round(base * density));
  }

  return {
    profile: environment.profile,
    motionBudget,
    resolveParticleCount,
  };
}
