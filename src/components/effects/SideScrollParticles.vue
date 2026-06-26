<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useMotionBudget } from '../../composables/useMotionBudget';

type Preset = 'home' | 'video' | 'vault';
type Lane = 'left' | 'right';
type ParticleKind = 'dust' | 'spark' | 'node';

const props = withDefaults(
  defineProps<{
    preset?: Preset;
  }>(),
  {
    preset: 'home',
  },
);

type SideParticle = {
  lane: Lane;
  x: number;
  y: number;
  depth: number;
  baseSpeed: number;
  radius: number;
  trail: number;
  phase: number;
  kind: ParticleKind;
};

const canvasRef = ref<HTMLCanvasElement | null>(null);
const { profile, resolveParticleCount } = useMotionBudget();

let context: CanvasRenderingContext2D | null = null;
let animationFrame = 0;
let lastFrameTime = 0;
let particles: SideParticle[] = [];
let width = 0;
let height = 0;
let laneWidth = 0;
let lastScrollY = 0;
let scrollProgress = 0;
let targetVelocity = 0;
let velocity = 0;
let wheelBurst = 0;
let pointerX = 0.5;
let pointerY = 0.5;
let reducedMotion = false;
let compact = false;
let mobile = false;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

function getTheme() {
  if (props.preset === 'video') {
    return {
      primary: '85,247,231',
      secondary: '255,98,98',
      scan: '255,98,98',
      density: 1.14,
      speed: 1.28,
    };
  }

  if (props.preset === 'vault') {
    return {
      primary: '255,184,91',
      secondary: '85,247,231',
      scan: '255,184,91',
      density: 0.92,
      speed: 0.9,
    };
  }

  return {
    primary: '85,247,231',
    secondary: '121,255,143',
    scan: '85,247,231',
    density: 1,
    speed: 1,
  };
}

function getParticleCount() {
  const { density } = getTheme();
  return resolveParticleCount({ desktop: 148, compact: 86, mobile: 40, reduced: 28, minimal: 20 }, density);
}

function randomKind(): ParticleKind {
  const value = Math.random();
  if (value > 0.88) return 'node';
  if (value > 0.64) return 'spark';
  return 'dust';
}

function createParticle(lane: Lane, initial = false): SideParticle {
  const depth = Math.random();
  const inset = Math.pow(Math.random(), 1.45) * laneWidth;
  const edgeBias = 10 + Math.random() * 18;
  const x = lane === 'left' ? edgeBias + inset : width - edgeBias - inset;

  return {
    lane,
    x,
    y: initial ? Math.random() * height : height + 36 + Math.random() * 160,
    depth,
    baseSpeed: 0.16 + depth * 0.54 + Math.random() * 0.2,
    radius: 0.55 + depth * 1.8,
    trail: 8 + depth * 30,
    phase: Math.random() * Math.PI * 2,
    kind: randomKind(),
  };
}

function resetParticles() {
  const count = getParticleCount();
  particles = Array.from({ length: count }, (_, index) => createParticle(index % 2 === 0 ? 'left' : 'right', true));
}

function resize() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const dpr = Math.min(window.devicePixelRatio || 1, profile.value.motion.canvasDpr);
  width = window.innerWidth;
  height = window.innerHeight;
  mobile = width <= 760;
  compact = width <= 1160;
  reducedMotion = profile.value.reducedMotion;
  laneWidth = clamp(width * 0.11, mobile ? 24 : 84, mobile ? 42 : 180);

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context = canvas.getContext('2d', { willReadFrequently: false });
  context?.setTransform(dpr, 0, 0, dpr, 0, 0);
  resetParticles();
}

function updateScrollState() {
  const current = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const delta = current - lastScrollY;

  scrollProgress = clamp(current / max, 0, 1);

  if (!reducedMotion) {
    targetVelocity = clamp(delta / 700, -1, 1);
  }

  lastScrollY = current;
}

function updateWheel(event: WheelEvent) {
  if (reducedMotion) return;
  wheelBurst = clamp(event.deltaY / 520, -1, 1);
}

