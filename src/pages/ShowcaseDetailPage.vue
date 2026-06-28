<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import AiDesignStackGallery from '../components/media/AiDesignStackGallery.vue';
import CertificateBookGallery from '../components/media/CertificateBookGallery.vue';
import ShowcaseMediaStage from '../components/media/ShowcaseMediaStage.vue';
import UavHangarDome from '../components/media/UavHangarDome.vue';
import { pickText, useLanguage } from '../composables/useLanguage';
import { aiDesignWorks } from '../data/aiDesignGalleryManifest';
import { evidenceItems } from '../data/siteContent';
import type { ShowcaseMediaGroup } from '../data/showcaseMedia';
import { uavGalleryImages } from '../data/uavGalleryManifest';

const route = useRoute();
const { language } = useLanguage();

type MediaStageControlState = {
  isMuted: boolean;
  isFullLoading: boolean;
  fullLoadPercent: number;
  fullLoadStyle: Record<string, string>;
  isFullActive: boolean;
  canSwitchToFull: boolean;
  reelPath: string;
  soundLabel: string;
  randomLabel: string;
  fullLabel: string;
  viewMoreLabel: string;
};

type MediaStagePublicControls = {
  toggleSound: () => void;
  pickRandomMedia: () => void;
  playFullVersion: () => void;
};

const defaultMediaControlState = (): MediaStageControlState => ({
  isMuted: true,
  isFullLoading: false,
  fullLoadPercent: 0,
  fullLoadStyle: { '--media-full-progress': '0%' },
  isFullActive: false,
  canSwitchToFull: false,
  reelPath: '',
  soundLabel: language.value === 'zh' ? '开启声音' : 'Sound on',
  randomLabel: language.value === 'zh' ? '随机切片' : 'Random slice',
  fullLabel: language.value === 'zh' ? '查看高清完整版本' : 'Load full version',
  viewMoreLabel: language.value === 'zh' ? '查看更多' : 'View more',
});

const mediaStageRef = ref<MediaStagePublicControls | null>(null);
const mediaControlState = ref<MediaStageControlState>(defaultMediaControlState());
const activeActionCard = ref<string | null>(null);
let actionPulseTimer: number | undefined;

const slug = computed(() => {
  const value = route.params.slug;
  return Array.isArray(value) ? value[0] : value;
});
const item = computed(() => evidenceItems.find((entry) => entry.slug === slug.value));
const mediaGroup = computed<ShowcaseMediaGroup | undefined>(() => {
  if (item.value?.slug === 'fpv-flight-video' || item.value?.slug === 'deal-results-showcase') return item.value.slug;
  return undefined;
});
const isCertificateBook = computed(() => item.value?.slug === 'certificates-awards');
const isUavGallery = computed(() => item.value?.slug === 'uav-platform-gallery');
const isAiDesignGallery = computed(() => item.value?.slug === 'ai-design-works');
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

const isMediaShowcase = computed(() => Boolean(mediaGroup.value));
const soundActionAria = computed(() =>
  language.value === 'zh'
    ? `声音控制：${mediaControlState.value.soundLabel}`
    : `Audio control: ${mediaControlState.value.soundLabel}`,
);

function handleMediaControlsChange(state: MediaStageControlState) {
  mediaControlState.value = state;
}

function pulseActionCard(card: string) {
  activeActionCard.value = card;
  if (actionPulseTimer) window.clearTimeout(actionPulseTimer);
  actionPulseTimer = window.setTimeout(() => {
    activeActionCard.value = null;
  }, 360);
}

function triggerSoundControl() {
  mediaStageRef.value?.toggleSound();
  pulseActionCard('sound');
}

function triggerRandomControl() {
  mediaStageRef.value?.pickRandomMedia();
  pulseActionCard('random');
}

function triggerFullControl() {
  if (!mediaControlState.value.canSwitchToFull && !mediaControlState.value.isFullLoading) return;
  mediaStageRef.value?.playFullVersion();
  pulseActionCard('full');
}

function panelActionKind(index: number) {
  if (!isMediaShowcase.value) return '';
  if (index === 0) return 'random';
  if (index === 1) return 'more';
  if (index === 2) return 'full';
  return '';
}

onUnmounted(() => {
  if (actionPulseTimer) window.clearTimeout(actionPulseTimer);
});
</script>

