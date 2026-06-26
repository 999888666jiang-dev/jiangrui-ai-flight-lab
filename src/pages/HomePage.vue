<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlightHeroScene from '../components/three/FlightHeroScene.vue';
import { useEnvironment } from '../composables/useEnvironment';
import { pickText, useLanguage } from '../composables/useLanguage';
import {
  certificate,
  contactItems,
  experienceItems,
  facts,
  heroContent,
  missionCopy,
  skills,
  systemNodes,
} from '../data/siteContent';
import { publicAsset } from '../utils/publicAsset';

gsap.registerPlugin(ScrollTrigger);

const { language, t } = useLanguage();
const { profile } = useEnvironment();
const activeSystem = ref(0);
const activeMission = ref(0);
const resumePdf = publicAsset('documents/jiangrui-uav-tester-resume.pdf');
const profileImage = publicAsset('images/profile-fpv.jpg');
const wechatQr = publicAsset('images/wechat-qr.jpg');

const currentSystem = computed(() => systemNodes[activeSystem.value]);
const currentMission = computed(() => experienceItems[activeMission.value]);

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
          <a class="button button--secondary" :href="resumePdf" download>
            {{ t('cta.downloadResume') }}
          </a>
        </div>

        <div class="trait-row" aria-label="Core strengths">
          <span v-for="trait in heroContent.traits" :key="trait.zh">{{ pickText(trait, language) }}</span>
        </div>

        <div class="mission-status-strip" aria-label="Mission status">
          <span>VUE3 MIGRATION ACTIVE</span>
          <span>AI / FPV / UAV / CODE</span>
          <span>SCROLL TO ARM SYSTEMS</span>
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
          <span>AI DESIGN</span>
          <span>FPV PILOT</span>
          <span>UAV ALL-MODEL</span>
          <span>PROGRAMMER</span>
        </div>
        <figure class="hero-portrait">
          <img :src="profileImage" alt="姜睿 FPV 操控场景照片" />
          <figcaption>
            <strong>FPV</strong>
            <span>Field operation / control practice</span>
          </figcaption>
        </figure>
      </aside>
    </div>

    <RouterLink class="scroll-cue" :to="{ path: '/', hash: '#about' }" aria-label="Scroll to mission">
      <span />
    </RouterLink>
  </section>

  <section id="about" class="section section--mission">
    <div class="section-heading" data-reveal>
      <h2>{{ language === 'zh' ? '任务不是展示简历，而是证明能力' : 'Mission, Not Template' }}</h2>
      <p>
        {{
          language === 'zh'
            ? '参考站点的交互逻辑被转译为飞行系统叙事：主视觉响应鼠标，章节沿航迹展开，资源用证据库持续补充。'
            : 'The reference interaction is translated into a flight-system narrative: pointer-reactive visuals, route-like sections, and an expandable evidence archive.'
        }}
      </p>
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
    <div class="section-heading" data-reveal>
      <h2>{{ language === 'zh' ? '能力系统，而不是技能清单' : 'Mission Systems' }}</h2>
      <p>
        {{
          language === 'zh'
            ? '把证书、飞行、AI 工作流和代码能力组织成一个可验证的系统。点击节点切换当前能力读数。'
            : 'Credentials, flight operation, AI workflow, and code are organized as a verifiable system. Click a node to switch the active readout.'
        }}
      </p>
    </div>

    <div class="systems-map" data-reveal>
      <button
        v-for="(node, index) in systemNodes"
        :key="node.label.zh"
        :class="['system-node', { 'system-node--active': activeSystem === index }]"
        type="button"
        @click="activeSystem = index"
      >
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        <h3>{{ pickText(node.label, language) }}</h3>
        <p>{{ node.value }}</p>
      </button>
    </div>

    <article class="system-readout" data-reveal>
      <span>ACTIVE SYSTEM / {{ String(activeSystem + 1).padStart(2, '0') }}</span>
      <h3>{{ pickText(currentSystem.label, language) }}</h3>
      <p>
        {{
          language === 'zh'
            ? '点击上方节点会切换当前能力系统。后续每个系统都可以继续挂接真实项目、视频、日志、证书或代码链接。'
            : 'Click a node to switch the active capability system. Each system can later attach real projects, videos, logs, certificates, or code links.'
        }}
      </p>
    </article>

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
    <div class="section-heading" data-reveal>
      <h2>{{ language === 'zh' ? '航迹时间线' : 'Flight-System Timeline' }}</h2>
      <p>
        {{
          language === 'zh'
            ? '时间线保留真实依据，不虚构飞行时长或项目成果。每段经历可继续挂接视频、报告和图片证据。'
            : 'The timeline stays evidence-based, without invented flight hours or project outcomes. Videos, reports, and images can be attached later.'
        }}
      </p>
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
      <h2>{{ language === 'zh' ? '联系与资料' : 'Contact & Materials' }}</h2>
      <p>
        {{
          language === 'zh'
            ? '当前优先展示微信二维码和简历 PDF。后续邮箱、项目链接、飞行日志和更多证书可以继续从资源包接入。'
            : 'The current page prioritizes WeChat and the resume PDF. Email, project links, flight logs, and more certificates can be wired in later.'
        }}
      </p>
    </div>

    <div class="contact-grid">
      <div class="contact-panel" data-reveal>
        <div v-for="item in contactItems" :key="item.label.zh">
          <span>{{ pickText(item.label, language) }}</span>
          <strong>{{ pickText(item.value, language) }}</strong>
        </div>
        <a class="button button--primary" :href="resumePdf" download>
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
