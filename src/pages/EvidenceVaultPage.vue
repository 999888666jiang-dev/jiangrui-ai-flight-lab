<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import VaultPortalOverlay from '../components/effects/VaultPortalOverlay.vue';
import VideoPreviewTile from '../components/media/VideoPreviewTile.vue';
import { useEnvironment } from '../composables/useEnvironment';
import { pickText, useLanguage } from '../composables/useLanguage';
import { aiDesignWorks } from '../data/aiDesignGalleryManifest';
import { certificateGalleryItems } from '../data/certificatesManifest';
import { certificate, contactItems, evidenceItems, pageCopy, resumeProfile, type EvidenceItem } from '../data/siteContent';
import { getShowcaseMedia, resolveShowcaseMediaSources, type ShowcaseMediaGroup } from '../data/showcaseMedia';
import { uavGalleryImages } from '../data/uavGalleryManifest';
import { publicAsset } from '../utils/publicAsset';

const { language, t } = useLanguage();
const { profile } = useEnvironment();
const router = useRouter();
const resumePdf = resumeProfile.resumePdf;
const resumeDownloadName = resumeProfile.resumeDownloadName;
const wechatQr = publicAsset('images/wechat-qr.jpg');
const vaultCopy = pageCopy.evidenceVault;
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
const aiVaultPreview = computed(() => {
  if (aiDesignWorks.length === 0) return [];
  return [0, 1, 2].map((offset) => aiDesignWorks[(vaultPreviewSeed + offset * 3) % aiDesignWorks.length]).filter(Boolean);
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
      <p class="section-code">05 / RESOURCE LIBRARY</p>
      <h1>{{ pickText(vaultCopy.title, language) }}</h1>
      <p>{{ pickText(vaultCopy.intro, language) }}</p>
    </div>

    <div class="vault-feature-grid">
      <article class="cert-card vault-card vault-card--license" data-reveal>
        <div class="cert-card__image">
          <img :src="certificate.image" :alt="pickText(certificate.title, language)" loading="lazy" />
        </div>
        <div class="cert-card__body">
          <small>CAAC / VERIFIED PREVIEW</small>
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
        <a class="button button--primary" :href="resumePdf" :download="resumeDownloadName">
          {{ t('cta.downloadResume') }}
        </a>
      </article>
    </div>

    <div class="video-grid evidence-grid">
      <article
        v-for="(item, index) in evidenceItems"
        :key="item.slug"
        class="video-card vault-slot vault-slot--entry"
        :class="[`vault-slot--${item.theme}`, { 'vault-slot--locked': item.confidentialNotice }]"
        :style="{ '--slot-index': index }"
        data-reveal
        role="link"
        tabindex="0"
        :aria-label="`${pickText(item.title, language)} - ${item.confidentialNotice ? pickText(item.confidentialNotice, language) : language === 'zh' ? '进入展示网页' : 'Open showcase page'}`"
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
        <figure v-else-if="item.slug === 'ai-design-works' && aiVaultPreview.length" class="video-card__poster ai-vault-preview" aria-hidden="true">
          <img
            v-for="(work, workIndex) in aiVaultPreview"
            :key="work.id"
            :src="work.thumbSrc"
            :alt="pickText(work.title, language)"
            :style="{ '--ai-preview-index': workIndex }"
            loading="lazy"
            decoding="async"
          />
          <figcaption>NEURAL STACK</figcaption>
        </figure>
        <div v-else class="video-card__poster" aria-hidden="true">
          <span />
        </div>
        <div v-if="item.confidentialNotice" class="vault-slot__lock" aria-hidden="true">
          <span />
        </div>
        <div class="video-card__body">
          <small>{{ pickText(item.status, language) }}</small>
          <h3>{{ pickText(item.title, language) }}</h3>
          <p>{{ pickText(item.description, language) }}</p>
          <strong class="vault-slot__cta">
            {{ item.confidentialNotice ? (language === 'zh' ? '查看保密说明' : 'View notice') : (language === 'zh' ? '进入展示舱' : 'Enter showcase bay') }}
          </strong>
        </div>
      </article>
    </div>

    <VaultPortalOverlay v-if="portal" :item="portal.item" :origin="portal.origin" />
  </section>
</template>
