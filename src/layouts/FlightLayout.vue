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
import { usePointerCssVars } from '../composables/useUiMotion';

usePointerCssVars();
const { runtime, deviceTier } = useEnvironment();

const route = useRoute();
const particlePreset = computed(() => {
  if (route.path === '/video-bay') return 'video';
  if (route.path.startsWith('/evidence-vault')) return 'vault';
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
      <p>姜睿个人网站。Vue3 版本保留 AI Flight Lab 世界观，真实资源继续从本地资源包接入，并通过统一适配层覆盖桌面、移动端与微信环境。</p>
      <RouterLink to="/">Back to top</RouterLink>
    </footer>
  </div>
</template>