function updatePointer(event: PointerEvent) {
  if (!profile.value.motion.hoverMotion) return;
  pointerX = event.clientX / Math.max(1, width);
  pointerY = event.clientY / Math.max(1, height);
}

function drawEdgeGlow(theme: ReturnType<typeof getTheme>, energy: number) {
  if (!context) return;

  const leftGlow = context.createLinearGradient(0, 0, laneWidth * 1.55, 0);
  leftGlow.addColorStop(0, `rgba(${theme.primary}, ${0.13 + energy * 0.09})`);
  leftGlow.addColorStop(0.5, `rgba(${theme.secondary}, ${0.045 + energy * 0.05})`);
  leftGlow.addColorStop(1, 'rgba(0,0,0,0)');

  const rightGlow = context.createLinearGradient(width, 0, width - laneWidth * 1.55, 0);
  rightGlow.addColorStop(0, `rgba(${theme.primary}, ${0.13 + energy * 0.09})`);
  rightGlow.addColorStop(0.5, `rgba(${theme.secondary}, ${0.045 + energy * 0.05})`);
  rightGlow.addColorStop(1, 'rgba(0,0,0,0)');

  context.fillStyle = leftGlow;
  context.fillRect(0, 0, laneWidth * 1.55, height);
  context.fillStyle = rightGlow;
  context.fillRect(width - laneWidth * 1.55, 0, laneWidth * 1.55, height);
}

function drawHudTicks(theme: ReturnType<typeof getTheme>, energy: number) {
  if (!context || mobile) return;

  const tickCount = compact ? 10 : 14;
  context.lineWidth = 1;
  context.font = '700 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

  for (let index = 0; index < tickCount; index += 1) {
    const y = ((index + scrollProgress * 5) / tickCount) * height;
    const alpha = 0.12 + energy * 0.18 + (index % 4 === 0 ? 0.08 : 0);
    const length = index % 4 === 0 ? 34 : 18;

    context.strokeStyle = `rgba(${theme.primary}, ${alpha})`;
    context.beginPath();
    context.moveTo(14, y);
    context.lineTo(14 + length, y);
    context.moveTo(width - 14, y);
    context.lineTo(width - 14 - length, y);
    context.stroke();

    if (index % 4 === 0) {
      context.fillStyle = `rgba(${theme.primary}, ${alpha + 0.08})`;
      context.fillText(String(index).padStart(2, '0'), 46, y + 3);
      context.fillText(String(tickCount - index).padStart(2, '0'), width - 62, y + 3);
    }
  }
}

function drawScan(theme: ReturnType<typeof getTheme>, energy: number) {
  if (!context || energy < 0.08 || mobile) return;

  const direction = velocity >= 0 ? -1 : 1;
  const scanY = ((scrollProgress * 1.5 + Math.abs(velocity) * 0.3) % 1) * height;
  const alpha = clamp(energy * 0.38, 0, 0.42);

  context.strokeStyle = `rgba(${theme.scan}, ${alpha})`;
  context.lineWidth = 1.2 + energy * 1.4;

  ['left', 'right'].forEach((lane) => {
    const side = lane as Lane;
    const x = side === 'left' ? laneWidth * 0.62 : width - laneWidth * 0.62;
    context!.beginPath();
    context!.moveTo(x, scanY);
    context!.lineTo(x + (side === 'left' ? 46 : -46), scanY + direction * (72 + energy * 80));
    context!.stroke();
  });
}

