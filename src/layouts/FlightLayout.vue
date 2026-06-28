<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CoreMotionParticles from '../components/effects/CoreMotionParticles.vue';
import ParticleField from '../components/effects/ParticleField.vue';
import SideScrollParticles from '../components/effects/SideScrollParticles.vue';
import InstallPrompt from '../components/ui/InstallPrompt.vue';
import MissionRail from '../components/ui/MissionRail.vue';
import NavBar from '../components/ui/NavBar.vue';
import { useEnvironment } from '../composables/useEnvironment';
import { pickText, useLanguage } from '../composables/useLanguage';
import { usePointerCssVars } from '../composables/useUiMotion';
import { pageCopy } from '../data/siteContent';

usePointerCssVars();
const { runtime, deviceTier } = useEnvironment();
const { language } = useLanguage();

const route = useRoute();
const particlePreset = computed(() => {
  if (route.path === '/video-bay') return 'video';
  if (route.path.startsWith('/evidence-vault') || route.path.startsWith('/resource-library')) return 'vault';
  return 'home';
});
</script>

<template>
  <div
    class="app-shell"
    :data-runtime="runtime"
    :data-device-tier="deviceTier"
  >
    <div class="ambient-interface" aria-hidden="true" />
    <ParticleField :preset="particlePreset" />
    <CoreMotionParticles :preset="particlePreset" />
    <SideScrollParticles :preset="particlePreset" />
    <NavBar />
    <MissionRail />
    <InstallPrompt />
    <main>
      <slot />
    </main>
    <footer class="footer">
      <p>{{ pickText(pageCopy.footer, language) }}</p>
      <RouterLink to="/">Back to top</RouterLink>
    </footer>
  </div>
</template>
