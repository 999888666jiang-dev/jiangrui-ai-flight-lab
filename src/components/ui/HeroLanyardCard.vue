<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { gsap } from 'gsap';
import { useEnvironment } from '../../composables/useEnvironment';

const props = defineProps<{
  imageSrc: string;
  title: string;
  body: string;
  alt: string;
}>();

const { profile } = useEnvironment();
const rootRef = ref<HTMLElement>();
const passRef = ref<HTMLElement>();
const isDragging = ref(false);
const isRevealed = ref(false);

let pointerStart: { x: number; y: number } | undefined;
let dragMoved = false;
let suppressClick = false;
let activeTween: gsap.core.Tween | gsap.core.Timeline | undefined;
let entranceTween: gsap.core.Timeline | undefined;

const canAnimate = computed(() => {
  const current = profile.value;
  return !current.reducedMotion && current.deviceTier !== 'minimal';
});

const canDrag = computed(() => {
  const current = profile.value;
  return canAnimate.value && current.runtime === 'desktop' && current.viewport.width >= 900 && !current.isWeChat;
});

const interactionLabel = computed(() =>
  canDrag.value ? 'Drag or click to inspect flight pass' : 'Click to inspect flight pass',
);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function setVars(vars: Record<string, string | number>, duration = 0.18, ease = 'power3.out') {
  if (!rootRef.value) return;
  activeTween?.kill();
  activeTween = gsap.to(rootRef.value, {
    ...vars,
    duration,
    ease,
    overwrite: 'auto',
  });
}

function resetPose(duration = 0.68) {
  if (!rootRef.value) return;
  activeTween?.kill();
  const currentY = getComputedStyle(rootRef.value).getPropertyValue('--pass-y').trim();
  const parsedY = Number.parseFloat(currentY || '0');
  const recoilY = clamp(parsedY * -0.24, -28, 28);

  activeTween = gsap
    .timeline({ defaults: { overwrite: 'auto' } })
    .to(rootRef.value, {
      '--pass-y': `${recoilY}px`,
      '--pass-x': '0px',
      '--pass-rot': `${clamp(recoilY / -10, -2.4, 2.4)}deg`,
      '--pass-tilt-x': `${clamp(recoilY / 7, -5, 5)}deg`,
      '--pass-tilt-y': '0deg',
      '--chain-x': '0px',
      '--chain-y': `${clamp(Math.max(0, recoilY) * 0.12, 0, 5)}px`,
      '--chain-rot': '0deg',
      '--chain-stretch': recoilY < 0 ? 0.97 : 1.02,
      duration: Math.min(0.18, duration * 0.42),
      ease: 'power2.out',
    })
    .to(rootRef.value, {
      '--pass-x': '0px',
      '--pass-y': '0px',
      '--pass-rot': '0deg',
      '--pass-tilt-x': '0deg',
      '--pass-tilt-y': '0deg',
      '--chain-x': '0px',
      '--chain-y': '0px',
      '--chain-rot': '0deg',
      '--chain-stretch': 1,
      duration,
      ease: 'elastic.out(1, 0.5)',
    });
}

function playEntrance() {
  if (!rootRef.value) return;
  entranceTween?.kill();

  if (!canAnimate.value) {
    gsap.set(rootRef.value, {
      '--drop-y': '0px',
      '--drop-rot': '0deg',
      '--drop-opacity': 1,
      '--chain-stretch': 1,
    });
    return;
  }

  gsap.set(rootRef.value, {
    '--drop-y': '-58vh',
    '--drop-rot': '-7deg',
    '--drop-opacity': 0,
    '--pass-y': '0px',
    '--pass-rot': '0deg',
    '--chain-y': '0px',
    '--chain-rot': '-1deg',
    '--chain-stretch': 1.22,
  });

  entranceTween = gsap
    .timeline({ delay: 0.34 })
    .to(rootRef.value, {
      '--drop-opacity': 1,
      duration: 0.18,
      ease: 'power1.out',
    }, 0)
    .to(rootRef.value, {
      '--drop-y': '18px',
      '--drop-rot': '2.2deg',
      '--chain-stretch': 1.26,
      duration: 0.92,
      ease: 'power2.in',
    }, 0)
    .to(rootRef.value, {
      '--drop-y': '-8px',
      '--drop-rot': '-1.2deg',
      '--chain-stretch': 0.96,
      duration: 0.28,
      ease: 'power2.out',
    })
    .to(rootRef.value, {
      '--drop-y': '0px',
      '--drop-rot': '0deg',
      '--chain-rot': '0deg',
      '--chain-stretch': 1,
      duration: 0.86,
      ease: 'elastic.out(1, 0.52)',
    });
}

