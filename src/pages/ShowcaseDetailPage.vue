<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import ShowcaseMediaStage from '../components/media/ShowcaseMediaStage.vue';
import { pickText, useLanguage } from '../composables/useLanguage';
import { evidenceItems } from '../data/siteContent';
import type { ShowcaseMediaGroup } from '../data/showcaseMedia';

const route = useRoute();
const { language } = useLanguage();

const slug = computed(() => {
  const value = route.params.slug;
  return Array.isArray(value) ? value[0] : value;
});
const item = computed(() => evidenceItems.find((entry) => entry.slug === slug.value));
const mediaGroup = computed<ShowcaseMediaGroup | undefined>(() => {
  if (item.value?.slug === 'fpv-flight-video' || item.value?.slug === 'deal-results-showcase') return item.value.slug;
  return undefined;
});
const pageIndex = computed(() => (item.value ? evidenceItems.findIndex((entry) => entry.slug === item.value?.slug) : -1));
const nextItem = computed(() => {
  if (pageIndex.value < 0) return evidenceItems[0];
  return evidenceItems[(pageIndex.value + 1) % evidenceItems.length];
});
const orbitDots = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  x: `${10 + (index % 9) * 9}%`,
  y: `${12 + (index % 6) * 13}%`,
  delay: `${index * -140}ms`,
}));
</script>

<template>
  <section v-if="item" class="showcase-detail" :class="`showcase-detail--${item.theme}`">
    <div class="showcase-detail__ambient" aria-hidden="true">
      <span v-for="dot in orbitDots" :key="dot.id" :style="{ '--dot-x': dot.x, '--dot-y': dot.y, '--dot-delay': dot.delay }" />
    </div>

    <header class="showcase-detail__hero">
      <RouterLink class="showcase-back" to="/evidence-vault">
        {{ language === 'zh' ? '返回证据库' : 'Back to Evidence Vault' }}
      </RouterLink>
      <p class="section-code">{{ item.index }} / {{ pickText(item.world, language) }}</p>
      <h1>{{ pickText(item.title, language) }}</h1>
      <p>{{ pickText(item.detailHeadline, language) }}</p>
      <div class="showcase-detail__metrics" aria-label="Showcase metadata">
        <div v-for="metric in item.metrics" :key="metric.label.zh">
          <span>{{ pickText(metric.label, language) }}</span>
          <strong>{{ pickText(metric.value, language) }}</strong>
        </div>
      </div>
    </header>

    <div class="showcase-stage" :class="`showcase-stage--${item.detailLayout}`">
      <div class="showcase-stage__visual" :class="{ 'showcase-stage__visual--media': mediaGroup }" :aria-hidden="mediaGroup ? undefined : 'true'">
        <ShowcaseMediaStage
          v-if="mediaGroup"
          :group="mediaGroup"
          :variant="mediaGroup === 'deal-results-showcase' ? 'outcome' : 'velocity'"
        />

        <template v-else-if="item.detailLayout === 'atelier'">
          <div class="neural-map">
            <span v-for="dot in 12" :key="dot" />
            <strong>INPUT</strong>
            <strong>AGENT</strong>
            <strong>OUTPUT</strong>
          </div>
        </template>

        <template v-else-if="item.detailLayout === 'hangar'">
          <div class="hangar-matrix">
            <span v-for="bay in 9" :key="bay">BAY {{ String(bay).padStart(2, '0') }}</span>
          </div>
        </template>

        <template v-else-if="item.detailLayout === 'recorder'">
          <div class="blackbox-wave">
            <span v-for="bar in 28" :key="bar" :style="{ '--bar': bar }" />
          </div>
        </template>

        <template v-else>
          <div class="verification-scan">
            <span>PUBLIC PREVIEW</span>
            <strong>VERIFY / REDACT / ARCHIVE</strong>
          </div>
        </template>
      </div>

      <article class="showcase-stage__copy">
        <small>{{ pickText(item.status, language) }}</small>
        <h2>{{ pickText(item.world, language) }}</h2>
        <p>{{ pickText(item.detailIntro, language) }}</p>
      </article>
    </div>

    <div class="showcase-panels">
      <article v-for="slot in item.assetSlots" :key="slot.label.zh" class="showcase-panel">
        <small>{{ pickText(slot.status, language) }}</small>
        <h3>{{ pickText(slot.label, language) }}</h3>
        <p>{{ pickText(slot.hint, language) }}</p>
      </article>
    </div>

    <nav class="showcase-next" aria-label="Showcase navigation">
      <RouterLink to="/evidence-vault">
        {{ language === 'zh' ? '回到六大素材库' : 'Return to all vault slots' }}
      </RouterLink>
      <RouterLink :to="`/evidence-vault/${nextItem.slug}`">
        {{ language === 'zh' ? '下一展示舱' : 'Next showcase' }} / {{ pickText(nextItem.title, language) }}
      </RouterLink>
    </nav>
  </section>

  <section v-else class="section evidence-route-page showcase-missing">
    <div class="section-heading">
      <p class="section-code">404 / VAULT CHANNEL</p>
      <h1>{{ language === 'zh' ? '展示舱不存在' : 'Showcase channel missing' }}</h1>
      <p>{{ language === 'zh' ? '该素材通道尚未建立，请返回证据库。' : 'This asset channel is not registered yet. Return to the evidence vault.' }}</p>
      <RouterLink class="button button--primary" to="/evidence-vault">
        {{ language === 'zh' ? '返回证据库' : 'Back to Evidence Vault' }}
      </RouterLink>
    </div>
  </section>
</template>
