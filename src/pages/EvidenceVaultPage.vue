<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import VaultPortalOverlay from '../components/effects/VaultPortalOverlay.vue';
import VideoPreviewTile from '../components/media/VideoPreviewTile.vue';
import { useEnvironment } from '../composables/useEnvironment';
import { pickText, useLanguage } from '../composables/useLanguage';
import { certificateGalleryItems } from '../data/certificatesManifest';
import { certificate, contactItems, evidenceItems, type EvidenceItem } from '../data/siteContent';
import { getShowcaseMedia, resolveShowcaseMediaSources, type ShowcaseMediaGroup } from '../data/showcaseMedia';
import { uavGalleryImages } from '../data/uavGalleryManifest';
import { publicAsset } from '../utils/publicAsset';

const { language, t } = useLanguage();
const { profile } = useEnvironment();
const router = useRouter();
const resumePdf = publicAsset('documents/jiangrui-uav-tester-resume.pdf');
const wechatQr = publicAsset('images/wechat-qr.jpg');
const vaultPreviewSeed = Math.floor(Math.random() * 1000);
const mediaShowcaseGroups: Partial<Record<string, ShowcaseMediaGroup>> = {
  'fpv-flight-video': 'fpv-flight-video',
  'deal-results-showcase': 'deal-results-showcase',
};
const portal = ref<
  | {
      item: EvidenceItem;
      origin: {
        left: number;
        top: number;
        width: number;
        height: number;
      };
    }
  | undefined
>();
let portalTimer = 0;

const evidencePreviewSources = computed(() =>
  evidenceItems.map((item, index) => {
    const group = mediaShowcaseGroups[item.slug];
    if (!group) return undefined;

    const media = getShowcaseMedia(group);
    if (media.length === 0) return undefined;

    const selected = media[(vaultPreviewSeed + index * 7) % media.length];
    return resolveShowcaseMediaSources(selected);
  }),
);
const certificateVaultPreview = computed(() => {
  if (certificateGalleryItems.length === 0) return undefined;
  return certificateGalleryItems[(vaultPreviewSeed + 11) % certificateGalleryItems.length];
});
const uavVaultPreview = computed(() => {
  if (uavGalleryImages.length === 0) return undefined;
  return uavGalleryImages[(vaultPreviewSeed + 5) % uavGalleryImages.length];
});

function openShowcase(item: EvidenceItem, event: MouseEvent | KeyboardEvent) {
  if (portal.value) return;

  if (profile.value.reducedMotion) {
    router.push(`/evidence-vault/${item.slug}`);
    return;
  }

  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  portal.value = {
    item,
    origin: {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    },
  };

  portalTimer = window.setTimeout(() => {
    router.push(`/evidence-vault/${item.slug}`);
  }, 820);
}

onUnmounted(() => {
  if (portalTimer) {
    window.clearTimeout(portalTimer);
  }
});
</script>

<template>
  <section class="section section--evidence evidence-route-page">
    <div class="section-heading vault-heading" data-reveal>
      <p class="section-code">05 / EVIDENCE VAULT</p>
      <h1>{{ language === 'zh' ? '证据库：真实能力档案' : 'Evidence Vault, No Fake Claims' }}</h1>
      <p>
        {{
          language === 'zh'
            ? '这里集中放置执照、二维码、简历 PDF 和后续真实素材位；能力只用证据点亮，不依赖过期临时链接。'
            : 'This page stores the license, QR code, resume PDF, and future real assets. Every slot lights up only after real resources arrive.'
        }}
      </p>
    </div>

    <div class="vault-feature-grid">
      <article class="cert-card vault-card vault-card--license" data-reveal>
        <div class="cert-card__image">
          <img :src="certificate.image" :alt="pickText(certificate.title, language)" loading="lazy" />
        </div>
        <div class="cert-card__body">
          <small>LICENSE / REDACTED</small>
          <h3>{{ pickText(certificate.title, language) }}</h3>
          <p>{{ pickText(certificate.meta, language) }}</p>
          <span>{{ pickText(certificate.note, language) }}</span>
        </div>
      </article>

      <figure class="qr-card vault-card" data-reveal>
        <img :src="wechatQr" alt="姜睿微信二维码" />
        <figcaption>{{ t('cta.wechat') }}</figcaption>
      </figure>

      <article class="contact-panel vault-card" data-reveal>
        <div v-for="item in contactItems" :key="item.label.zh">
          <span>{{ pickText(item.label, language) }}</span>
          <strong>{{ pickText(item.value, language) }}</strong>
        </div>
        <a class="button button--primary" :href="resumePdf" download>
          {{ t('cta.downloadResume') }}
        </a>
      </article>
    </div>

    <div class="video-grid evidence-grid">
      <article
        v-for="(item, index) in evidenceItems"
        :key="item.slug"
        class="video-card vault-slot vault-slot--entry"
        :class="`vault-slot--${item.theme}`"
        :style="{ '--slot-index': index }"
        data-reveal
        role="link"
        tabindex="0"
        :aria-label="`${pickText(item.title, language)} - ${language === 'zh' ? '进入展示网页' : 'Open showcase page'}`"
        @click="openShowcase(item, $event)"
        @keydown.enter="openShowcase(item, $event)"
        @keydown.space.prevent="openShowcase(item, $event)"
      >
        <VideoPreviewTile
          v-if="evidencePreviewSources[index]?.poster"
          class="video-card__poster"
          :poster="evidencePreviewSources[index]?.poster"
          :teaser="evidencePreviewSources[index]?.teaser"
          :variant="item.theme === 'outcome' ? 'outcome' : 'flight'"
          :eager="index < 2"
        />
        <figure v-else-if="item.slug === 'certificates-awards' && certificateVaultPreview" class="video-card__poster certificate-vault-preview" aria-hidden="true">
          <img :src="certificateVaultPreview.cover" :alt="certificateVaultPreview.title" loading="lazy" decoding="async" />
          <figcaption>{{ certificateVaultPreview.title }}</figcaption>
        </figure>
        <figure v-else-if="item.slug === 'uav-platform-gallery' && uavVaultPreview" class="video-card__poster uav-vault-preview" aria-hidden="true">
          <img :src="uavVaultPreview.displaySrc" :alt="pickText(uavVaultPreview.title, language)" loading="lazy" decoding="async" />
          <figcaption>{{ pickText(uavVaultPreview.title, language) }}</figcaption>
        </figure>
        <div v-else class="video-card__poster" aria-hidden="true">
          <span />
        </div>
        <div class="video-card__body">
          <small>{{ pickText(item.status, language) }}</small>
          <h3>{{ pickText(item.title, language) }}</h3>
          <p>{{ pickText(item.description, language) }}</p>
          <strong class="vault-slot__cta">{{ language === 'zh' ? '进入展示舱' : 'Enter showcase bay' }}</strong>
        </div>
      </article>
    </div>

    <VaultPortalOverlay v-if="portal" :item="portal.item" :origin="portal.origin" />
  </section>
</template>
