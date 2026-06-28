<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlightHeroScene from '../components/three/FlightHeroScene.vue';
import CapabilityScrollStack from '../components/ui/CapabilityScrollStack.vue';
import HeroLanyardCard from '../components/ui/HeroLanyardCard.vue';
import { useEnvironment } from '../composables/useEnvironment';
import { pickText, useLanguage } from '../composables/useLanguage';
import {
  certificate,
  contactItems,
  experienceItems,
  facts,
  heroContent,
  missionCopy,
  pageCopy,
  resumeProfile,
  skills,
  systemNodes,
} from '../data/siteContent';
import { publicAsset } from '../utils/publicAsset';

gsap.registerPlugin(ScrollTrigger);

const { language, t } = useLanguage();
const { profile } = useEnvironment();
const activeMission = ref(0);
const resumePdf = resumeProfile.resumePdf;
const resumeDownloadName = resumeProfile.resumeDownloadName;
const profileImage = publicAsset('images/profile-fpv.jpg');
const wechatQr = publicAsset('images/wechat-qr.jpg');
const homeCopy = pageCopy.home;

const currentMission = computed(() => experienceItems[activeMission.value]);
const portraitAlt = computed(() =>
  language.value === 'zh' ? '姜睿 FPV 操控场景照片' : 'Jiang Rui FPV field operation portrait',
);

let gsapContext: gsap.Context | undefined;

onMounted(() => {
  if (profile.value.reducedMotion) return;

  gsapContext = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element, index) => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.82,
          delay: (index % 4) * 0.035,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 82%', once: true },
        },
      );
    });
  });
});

onUnmounted(() => {
  gsapContext?.revert();
});
</script>

