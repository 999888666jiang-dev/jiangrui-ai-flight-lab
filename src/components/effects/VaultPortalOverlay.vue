<script setup lang="ts">
import { computed } from 'vue';
import { pickText, useLanguage } from '../../composables/useLanguage';
import type { EvidenceItem } from '../../data/siteContent';

const props = defineProps<{
  item: EvidenceItem;
  origin: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}>();

const { language } = useLanguage();

const portalStyle = computed(() => ({
  '--portal-x': `${props.origin.left + props.origin.width / 2}px`,
  '--portal-y': `${props.origin.top + props.origin.height / 2}px`,
  '--portal-w': `${Math.max(1, props.origin.width)}px`,
  '--portal-h': `${Math.max(1, props.origin.height)}px`,
}));

const particles = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  angle: `${index * 15}deg`,
  delay: `${index * 18}ms`,
  distance: `${140 + (index % 6) * 34}px`,
}));
</script>

<template>
  <div class="vault-portal" :class="`vault-portal--${item.theme}`" :style="portalStyle" aria-hidden="true">
    <div class="vault-portal__source" />
    <div class="vault-portal__core">
      <span v-for="particle in particles" :key="particle.id" :style="{ '--angle': particle.angle, '--delay': particle.delay, '--distance': particle.distance }" />
      <strong>{{ pickText(item.world, language) }}</strong>
      <small>{{ pickText(item.title, language) }}</small>
    </div>
    <div class="vault-portal__scan" />
  </div>
</template>
