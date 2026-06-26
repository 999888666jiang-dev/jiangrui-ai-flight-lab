<script setup lang="ts">
import { RouterLink, useRoute, type RouteLocationRaw } from 'vue-router';
import { useLanguage } from '../../composables/useLanguage';

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

    <nav class="nav-links" aria-label="Primary navigation">
      <RouterLink v-for="item in navItems" :key="item.key" :to="item.to" custom v-slot="{ href, navigate }">
        <a :href="href" :class="{ 'nav-link--active': isNavActive(item.to) }" @click="navigate">
          {{ t(item.key) }}
        </a>
      </RouterLink>
    </nav>

    <button class="language-toggle" type="button" @click="toggleLanguage">
      {{ t('labels.language') }}
    </button>
  </header>
</template>
