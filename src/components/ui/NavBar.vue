<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute, type RouteLocationRaw } from 'vue-router';
import { useLanguage } from '../../composables/useLanguage';
import FlightPillNav from './FlightPillNav.vue';

const { t, toggleLanguage } = useLanguage();
const route = useRoute();

const navItems = [
  { to: { path: '/', hash: '#about' }, key: 'nav.about' },
  { to: { path: '/', hash: '#skills' }, key: 'nav.skills' },
  { to: { path: '/', hash: '#experience' }, key: 'nav.experience' },
  { to: '/video-bay', key: 'nav.videoBay' },
  { to: '/evidence-vault', key: 'nav.videos' },
  { to: { path: '/', hash: '#contact' }, key: 'nav.contact' },
];

function isNavActive(to: RouteLocationRaw) {
  if (typeof to === 'string') {
    return route.path === to;
  }

  if ('path' in to) {
    return route.path === to.path && (to.hash ? route.hash === to.hash : true);
  }

  return false;
}

const pillItems = computed(() =>
  navItems.map((item) => ({
    ...item,
    label: t(item.key),
    active: isNavActive(item.to),
  })),
);

const activeNavLabel = computed(() => pillItems.value.find((item) => item.active)?.label ?? t('nav.about'));
</script>

<template>
  <header class="nav-shell">
    <RouterLink class="brand-mark" to="/" aria-label="Back to top">
      <span class="brand-mark__glyph">JR</span>
      <span>
        <strong>姜睿</strong>
        <small>AI Flight Lab</small>
      </span>
    </RouterLink>

    <FlightPillNav :items="pillItems" :active-label="activeNavLabel" />

    <button class="language-toggle" type="button" @click="toggleLanguage">
      {{ t('labels.language') }}
    </button>
  </header>
</template>
