<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
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
const hasFinePointer = ref(false);

let pointerStart: { x: number; y: number } | undefined;
let activeTween: gsap.core.Tween | gsap.core.Timeline | undefined;
let entranceTween: gsap.core.Timeline | undefined;
let tetherFrame: number | undefined;

const canAnimate = computed(() => {
  const current = profile.value;
  return !current.reducedMotion && current.deviceTier !== 'minimal';
});

const canDrag = computed(() => {
  const current = profile.value;
  return canAnimate.value && hasFinePointer.value && current.viewport.width >= 700 && !current.isWeChat;
});

const canTouchNudge = computed(() => {
  const current = profile.value;
  return canAnimate.value && current.isTouch && current.viewport.width <= 680 && current.deviceTier !== 'minimal' && !current.isWeChat;
});

const interactionLabel = computed(() =>
  canDrag.value || canTouchNudge.value ? 'Draggable flight pass profile card' : 'Flight pass profile card',
);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function readPointerMode() {
  hasFinePointer.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function updateTetherGeometry() {
  if (!rootRef.value) return;

  const current = profile.value;
  const rect = rootRef.value.getBoundingClientRect();

  if (current.viewport.width <= 680) {
    rootRef.value.style.setProperty('--strap-top-offset', '-34px');
    rootRef.value.style.setProperty('--strap-length', current.viewport.width <= 390 ? '102px' : '106px');
    return;
  }

  const topDistance = Math.max(0, rect.top);
  const anchorDrop = current.viewport.width <= 1080 ? 104 : 118;
  const strapLength = clamp(topDistance + anchorDrop, 178, 860);

  rootRef.value.style.setProperty('--strap-top-offset', `${-topDistance}px`);
  rootRef.value.style.setProperty('--strap-length', `${strapLength}px`);
}

function scheduleTetherUpdate() {
  if (tetherFrame !== undefined) return;
  tetherFrame = window.requestAnimationFrame(() => {
    tetherFrame = undefined;
    readPointerMode();
    updateTetherGeometry();
  });
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
  const canStartDrag = event.pointerType === 'touch' ? canTouchNudge.value : canDrag.value;
  if (!canStartDrag || !passRef.value) return;
  pointerStart = { x: event.clientX, y: event.clientY };
  isDragging.value = true;
  activeTween?.kill();
  try {
    passRef.value.setPointerCapture(event.pointerId);
  } catch {
    // Synthetic mobile QA events may not create an active pointer capture target.
  }
  event.preventDefault();
}

function handlePointerMove(event: PointerEvent) {
  if (!canAnimate.value || !rootRef.value || !passRef.value) return;

  if (pointerStart && (canDrag.value || canTouchNudge.value)) {
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    const compactDrag = profile.value.viewport.width <= 680;
    const cardX = compactDrag ? clamp(dx, -44, 44) : clamp(dx, -280, 280);
    const cardY = compactDrag ? clamp(dy, -58, 82) : clamp(dy, -210, 240);
    const tension = compactDrag
      ? cardY >= 0 ? 1 + clamp(cardY / 640, 0, 0.12) : 1 - clamp(Math.abs(cardY) / 980, 0, 0.06)
      : cardY >= 0 ? 1 + clamp(cardY / 560, 0, 0.34) : 1 - clamp(Math.abs(cardY) / 980, 0, 0.12);
    const chainX = compactDrag ? clamp(cardX * 0.38, -18, 18) : clamp(cardX * 0.72, -210, 210);
    const chainY = compactDrag ? clamp(cardY * 0.1, -7, 12) : clamp(cardY * 0.16, -18, 54);

    event.preventDefault();
    gsap.set(rootRef.value, {
      '--pass-x': `${cardX}px`,
      '--pass-y': `${cardY}px`,
      '--pass-rot': `${compactDrag ? clamp(cardX / 26 + cardY / 120, -5, 5) : clamp(cardX / 19 + cardY / 70, -16, 16)}deg`,
      '--pass-tilt-x': `${compactDrag ? clamp(-cardY / 38, -4, 4) : clamp(-cardY / 24, -11, 11)}deg`,
      '--pass-tilt-y': `${compactDrag ? clamp(cardX / 46, -3, 3) : clamp(cardX / 38, -10, 10)}deg`,
      '--chain-x': `${chainX}px`,
      '--chain-y': `${chainY}px`,
      '--chain-rot': `${compactDrag ? clamp(cardX / 42 + cardY / 180, -3, 3) : clamp(cardX / 18 + cardY / 120, -14, 14)}deg`,
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
  try {
    if (passRef.value?.hasPointerCapture(event.pointerId)) {
      passRef.value.releasePointerCapture(event.pointerId);
    }
  } catch {
    // Ignore stale pointer ids; the pose reset below is the important recovery path.
  }
  isDragging.value = false;
  resetPose();
}

function handlePointerLeave() {
  if (pointerStart || !canAnimate.value) return;
  resetPose(0.42);
}

onMounted(() => {
  nextTick(() => {
    readPointerMode();
    updateTetherGeometry();
    playEntrance();
    window.addEventListener('resize', scheduleTetherUpdate);
    window.addEventListener('scroll', scheduleTetherUpdate, { passive: true });
  });
});

onUnmounted(() => {
  if (tetherFrame !== undefined) {
    window.cancelAnimationFrame(tetherFrame);
  }
  window.removeEventListener('resize', scheduleTetherUpdate);
  window.removeEventListener('scroll', scheduleTetherUpdate);
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
      'hero-lanyard--static': !canAnimate,
      'hero-lanyard--touch-nudge': canTouchNudge,
    }"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
  >
    <div class="hero-lanyard__rig" aria-hidden="true">
      <span class="hero-lanyard__fabric">
        <span v-for="index in 6" :key="index" class="hero-lanyard__fabric-mark">
          <span />
        </span>
      </span>
      <span class="hero-lanyard__ring" />
      <span class="hero-lanyard__cord" />
      <span class="hero-lanyard__pin" />
    </div>

    <div
      ref="passRef"
      class="hero-lanyard__pass"
      role="group"
      :aria-label="interactionLabel"
      @pointerdown="handlePointerDown"
      @pointerup="finishDrag"
      @pointercancel="finishDrag"
    >
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
    </div>
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
  --strap-top-offset: -58px;
  --strap-length: 178px;
  --ring-rise: 27px;
  --cord-drop: 3px;
  --pin-drop: 42px;
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
  height: 142px;
  transform:
    translate3d(var(--chain-x), var(--chain-y), 0)
    rotateZ(var(--chain-rot))
    scaleY(var(--chain-stretch));
  transform-origin: 50% 0;
  transition: opacity 180ms ease;
  pointer-events: none;
}

.hero-lanyard__fabric {
  position: absolute;
  top: var(--strap-top-offset);
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  width: 36px;
  height: var(--strap-length);
  gap: 0;
  padding: 24px 0 34px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0 0 14px 14px;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.06), transparent 18%, transparent 82%, rgba(255, 255, 255, 0.05)),
    repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0 1px, transparent 1px 21px),
    linear-gradient(180deg, #020303, #060708 44%, #010101);
  box-shadow:
    inset 1px 0 0 rgba(255, 255, 255, 0.1),
    inset -1px 0 0 rgba(255, 255, 255, 0.08),
    inset 0 0 18px rgba(0, 0, 0, 0.76),
    0 18px 28px rgba(0, 0, 0, 0.38);
  transform: translateX(-50%);
}

.hero-lanyard__fabric::before,
.hero-lanyard__fabric::after {
  position: absolute;
  top: 0;
  bottom: 0;
  content: '';
  pointer-events: none;
}

.hero-lanyard__fabric::before {
  left: 7px;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.16), transparent);
}

