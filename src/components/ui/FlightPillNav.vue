<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import { gsap } from 'gsap';
import { useEnvironment } from '../../composables/useEnvironment';

export type FlightPillNavItem = {
  key: string;
  label: string;
  to: RouteLocationRaw;
  active: boolean;
};

const props = defineProps<{
  items: FlightPillNavItem[];
  activeLabel: string;
}>();

const { profile } = useEnvironment();
const menuOpen = ref(false);
const trackRef = ref<HTMLElement>();
const circleRefs = ref<HTMLElement[]>([]);
const labelRefs = ref<HTMLElement[]>([]);
const hoverLabelRefs = ref<HTMLElement[]>([]);
const mobileMenuRef = ref<HTMLElement>();
const menuButtonRef = ref<HTMLButtonElement>();
const timelines: Array<gsap.core.Timeline | undefined> = [];
const tweens: Array<gsap.core.Tween | undefined> = [];
let resizeHandler: (() => void) | undefined;

const canAnimate = computed(() => profile.value.motion.hoverMotion && !profile.value.reducedMotion);

function setCircleRef(element: HTMLElement | null, index: number) {
  if (element) circleRefs.value[index] = element;
}

function setLabelRef(element: HTMLElement | null, index: number) {
  if (element) labelRefs.value[index] = element;
}

function setHoverLabelRef(element: HTMLElement | null, index: number) {
  if (element) hoverLabelRefs.value[index] = element;
}

function buildTimelines() {
  timelines.forEach((timeline) => timeline?.kill());
  tweens.forEach((tween) => tween?.kill());
  timelines.length = 0;
  tweens.length = 0;

  circleRefs.value.forEach((circle, index) => {
    const pill = circle?.parentElement;
    if (!circle || !pill) return;

    const rect = pill.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const radius = ((width * width) / 4 + height * height) / (2 * height);
    const diameter = Math.ceil(2 * radius) + 2;
    const delta = Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (width * width) / 4))) + 1;
    const originY = diameter - delta;
    const label = labelRefs.value[index];
    const hoverLabel = hoverLabelRefs.value[index];

    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    circle.style.bottom = `-${delta}px`;

    gsap.set(circle, {
      xPercent: -50,
      scale: 0,
      transformOrigin: `50% ${originY}px`,
    });
    if (label) gsap.set(label, { y: 0 });
    if (hoverLabel) gsap.set(hoverLabel, { y: Math.ceil(height + 40), opacity: 0 });

    if (!canAnimate.value) return;

    const timeline = gsap.timeline({ paused: true });
    timeline.to(circle, { scale: 1.18, xPercent: -50, duration: 1.25, ease: 'power3.out', overwrite: 'auto' }, 0);
    if (label) timeline.to(label, { y: -(height + 8), duration: 1.25, ease: 'power3.out', overwrite: 'auto' }, 0);
    if (hoverLabel) {
      timeline.to(hoverLabel, { y: 0, opacity: 1, duration: 1.25, ease: 'power3.out', overwrite: 'auto' }, 0);
    }
    timelines[index] = timeline;
  });
}

function handleEnter(index: number) {
  if (!canAnimate.value) return;
  const timeline = timelines[index];
  if (!timeline) return;

  tweens[index]?.kill();
  tweens[index] = timeline.tweenTo(timeline.duration(), {
    duration: 0.28,
    ease: 'power3.out',
    overwrite: 'auto',
  });
}

function handleLeave(index: number) {
  const timeline = timelines[index];
  if (!timeline) return;

  tweens[index]?.kill();
  tweens[index] = timeline.tweenTo(0, {
    duration: 0.2,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

function animateMobileMenu() {
  const menu = mobileMenuRef.value;
  if (!menu) return;

  if (!canAnimate.value) {
    menu.style.visibility = menuOpen.value ? 'visible' : 'hidden';
    menu.style.opacity = menuOpen.value ? '1' : '0';
    menu.style.transform = menuOpen.value ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.98)';
    return;
  }

  if (menuOpen.value) {
    gsap.set(menu, { visibility: 'visible' });
    gsap.fromTo(
      menu,
      { y: 10, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.24, ease: 'power2.out', transformOrigin: 'top center' },
    );
  } else {
    gsap.to(menu, {
      y: 10,
      opacity: 0,
      scale: 0.98,
      duration: 0.18,
      ease: 'power2.out',
      onComplete: () => gsap.set(menu, { visibility: 'hidden' }),
    });
  }
}

watch(
  () => [props.items.map((item) => `${item.label}:${item.active}`).join('|'), canAnimate.value],
  async () => {
    await nextTick();
    buildTimelines();
  },
);

watch(
  () => props.activeLabel,
  () => {
    menuOpen.value = false;
  },
);

watch(menuOpen, animateMobileMenu);

onMounted(async () => {
  await nextTick();
  buildTimelines();
  if (mobileMenuRef.value) {
    gsap.set(mobileMenuRef.value, { visibility: 'hidden', opacity: 0, y: 10, scale: 0.98 });
  }

  resizeHandler = () => buildTimelines();
  window.addEventListener('resize', resizeHandler, { passive: true });
  document.fonts?.ready.then(buildTimelines).catch(() => undefined);
});

onUnmounted(() => {
  timelines.forEach((timeline) => timeline?.kill());
  tweens.forEach((tween) => tween?.kill());
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);
});
</script>

<template>
  <div class="flight-pill-nav" :class="{ 'flight-pill-nav--open': menuOpen }">
    <nav ref="trackRef" class="flight-pill-nav__track" aria-label="Primary navigation">
      <RouterLink v-for="(item, index) in items" :key="item.key" :to="item.to" custom v-slot="{ href, navigate }">
        <a
          :href="href"
          class="flight-pill"
          :class="{ 'flight-pill--active': item.active }"
          :aria-current="item.active ? 'page' : undefined"
          @mouseenter="handleEnter(index)"
          @mouseleave="handleLeave(index)"
          @focus="handleEnter(index)"
          @blur="handleLeave(index)"
          @click="(event) => { closeMenu(); navigate(event); }"
        >
          <span :ref="(element) => setCircleRef(element as HTMLElement | null, index)" class="flight-pill__circle" aria-hidden="true" />
          <span class="flight-pill__label-stack">
            <span :ref="(element) => setLabelRef(element as HTMLElement | null, index)" class="flight-pill__label">{{ item.label }}</span>
            <span :ref="(element) => setHoverLabelRef(element as HTMLElement | null, index)" class="flight-pill__label-hover" aria-hidden="true">
              {{ item.label }}
            </span>
          </span>
        </a>
      </RouterLink>
    </nav>

    <button
      ref="menuButtonRef"
      class="flight-pill-nav__mobile-button"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="flight-pill-mobile-menu"
      @click="toggleMenu"
    >
      <span>{{ activeLabel }}</span>
      <i aria-hidden="true" />
    </button>

    <div id="flight-pill-mobile-menu" ref="mobileMenuRef" class="flight-pill-nav__mobile-menu">
      <RouterLink v-for="item in items" :key="`mobile-${item.key}`" :to="item.to" custom v-slot="{ href, navigate }">
        <a
          :href="href"
          class="flight-pill-nav__mobile-link"
          :class="{ 'flight-pill-nav__mobile-link--active': item.active }"
          @click="(event) => { closeMenu(); navigate(event); }"
        >
          {{ item.label }}
        </a>
      </RouterLink>
    </div>
  </div>
</template>