<template>
  <section v-if="item" class="showcase-detail" :class="`showcase-detail--${item.theme}`">
    <div class="showcase-detail__ambient" aria-hidden="true">
      <span v-for="dot in orbitDots" :key="dot.id" :style="{ '--dot-x': dot.x, '--dot-y': dot.y, '--dot-delay': dot.delay }" />
    </div>

    <header class="showcase-detail__hero">
      <RouterLink class="showcase-back" to="/evidence-vault">
        {{ language === 'zh' ? '返回资料库' : 'Back to Resource Library' }}
      </RouterLink>
      <p class="section-code">{{ item.index }} / {{ pickText(item.world, language) }}</p>
      <h1>{{ pickText(item.title, language) }}</h1>
      <p>{{ pickText(item.detailHeadline, language) }}</p>
      <div class="showcase-detail__metrics" :class="{ 'showcase-detail__metrics--media-actions': isMediaShowcase }" aria-label="Showcase metadata">
        <template v-for="(metric, metricIndex) in item.metrics" :key="metric.label.zh">
          <button
            v-if="isMediaShowcase && metricIndex === 2"
            class="showcase-metric-action showcase-action-card showcase-action-card--sound"
            :class="{ 'showcase-action-card--pulse': activeActionCard === 'sound', 'showcase-action-card--active': !mediaControlState.isMuted }"
            type="button"
            :aria-label="soundActionAria"
            :aria-pressed="!mediaControlState.isMuted"
            @click="triggerSoundControl"
          >
            <span>{{ pickText(metric.label, language) }}</span>
            <strong>{{ pickText(metric.value, language) }}</strong>
            <span class="showcase-card-command showcase-card-command--sound">
              <i class="showcase-sound-wave" aria-hidden="true"><b /><b /><b /></i>
              {{ mediaControlState.soundLabel }}
            </span>
          </button>
          <div v-else>
            <span>{{ pickText(metric.label, language) }}</span>
            <strong>{{ pickText(metric.value, language) }}</strong>
          </div>
        </template>
      </div>
    </header>

    <CertificateBookGallery v-if="isCertificateBook" />
    <UavHangarDome v-else-if="isUavGallery" :images="uavGalleryImages" />
    <AiDesignStackGallery v-else-if="isAiDesignGallery" :items="aiDesignWorks" />
    <section v-else-if="item.confidentialNotice" class="confidential-dossier" aria-labelledby="confidential-dossier-title">
      <div class="confidential-dossier__seal" aria-hidden="true">
        <span />
      </div>
      <article class="confidential-dossier__body">
        <small>LOCKED / PRIVATE DOSSIER</small>
        <h2 id="confidential-dossier-title">{{ pickText(item.confidentialNotice, language) }}</h2>
        <p>
          {{
            language === 'zh'
              ? '该展示舱对应真实测试、日志与现场复盘能力，但具体材料涉及保密要求，公开页面仅保留能力说明和锁定状态。'
              : 'This bay maps to real testing, logging, and field-review capability, but the materials are confidential. The public page keeps only the capability note and locked state.'
          }}
        </p>
        <RouterLink class="confidential-dossier__back" to="/evidence-vault">
          {{ language === 'zh' ? '返回资料库' : 'Back to Resource Library' }}
        </RouterLink>
      </article>
      <div class="confidential-dossier__redactions" aria-hidden="true">
        <span v-for="line in 9" :key="line" />
      </div>
    </section>

    <template v-else>
    <div class="showcase-stage" :class="`showcase-stage--${item.detailLayout}`">
      <div class="showcase-stage__visual" :class="{ 'showcase-stage__visual--media': mediaGroup }" :aria-hidden="mediaGroup ? undefined : 'true'">
        <ShowcaseMediaStage
          v-if="mediaGroup"
          ref="mediaStageRef"
          :group="mediaGroup"
          :variant="mediaGroup === 'deal-results-showcase' ? 'outcome' : 'velocity'"
          @controls-change="handleMediaControlsChange"
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

    <div class="showcase-panels" :class="{ 'showcase-panels--media-actions': isMediaShowcase }">
      <article
        v-for="(slot, slotIndex) in item.assetSlots"
        :key="slot.label.zh"
        class="showcase-panel"
        :class="[
          isMediaShowcase ? 'showcase-action-card' : '',
          isMediaShowcase ? `showcase-action-card--${panelActionKind(slotIndex)}` : '',
          activeActionCard === panelActionKind(slotIndex) ? 'showcase-action-card--pulse' : '',
          panelActionKind(slotIndex) === 'full' && mediaControlState.isFullActive ? 'showcase-action-card--active' : '',
        ]"
      >
        <small>{{ pickText(slot.status, language) }}</small>
        <h3>{{ pickText(slot.label, language) }}</h3>
        <p>{{ pickText(slot.hint, language) }}</p>
        <button
          v-if="panelActionKind(slotIndex) === 'random'"
          class="showcase-card-command"
          type="button"
          @click="triggerRandomControl"
        >
          {{ mediaControlState.randomLabel }}
        </button>
        <RouterLink
          v-else-if="panelActionKind(slotIndex) === 'more'"
          class="showcase-card-command showcase-card-command--link"
          :to="mediaControlState.reelPath || `/evidence-vault/${mediaGroup}/reel`"
        >
          {{ mediaControlState.viewMoreLabel }}
        </RouterLink>
        <button
          v-else-if="panelActionKind(slotIndex) === 'full'"
          class="showcase-card-command media-full-button"
          :class="{ 'media-full-button--loading': mediaControlState.isFullLoading, 'media-full-button--active': mediaControlState.isFullActive && !mediaControlState.isFullLoading }"
          :style="mediaControlState.fullLoadStyle"
          type="button"
          :disabled="!mediaControlState.canSwitchToFull && !mediaControlState.isFullLoading"
          @click="triggerFullControl"
        >
          <span>{{ mediaControlState.fullLabel }}</span>
        </button>
      </article>
    </div>
    </template>

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
      <p>{{ language === 'zh' ? '该素材通道尚未建立，请返回资料库。' : 'This asset channel is not registered yet. Return to the resource library.' }}</p>
      <RouterLink class="button button--primary" to="/evidence-vault">
        {{ language === 'zh' ? '返回资料库' : 'Back to Resource Library' }}
      </RouterLink>
    </div>
  </section>
</template>