.hero-lanyard__fabric::after {
  right: 7px;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(85, 247, 231, 0.12), transparent);
}

.hero-lanyard__fabric-mark {
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
  opacity: 0.86;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.16));
}

.hero-lanyard__fabric-mark span,
.hero-lanyard__fabric-mark::before,
.hero-lanyard__fabric-mark::after {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 17px;
  height: 5px;
  content: '';
  border-radius: 999px 55% 999px 55%;
  background: rgba(236, 244, 242, 0.92);
  transform-origin: 12% 50%;
}

.hero-lanyard__fabric-mark span {
  transform: translate(-12%, -50%) rotate(0deg);
}

.hero-lanyard__fabric-mark::before {
  transform: translate(-12%, -50%) rotate(120deg);
}

.hero-lanyard__fabric-mark::after {
  transform: translate(-12%, -50%) rotate(240deg);
}

.hero-lanyard__ring {
  position: absolute;
  left: 50%;
  top: calc(var(--strap-top-offset) + var(--strap-length) - var(--ring-rise));
  width: 39px;
  height: 39px;
  border: 2px solid rgba(207, 222, 218, 0.36);
  border-radius: 50%;
  background:
    radial-gradient(circle at 36% 32%, rgba(255, 255, 255, 0.34), transparent 18%),
    rgba(2, 4, 4, 0.62);
  box-shadow:
    inset 0 0 0 5px rgba(0, 0, 0, 0.62),
    0 10px 22px rgba(0, 0, 0, 0.42),
    0 0 14px rgba(85, 247, 231, 0.1);
  transform: translateX(-50%);
}