function drawParticles(theme: ReturnType<typeof getTheme>, energy: number) {
  if (!context) return;

  const direction = velocity >= 0 ? -1 : 1;
  const pointerNearLeft = pointerX < 0.18;
  const pointerNearRight = pointerX > 0.82;

  particles.forEach((particle) => {
    const pointerBoost =
      (particle.lane === 'left' && pointerNearLeft) || (particle.lane === 'right' && pointerNearRight) ? 1 : 0;
    const drift = Math.sin(particle.phase + scrollProgress * Math.PI * 2) * (1.6 + particle.depth * 3.6);
    const sideDirection = particle.lane === 'left' ? 1 : -1;
    const pullY = pointerBoost ? (pointerY * height - particle.y) * 0.004 : 0;
    const motion = reducedMotion ? 0.22 : (Math.abs(velocity) * 6.2 + Math.abs(wheelBurst) * 3.2) * theme.speed;
    const speed = particle.baseSpeed * theme.speed + motion * (0.24 + particle.depth * 0.48);
    const tail = particle.trail * (0.65 + energy * 2.2);

    particle.y += direction * speed + pullY;
    particle.x += drift * 0.035 + sideDirection * pointerBoost * 0.18;
    particle.phase += 0.007 + particle.depth * 0.006;

    if (direction < 0 && particle.y < -80) {
      Object.assign(particle, createParticle(particle.lane, false), { y: height + 80 + Math.random() * 120 });
    }

    if (direction > 0 && particle.y > height + 80) {
      Object.assign(particle, createParticle(particle.lane, false), { y: -80 - Math.random() * 120 });
    }

    const color = particle.kind === 'node' && props.preset === 'vault' ? theme.secondary : theme.primary;
    const alpha = clamp(0.14 + particle.depth * 0.4 + energy * 0.24 + pointerBoost * 0.18, 0, 0.88);
    const radius = particle.radius * (particle.kind === 'node' ? 1.45 : 1) * (1 + pointerBoost * 0.24);
    const tailEndY = particle.y - direction * tail;
    const tailEndX = particle.x + sideDirection * (6 + particle.depth * 18) * energy;

    context!.strokeStyle = `rgba(${color}, ${alpha * 0.55})`;
    context!.lineWidth = Math.max(0.55, particle.depth * 1.4);
    context!.beginPath();
    context!.moveTo(particle.x, particle.y);
    context!.lineTo(tailEndX, tailEndY);
    context!.stroke();

    context!.fillStyle = `rgba(${color}, ${alpha})`;
    context!.beginPath();
    context!.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
    context!.fill();

    if (particle.kind === 'node') {
      context!.strokeStyle = `rgba(${theme.secondary}, ${alpha * 0.46})`;
      context!.beginPath();
      context!.arc(particle.x, particle.y, radius * 3.2, 0, Math.PI * 2);
      context!.stroke();
    }
  });
}

function draw(timestamp = 0) {
  if (!context) return;

  const frameInterval = 1000 / profile.value.motion.canvasFps;
  if (timestamp - lastFrameTime < frameInterval) {
    animationFrame = window.requestAnimationFrame(draw);
    return;
  }
  lastFrameTime = timestamp;

  const theme = getTheme();
  velocity = reducedMotion ? 0 : lerp(velocity, targetVelocity + wheelBurst * 0.36, 0.08);
  targetVelocity *= 0.82;
  wheelBurst *= 0.88;

  const energy = reducedMotion ? 0 : clamp(Math.abs(velocity) * 2.4 + Math.abs(wheelBurst) * 0.42, 0, 1);

  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = 'source-over';
  drawEdgeGlow(theme, energy);
  context.globalCompositeOperation = profile.value.motion.compositeOperation;
  if (profile.value.motion.scanLines) {
    drawHudTicks(theme, energy);
  }
  drawParticles(theme, energy);
  if (profile.value.motion.scanLines) {
    drawScan(theme, energy);
  }
  context.globalCompositeOperation = 'source-over';

  animationFrame = window.requestAnimationFrame(draw);
}

onMounted(() => {
  lastScrollY = window.scrollY;
  resize();
  updateScrollState();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('wheel', updateWheel, { passive: true });
  window.addEventListener('pointermove', updatePointer, { passive: true });
  draw();
});

onUnmounted(() => {
  window.cancelAnimationFrame(animationFrame);
  window.removeEventListener('resize', resize);
  window.removeEventListener('scroll', updateScrollState);
  window.removeEventListener('wheel', updateWheel);
  window.removeEventListener('pointermove', updatePointer);
});

watch(
  () => [props.preset, profile.value.deviceTier, profile.value.reducedMotion, profile.value.viewport.width],
  () => {
    resize();
  },
);
</script>

<template>
  <canvas ref="canvasRef" class="side-scroll-particles" aria-hidden="true" />
</template>
