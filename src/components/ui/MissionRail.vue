<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useScrollProgress } from '../../composables/useUiMotion';

const route = useRoute();
const progress = useScrollProgress();

const homeItems = [
  { to: { path: '/', hash: '#top' }, label: 'TOP', code: '00' },
  { to: { path: '/', hash: '#about' }, label: 'BRIEF', code: '01' },
  { to: { path: '/', hash: '#skills' }, label: 'SYSTEMS', code: '02' },
  { to: { path: '/', hash: '#experience' }, label: 'MISSIONS', code: '03' },
  { to: '/video-bay', label: 'VIDEO', code: '04' },
  { to: '/evidence-vault', label: 'LIBRARY', code: '05' },
  { to: { path: '/', hash: '#contact' }, label: 'CONTACT', code: '06' },
];

const routeItems = computed(() => {
  if (route.path === '/video-bay') {
    return [
      { to: '/', label: 'HOME', code: '00' },
      { to: '/video-bay', label: 'VIDEO', code: '04' },
      { to: '/evidence-vault', label: 'LIBRARY', code: '05' },
    ];
  }

  if (route.path.startsWith('/evidence-vault')) {
    return [
      { to: '/', label: 'HOME', code: '00' },
      { to: '/video-bay', label: 'VIDEO', code: '04' },
      { to: '/evidence-vault', label: 'LIBRARY', code: '05' },
    ];
  }

  return homeItems;
});
</script>

<template>
  <aside
    class="mission-rail"
    :style="{ '--rail-progress': progress.toFixed(3) }"
    aria-label="Mission progress navigation"
  >
    <div class="mission-rail__track" aria-hidden="true">
      <span />
    </div>
    <nav>
      <RouterLink v-for="item in routeItems" :key="`${item.code}-${item.label}`" :to="item.to">
        <small>{{ item.code }}</small>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