function handlePointerDown(event: PointerEvent) {
  if (!canDrag.value || event.pointerType === 'touch' || !passRef.value) return;
  pointerStart = { x: event.clientX, y: event.clientY };
  dragMoved = false;
  isDragging.value = true;
  activeTween?.kill();
  passRef.value.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function handlePointerMove(event: PointerEvent) {
  if (!canAnimate.value || !rootRef.value || !passRef.value) return;

  if (pointerStart && canDrag.value) {
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    const distance = Math.hypot(dx, dy);
    const cardX = clamp(dx, -280, 280);
    const cardY = clamp(dy, -210, 240);
    const tension = cardY >= 0 ? 1 + clamp(cardY / 560, 0, 0.34) : 1 - clamp(Math.abs(cardY) / 980, 0, 0.12);
    const chainX = clamp(cardX * 0.72, -210, 210);
    const chainY = clamp(cardY * 0.16, -18, 54);

    if (distance > 5) dragMoved = true;
    gsap.set(rootRef.value, {
      '--pass-x': `${cardX}px`,
      '--pass-y': `${cardY}px`,
      '--pass-rot': `${clamp(cardX / 19 + cardY / 70, -16, 16)}deg`,
      '--pass-tilt-x': `${clamp(-cardY / 24, -11, 11)}deg`,
      '--pass-tilt-y': `${clamp(cardX / 38, -10, 10)}deg`,
      '--chain-x': `${chainX}px`,
      '--chain-y': `${chainY}px`,
      '--chain-rot': `${clamp(cardX / 18 + cardY / 120, -14, 14)}deg`,
      '--chain-stretch': tension,
    });
    return;
  }

  const rect = passRef.value.getBoundingClientRect();
  const localX = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
  const localY = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
  setVars(
    {
      '--pass-tilt-x': `${clamp(-localY * 8, -5, 5)}deg`,
      '--pass-tilt-y': `${clamp(localX * 10, -6, 6)}deg`,
      '--pass-rot': `${clamp(localX * 2, -1.2, 1.2)}deg`,
    },
    0.22,
  );
}

function finishDrag(event: PointerEvent) {
  if (!pointerStart) return;
  pointerStart = undefined;
  passRef.value?.releasePointerCapture(event.pointerId);
  isDragging.value = false;
  suppressClick = dragMoved;
  resetPose();
}

function handlePointerLeave() {
  if (pointerStart || !canAnimate.value) return;
  resetPose(0.42);
}

function toggleReveal(event?: Event) {
  if (suppressClick) {
    suppressClick = false;
    event?.preventDefault();
    return;
  }
  isRevealed.value = !isRevealed.value;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isRevealed.value) {
    isRevealed.value = false;
  }
}

onMounted(() => {
  playEntrance();
});

onUnmounted(() => {
  activeTween?.kill();
  entranceTween?.kill();
});
</script>

<template>
  <figure
    ref="rootRef"
    class="hero-lanyard"
    :class="{
      'hero-lanyard--motion': canAnimate,
      'hero-lanyard--dragging': isDragging,
      'hero-lanyard--revealed': isRevealed,
      'hero-lanyard--static': !canAnimate,
    }"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
  >
    <div class="hero-lanyard__rig" aria-hidden="true">
      <span class="hero-lanyard__ceiling" />
      <span class="hero-lanyard__chain">
        <span v-for="index in 13" :key="index" />
      </span>
      <span class="hero-lanyard__hook">
        <span />
      </span>
    </div>

    <button
      ref="passRef"
      class="hero-lanyard__pass"
      type="button"
      :aria-label="interactionLabel"
      :aria-pressed="isRevealed"
      @pointerdown="handlePointerDown"
      @pointerup="finishDrag"
      @pointercancel="finishDrag"
      @click="toggleReveal"
      @keydown="handleKeydown"
    >
      <span class="hero-lanyard__back-panel" aria-hidden="true">
        <small>FLIGHT PASS</small>
        <strong>VIBE CODING</strong>
        <span>VUE3 / GSAP / UAV-FPV</span>
      </span>

      <span class="hero-lanyard__shell">
        <span class="hero-lanyard__topline">
          <span>JR</span>
          <small>AI FLIGHT LAB</small>
        </span>
        <img :src="props.imageSrc" :alt="props.alt" draggable="false" />
        <span class="hero-lanyard__shine" aria-hidden="true" />
        <span class="hero-lanyard__identity">
          <strong>{{ props.title }}</strong>
          <span>{{ props.body }}</span>
        </span>
      </span>
    </button>
  </figure>
