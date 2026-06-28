<script setup lang="ts">
import type { Language } from '../../composables/useLanguage';
import { pickText } from '../../composables/useLanguage';
import type { LocalizedText } from '../../data/siteContent';

type CapabilityNode = {
  label: LocalizedText;
  value: string;
};

defineProps<{
  nodes: CapabilityNode[];
  language: Language;
}>();

const markers = [
  { zh: '开发成片', en: 'Build' },
  { zh: '测试成证', en: 'Test' },
  { zh: '现场成据', en: 'Field' },
  { zh: '转化成效', en: 'Market' },
];

const cardStyle = (index: number) => ({
  '--stack-index': String(index),
  '--stack-offset': `${index * 18}px`,
  '--stack-scale': String(1 - index * 0.018),
  '--stack-rotate': `${(index - 1.5) * 0.72}deg`,
  '--stack-delay': `${index * 90}ms`,
});
</script>

<template>
  <div class="capability-scroll-stack" aria-label="Capability scroll stack">
    <div class="capability-scroll-stack__spine" aria-hidden="true">
      <span v-for="node in nodes" :key="node.label.zh" />
    </div>

    <article
      v-for="(node, index) in nodes"
      :key="node.label.zh"
      class="capability-scroll-card"
      :style="cardStyle(index)"
    >
      <div class="capability-scroll-card__chrome">
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        <small>{{ pickText(markers[index], language) }}</small>
      </div>

      <div class="capability-scroll-card__body">
        <h3>{{ pickText(node.label, language) }}</h3>
        <p>{{ node.value }}</p>
      </div>

      <div class="capability-scroll-card__trace" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </article>
  </div>
</template>