<template>
  <div class="home-page">
  <section id="top" class="hero-section">
    <div class="hero-backdrop" aria-hidden="true" />
    <FlightHeroScene />

    <div class="hero-content">
      <div class="hero-copy">
        <p class="hero-lab">AI Flight Lab</p>
        <h1>{{ pickText(heroContent.name, language) }}</h1>
        <p class="hero-title">{{ pickText(heroContent.title, language) }}</p>
        <p class="hero-summary">{{ pickText(heroContent.summary, language) }}</p>

        <div class="hero-actions">
          <RouterLink class="button button--primary" :to="{ path: '/', hash: '#experience' }">{{ t('cta.viewExperience') }}</RouterLink>
          <a class="button button--secondary" :href="resumePdf" :download="resumeDownloadName">
            {{ t('cta.downloadResume') }}
          </a>
        </div>

        <div class="trait-row" aria-label="Core strengths">
          <span v-for="trait in heroContent.traits" :key="trait.zh">{{ pickText(trait, language) }}</span>
        </div>

        <div class="mission-status-strip" aria-label="Mission status">
          <span v-for="item in homeCopy.heroStatus" :key="item.zh">{{ pickText(item, language) }}</span>
        </div>
      </div>

      <aside class="hero-console" aria-label="Flight telemetry">
        <div class="console-ring" aria-hidden="true" />
        <div class="console-readouts">
          <span v-for="item in heroContent.telemetry" :key="item.label">
            <small>{{ item.label }}</small>
            <strong>{{ item.value }}</strong>
          </span>
        </div>
        <div class="hero-sector-map" aria-hidden="true">
          <span v-for="item in homeCopy.sectorMap" :key="item.zh">{{ pickText(item, language) }}</span>
        </div>
        <HeroLanyardCard
          :image-src="profileImage"
          :title="pickText(homeCopy.portraitCaption.title, language)"
          :body="pickText(homeCopy.portraitCaption.body, language)"
          :alt="portraitAlt"
        />
      </aside>
    </div>

    <RouterLink class="scroll-cue" :to="{ path: '/', hash: '#about' }" aria-label="Scroll to mission">
      <span />
    </RouterLink>
  </section>

  <section id="about" class="section section--mission">
    <div class="section-heading" data-reveal>
      <h2>{{ pickText(homeCopy.about.title, language) }}</h2>
      <p>{{ pickText(homeCopy.about.body, language) }}</p>
    </div>

    <div class="mission-grid">
      <div class="mission-copy" data-reveal>
        <p v-for="paragraph in missionCopy" :key="paragraph.zh">{{ pickText(paragraph, language) }}</p>
      </div>

      <div class="mission-panel" data-reveal>
        <div v-for="fact in facts" :key="fact.label.zh">
          <span>{{ pickText(fact.label, language) }}</span>
          <strong>{{ pickText(fact.value, language) }}</strong>
        </div>
      </div>
    </div>
  </section>

  <section id="skills" class="section section--systems">
    <div class="section-heading section-heading--proof" data-reveal>
      <h2>{{ pickText(homeCopy.skills.title, language) }}</h2>
      <p>{{ pickText(homeCopy.skills.body, language) }}</p>
    </div>

    <CapabilityScrollStack :nodes="systemNodes" :language="language" data-reveal />

    <div class="systems-grid">
      <article class="cert-card" data-reveal>
        <div class="cert-card__image">
          <img :src="certificate.image" :alt="pickText(certificate.title, language)" loading="lazy" />
        </div>
        <div class="cert-card__body">
          <h3>{{ pickText(certificate.title, language) }}</h3>
          <p>{{ pickText(certificate.meta, language) }}</p>
          <small>{{ t('labels.redacted') }}</small>
          <span>{{ pickText(certificate.note, language) }}</span>
        </div>
      </article>

      <div class="skill-list skill-list--systems">
        <article v-for="skill in skills" :key="skill.name.zh" class="skill-row" data-reveal>
          <div>
            <h3>{{ pickText(skill.name, language) }}</h3>
            <p>{{ pickText(skill.description, language) }}</p>
          </div>
          <div class="skill-row__meter" :aria-label="`${pickText(skill.name, language)} ${skill.level}%`">
            <span :style="{ width: `${skill.level}%` }" />
          </div>
        </article>
      </div>
    </div>
  </section>

  <section id="experience" class="section section--timeline">
    <div class="section-heading section-heading--timeline" data-reveal>
      <h2>{{ pickText(homeCopy.timeline.title, language) }}</h2>
      <p>{{ pickText(homeCopy.timeline.body, language) }}</p>
    </div>

    <div class="mission-control" data-reveal>
      <div class="mission-control__list" aria-label="Mission selector">
        <button
          v-for="(item, index) in experienceItems"
          :key="`${item.period}-${item.title.zh}`"
          :class="['mission-tab', { 'mission-tab--active': activeMission === index }]"
          type="button"
          @click="activeMission = index"
        >
          <small>{{ String(index + 1).padStart(2, '0') }} / {{ item.period }}</small>
          <span>{{ pickText(item.title, language) }}</span>
        </button>
      </div>

      <article class="mission-window">
        <div class="mission-window__chrome">
          <span>MISSION CONTROL</span>
          <span>STATUS / VERIFIED</span>
        </div>
        <h3>{{ pickText(currentMission.title, language) }}</h3>
        <strong>{{ pickText(currentMission.role, language) }}</strong>
        <p>{{ pickText(currentMission.description, language) }}</p>
        <div class="tag-row">
          <span v-for="tag in currentMission.tags" :key="tag">{{ tag }}</span>
        </div>
      </article>
    </div>
  </section>

  <section id="contact" class="section section--contact">
    <div class="section-heading" data-reveal>
      <h2>{{ pickText(homeCopy.contact.title, language) }}</h2>
      <p>{{ pickText(homeCopy.contact.body, language) }}</p>
    </div>

    <div class="contact-grid">
      <div class="contact-panel" data-reveal>
        <div v-for="item in contactItems" :key="item.label.zh">
          <span>{{ pickText(item.label, language) }}</span>
          <strong>{{ pickText(item.value, language) }}</strong>
        </div>
        <a class="button button--primary" :href="resumePdf" :download="resumeDownloadName">
          {{ t('cta.downloadResume') }}
        </a>
      </div>

      <figure class="qr-card" data-reveal>
        <img :src="wechatQr" alt="姜睿微信二维码" />
        <figcaption>{{ t('cta.wechat') }}</figcaption>
      </figure>
    </div>
  </section>
  </div>
</template>