</template>

<style scoped>
.hero-lanyard {
  --pass-x: 0px;
  --pass-y: 0px;
  --pass-rot: 0deg;
  --pass-tilt-x: 0deg;
  --pass-tilt-y: 0deg;
  --drop-y: 0px;
  --drop-rot: 0deg;
  --drop-opacity: 1;
  --chain-x: 0px;
  --chain-y: 0px;
  --chain-rot: 0deg;
  --chain-stretch: 1;
  position: absolute;
  right: 102px;
  bottom: 0;
  width: min(330px, 78vw);
  margin: 0;
  overflow: visible;
  perspective: 960px;
  transform-style: preserve-3d;
  opacity: var(--drop-opacity);
  transform:
    translate3d(0, var(--drop-y), 0)
    rotateZ(var(--drop-rot));
  transform-origin: 50% -18%;
  z-index: 3;
}

.hero-lanyard__rig {
  position: relative;
  height: 116px;
  transform:
    translate3d(var(--chain-x), var(--chain-y), 0)
    rotateZ(var(--chain-rot))
    scaleY(var(--chain-stretch));
  transform-origin: 50% 0;
  transition: opacity 180ms ease;
  pointer-events: none;
}

.hero-lanyard__ceiling {
  position: absolute;
  top: 0;
  left: 50%;
  width: 184px;
  height: 14px;
  border: 1px solid rgba(202, 226, 224, 0.34);
  border-radius: 999px;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.26), rgba(83, 101, 101, 0.08), rgba(255, 255, 255, 0.18)),
    linear-gradient(180deg, rgba(30, 43, 43, 0.96), rgba(5, 12, 13, 0.92));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 10px 30px rgba(0, 0, 0, 0.34),
    0 0 22px rgba(85, 247, 231, 0.08);
  transform: translateX(-50%);
}

.hero-lanyard__ceiling::before,
.hero-lanyard__ceiling::after {
  position: absolute;
  top: 3px;
  width: 8px;
  height: 8px;
  content: '';
  border: 1px solid rgba(219, 242, 238, 0.22);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.46);
}

.hero-lanyard__ceiling::before {
  left: 16px;
}

.hero-lanyard__ceiling::after {
  right: 16px;
}

.hero-lanyard__chain {
  position: absolute;
  top: 11px;
  left: 50%;
  display: grid;
  width: 32px;
  height: 96px;
  grid-template-rows: repeat(13, 1fr);
  justify-items: center;
  filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.36));
  transform: translateX(-50%);
  transform-origin: 50% 0;
}

.hero-lanyard__chain span {
  display: block;
  width: 13px;
  height: 8px;
  margin-top: -1px;
  border: 1px solid rgba(218, 244, 240, 0.48);
  border-radius: 999px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(92, 255, 239, 0.05) 54%, rgba(0, 0, 0, 0.28)),
    rgba(11, 20, 21, 0.92);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    0 0 12px rgba(85, 247, 231, 0.08);
}

.hero-lanyard__chain span:nth-child(odd) {
  width: 10px;
  height: 14px;
  transform: rotate(0deg);
}

.hero-lanyard__chain span:nth-child(even) {
  transform: rotate(90deg);
}

.hero-lanyard__hook {
  position: absolute;
  left: 50%;
  bottom: -4px;
  display: grid;
  width: 58px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(218, 238, 235, 0.42);
  border-radius: 17px 17px 12px 12px;
  background:
    linear-gradient(115deg, rgba(255, 255, 255, 0.34), rgba(92, 106, 106, 0.16) 48%, rgba(255, 255, 255, 0.12)),
    rgba(20, 28, 29, 0.86);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 14px 28px rgba(0, 0, 0, 0.34);
  transform: translateX(-50%);
}