.hero-lanyard__cord {
  position: absolute;
  left: 50%;
  top: calc(var(--strap-top-offset) + var(--strap-length) + var(--cord-drop));
  width: 8px;
  height: 45px;
  content: '';
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.16), transparent 35%, rgba(0, 0, 0, 0.64)),
    #050505;
  box-shadow:
    inset 0 0 8px rgba(0, 0, 0, 0.72),
    0 9px 16px rgba(0, 0, 0, 0.36);
  transform: translateX(-50%) rotate(5deg);
}

.hero-lanyard__cord::after {
  position: absolute;
  right: -3px;
  bottom: 0;
  width: 10px;
  height: 10px;
  content: '';
  border: 2px solid rgba(4, 6, 6, 0.92);
  border-top-color: transparent;
  border-radius: 50%;
}

.hero-lanyard__pin {
  position: absolute;
  top: calc(var(--strap-top-offset) + var(--strap-length) + var(--pin-drop));
  left: 50%;
  width: 13px;
  height: 13px;
  border: 2px solid rgba(214, 238, 235, 0.22);
  border-radius: 50%;
  background: #020303;
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.18),
    0 0 12px rgba(0, 0, 0, 0.52);
  transform: translateX(-50%);
}

.hero-lanyard__pass {
  position: relative;
  z-index: 2;
  display: block;
  width: 100%;
  margin: -4px 0 0;
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  cursor: grab;
  outline: none;
  touch-action: manipulation;
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

.hero-lanyard__shell {
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

.hero-lanyard__shell {
  z-index: 2;
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

.hero-lanyard--motion:not(.hero-lanyard--dragging) .hero-lanyard__shell {
  animation: lanyardShellFloat 4.8s ease-in-out infinite;
  animation-delay: 90ms;
}

.hero-lanyard--static .hero-lanyard__pass {
  cursor: default;
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
    bottom: auto;
    left: clamp(46px, 16vw, 150px);
    top: -300px;
    width: min(330px, 64vw);
  }
}

@media (max-width: 680px) {
  .hero-lanyard {
    --ring-rise: 24px;
    --cord-drop: 0px;
    --pin-drop: 30px;
    position: relative;
    right: auto;
    bottom: auto;
    left: auto;
    width: clamp(250px, 78vw, 306px);
    margin: 4px auto 0;
  }

  .hero-lanyard__rig {
    height: 96px;
  }

  .hero-lanyard__fabric {
    width: 30px;
    padding: 14px 0 22px;
  }

  .hero-lanyard__fabric-mark {
    width: 15px;
    height: 15px;
  }

  .hero-lanyard__fabric-mark:nth-child(n + 4) {
    display: none;
  }

  .hero-lanyard__ring {
    width: 32px;
    height: 32px;
  }

  .hero-lanyard__cord {
    height: 31px;
  }

  .hero-lanyard__identity {
    min-height: 52px;
    padding: 9px 11px;
  }

  .hero-lanyard__identity strong {
    font-size: 1.08rem;
  }

  .hero-lanyard__identity span {
    font-size: 0.68rem;
  }

  .hero-lanyard--touch-nudge .hero-lanyard__pass {
    touch-action: none;
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

  .hero-lanyard__topline {
    top: 12px;
    right: 12px;
    left: 12px;
    font-size: 0.58rem;
  }

  .hero-lanyard__topline span {
    width: 30px;
    height: 30px;
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