.hero-lanyard__hook::before {
  position: absolute;
  top: -18px;
  left: 50%;
  width: 22px;
  height: 22px;
  content: '';
  border: 2px solid rgba(214, 238, 235, 0.44);
  border-radius: 50%;
  background: rgba(4, 10, 10, 0.48);
  box-shadow:
    inset 0 0 0 4px rgba(6, 14, 15, 0.76),
    0 0 14px rgba(85, 247, 231, 0.1);
  transform: translateX(-50%);
}

.hero-lanyard__hook span {
  width: 34px;
  height: 9px;
  border: 1px solid rgba(5, 11, 12, 0.64);
  border-radius: 999px;
  background: rgba(5, 12, 13, 0.54);
}

.hero-lanyard__pass {
  position: relative;
  display: block;
  width: 100%;
  margin: -4px 0 0;
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  cursor: grab;
  outline: none;
  transform:
    translate3d(var(--pass-x), var(--pass-y), 0)
    rotateZ(var(--pass-rot))
    rotateX(var(--pass-tilt-x))
    rotateY(var(--pass-tilt-y));
  transform-style: preserve-3d;
  transform-origin: 50% 5%;
  will-change: transform;
}

.hero-lanyard--dragging .hero-lanyard__pass {
  cursor: grabbing;
}

.hero-lanyard__shell,
.hero-lanyard__back-panel {
  position: relative;
  display: block;
  overflow: hidden;
  border: 1px solid rgba(139, 255, 242, 0.32);
  border-radius: 18px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.1), transparent 26%),
    rgba(5, 18, 20, 0.74);
  box-shadow:
    0 30px 90px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 0 42px rgba(85, 247, 231, 0.1);
  clip-path: polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px));
}

.hero-lanyard__shell::before {
  position: absolute;
  inset: 16px;
  z-index: 2;
  content: '';
  border: 1px solid rgba(216, 255, 250, 0.12);
  border-radius: 12px;
  pointer-events: none;
}

.hero-lanyard__back-panel {
  position: absolute;
  inset: 18px 0 auto;
  z-index: 0;
  display: grid;
  min-height: 78%;
  place-items: center;
  padding: 28px;
  color: rgba(237, 255, 252, 0.82);
  text-align: center;
  background:
    radial-gradient(circle at 50% 30%, rgba(85, 247, 231, 0.2), transparent 46%),
    linear-gradient(135deg, rgba(85, 247, 231, 0.1), rgba(255, 198, 92, 0.06)),
    rgba(4, 12, 13, 0.94);
  opacity: 0;
  transform: translate3d(0, 0, -28px) rotateY(-10deg) scale(0.95);
  transition:
    opacity 280ms ease,
    transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.hero-lanyard--revealed .hero-lanyard__back-panel {
  opacity: 1;
  transform: translate3d(24px, -14px, -24px) rotateY(-14deg) rotateZ(1.4deg) scale(0.98);
}

.hero-lanyard__back-panel small,
.hero-lanyard__back-panel span {
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.16em;
}

.hero-lanyard__back-panel strong {
  color: var(--color-accent);
  font-size: clamp(1.6rem, 5vw, 2.25rem);
  letter-spacing: 0.08em;
}

.hero-lanyard__shell {
  z-index: 1;
  transition:
    transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 240ms ease,
    box-shadow 240ms ease;
}

.hero-lanyard__pass:hover .hero-lanyard__shell,
.hero-lanyard__pass:focus-visible .hero-lanyard__shell {
  border-color: rgba(139, 255, 242, 0.56);
  box-shadow:
    0 34px 110px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.07) inset,
    0 0 52px rgba(85, 247, 231, 0.18);
}

.hero-lanyard--revealed .hero-lanyard__shell {
  transform: translate3d(-6px, 3px, 12px) rotateY(7deg);
}

.hero-lanyard__topline {
  position: absolute;
  top: 14px;
  right: 14px;
  left: 14px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(237, 255, 252, 0.78);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.hero-lanyard__topline span {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(139, 255, 242, 0.42);
  border-radius: 50%;
  color: #061615;
  background: var(--color-accent);
  box-shadow: 0 0 24px rgba(85, 247, 231, 0.24);
}

.hero-lanyard__shell img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: center 30%;
  filter: saturate(0.88) contrast(1.1) brightness(0.9);
  user-select: none;
}

.hero-lanyard__shine {
  position: absolute;
  inset: -30% auto -30% -55%;
  z-index: 4;
  width: 42%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: skewX(-17deg) translateX(-120%);
  pointer-events: none;
}

.hero-lanyard__pass:hover .hero-lanyard__shine,
.hero-lanyard__pass:focus-visible .hero-lanyard__shine {
  animation: lanyardShine 1.25s ease forwards;
}

.hero-lanyard__identity {
  position: absolute;
  right: 14px;
  bottom: 14px;
  left: 14px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 62px;
  padding: 12px 14px;
  border: 1px solid rgba(139, 255, 242, 0.2);
  border-radius: 14px;
  background:
    linear-gradient(90deg, rgba(8, 46, 52, 0.84), rgba(5, 12, 14, 0.76)),
    rgba(2, 5, 7, 0.82);
  backdrop-filter: blur(14px);
}

.hero-lanyard__identity::after {
  position: absolute;
  inset: 0;
  content: '';
  border-radius: inherit;
  background: linear-gradient(90deg, transparent, rgba(85, 247, 231, 0.24), transparent);
  opacity: 0;
  transform: translateX(-55%);
}

.hero-lanyard__pass:hover .hero-lanyard__identity::after,
.hero-lanyard__pass:focus-visible .hero-lanyard__identity::after {
  animation: lanyardDataSweep 900ms ease forwards;
}

.hero-lanyard__identity strong {
  color: var(--color-accent);
  font-size: 1.35rem;
  letter-spacing: 0.02em;
}

.hero-lanyard__identity span {
  color: var(--color-muted);
  font-size: 0.78rem;
  line-height: 1.45;
  text-align: right;
}

.hero-lanyard--motion:not(.hero-lanyard--dragging) .hero-lanyard__rig {
  animation: lanyardRigBreath 4.8s ease-in-out infinite;
}

.hero-lanyard--motion:not(.hero-lanyard--dragging):not(.hero-lanyard--revealed) .hero-lanyard__shell {
  animation: lanyardShellFloat 4.8s ease-in-out infinite;
  animation-delay: 90ms;
}

.hero-lanyard--static .hero-lanyard__pass {
  cursor: pointer;
}

.hero-lanyard__pass:focus-visible {
  outline: 2px solid rgba(85, 247, 231, 0.74);
  outline-offset: 8px;
}

@keyframes lanyardShellFloat {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotateZ(-0.35deg);
  }
  50% {
    transform: translate3d(0, 2px, 0) rotateZ(0.35deg);
  }
}

@keyframes lanyardRigBreath {
  0%,
  100% {
    transform:
      translate3d(var(--chain-x), var(--chain-y), 0)
      rotateZ(calc(var(--chain-rot) - 0.35deg))
      scaleY(var(--chain-stretch));
  }
  50% {
    transform:
      translate3d(var(--chain-x), var(--chain-y), 0)
      rotateZ(calc(var(--chain-rot) + 0.35deg))
      scaleY(var(--chain-stretch));
  }
}

@keyframes lanyardShine {
  to {
    transform: skewX(-17deg) translateX(420%);
  }
}

@keyframes lanyardDataSweep {
  0% {
    opacity: 0;
    transform: translateX(-55%);
  }
  34% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(55%);
  }
}

@media (max-width: 1080px) {
  .hero-lanyard {
    right: auto;
    left: 0;
  }
}

@media (max-width: 680px) {
  .hero-lanyard {
    position: relative;
    right: auto;
    bottom: auto;
    left: auto;
    width: min(360px, 100%);
    margin-top: 10px;
  }

  .hero-lanyard__rig {
    height: 88px;
  }

  .hero-lanyard__ceiling {
    width: 138px;
    height: 12px;
  }

  .hero-lanyard__chain {
    width: 28px;
    height: 70px;
    grid-template-rows: repeat(10, 1fr);
  }

  .hero-lanyard__chain span:nth-child(n + 11) {
    display: none;
  }

  .hero-lanyard__hook {
    width: 52px;
    height: 28px;
  }

  .hero-lanyard__identity {
    min-height: 58px;
    padding: 11px 12px;
  }
}

@media (max-width: 390px) {
  .hero-lanyard__identity {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .hero-lanyard__identity span {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-lanyard *,
  .hero-lanyard *::before,
  .hero-lanyard *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
