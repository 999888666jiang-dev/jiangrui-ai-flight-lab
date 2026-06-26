<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useMotionBudget } from '../../composables/useMotionBudget';

type Preset = 'home' | 'video' | 'vault';
type ParticleKind = 'trace' | 'node' | 'signal';

const props = withDefaults(
  defineProps<{
    preset?: Preset;
  }>(),
  {
    preset: 'home',
  },
);

type CoreParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
  radius: number;
  phase: number;
  kind: ParticleKind;
  linkRange: number;
  trail: number;
};

type ProtectionRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const PROTECTION_SELECTOR = [
  'h1',
  'h2',
  'h3',
  'p',
  'a',
  'button',
  'img',
  '.system-node',
  '.system-readout',
  '.mission-window',
  '.mission-tab',
  '.cert-card',
  '.qr-card',
  '.vault-card',
  '.vault-feature-grid',
  '.evidence-grid',
  '.vault-slot',
  '.showcase-detail__hero',
  '.showcase-stage',
  '.showcase-panel',
  '.showcase-next',
  '.media-stage',
  '.media-reel-hero',
  '.media-reel-card',
  '.media-lightbox',
  '.contact-panel',
  '.video-bay__copy',
].join(',');

const canvasRef = ref<HTMLCanvasElement | null>(null);
const { profile, resolveParticleCount } = useMotionBudget();
let context: CanvasRenderingContext2D | null = null;
let animationFrame = 0;
let lastFrameTime = 0;
let protectionFrame = 0;
let drawFrame = 0;
let protectionTimers: number[] = [];
let particles: CoreParticle[] = [];
let protectedRects: ProtectionRect[] = [];
let width = 0;
let height = 0;
let pointerX = 0.52;
let pointerY = 0.42;
let pointerActive = false;
let lastScrollY = 0;
let targetVelocity = 0;
let velocity = 0;
let scrollProgress = 0;
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
      density: 0.88,
      speed: 1.22,
      glow: 0.12,
    };
  }

  if (props.preset === 'vault') {
    return {
      primary: '255,184,91',
      secondary: '85,247,231',
      scan: '255,184,91',
      density: 0.82,
      speed: 0.88,
      glow: 0.1,
    };
  }

  return {
    primary: '85,247,231',
    secondary: '121,255,143',
    scan: '85,247,231',
    density: 1,
    speed: 1,
    glow: 0.11,
  };
}

function getParticleCount() {
  const { density } = getTheme();
  return resolveParticleCount({ desktop: 88, compact: 52, mobile: 24, reduced: 18, minimal: 14 }, density);
}

function randomKind(): ParticleKind {
  const value = Math.random();
  if (value > 0.9) return 'signal';
  if (value > 0.68) return 'node';
  return 'trace';
}

function isProtected(x: number, y: number, extra = 0) {
  return protectedRects.some(
    (rect) =>
      x >= rect.x - extra &&
      x <= rect.x + rect.width + extra &&
      y >= rect.y - extra &&
      y <= rect.y + rect.height + extra,
  );
}

function segmentProtected(x1: number, y1: number, x2: number, y2: number, extra = 0) {
  const steps = 7;

  for (let index = 0; index <= steps; index += 1) {
    const progress = index / steps;
    const x = lerp(x1, x2, progress);
    const y = lerp(y1, y2, progress);

    if (isProtected(x, y, extra)) {
      return true;
    }
  }

  return false;
}

function createParticle(initial = false): CoreParticle {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random());
    const spreadX = width * (mobile ? 0.34 : 0.28);
    const spreadY = height * (mobile ? 0.32 : 0.3);
    const centerX = width * (0.5 + (Math.random() - 0.5) * 0.12);
    const centerY = height * (0.48 + (Math.random() - 0.5) * 0.22);
    const x = clamp(centerX + Math.cos(angle) * radius * spreadX, width * 0.14, width * 0.86);
    const y = clamp(centerY + Math.sin(angle) * radius * spreadY, height * 0.12, height * 0.9);

    if (attempt < 7 && isProtected(x, y, 34)) {
      continue;
    }

    const depth = Math.random();
    const drift = 0.08 + depth * 0.22;
    const kind = randomKind();

    return {
      x,
      y: initial ? y : height * (0.18 + Math.random() * 0.68),
      vx: (Math.random() - 0.5) * drift,
      vy: (Math.random() - 0.5) * drift,
      depth,
      radius: 0.48 + depth * (kind === 'node' ? 1.75 : 1.15),
      phase: Math.random() * Math.PI * 2,
      kind,
      linkRange: 48 + depth * 92,
      trail: 7 + depth * 22,
    };
  }

  return {
    x: width * (0.3 + Math.random() * 0.4),
    y: height * (0.2 + Math.random() * 0.6),
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    depth: Math.random(),
    radius: 0.8,
    phase: Math.random() * Math.PI * 2,
    kind: 'trace',
    linkRange: 72,
    trail: 14,
  };
}

function resetParticles() {
  particles = Array.from({ length: getParticleCount() }, () => createParticle(true));
}

function updateProtectedRects() {
  const padding = mobile ? 24 : 34;

  protectedRects = Array.from(document.querySelectorAll<HTMLElement>(PROTECTION_SELECTOR))
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect.width > 1 && rect.height > 1 && rect.bottom > 0 && rect.top < height)
    .map((rect) => ({
      x: rect.left - padding,
      y: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    }));
}

function scheduleProtectionUpdate() {
  if (protectionFrame) return;

  protectionFrame = window.requestAnimationFrame(() => {
    protectionFrame = 0;
    updateProtectedRects();
  });
}

function queueProtectionUpdates() {
  scheduleProtectionUpdate();
  protectionTimers.forEach((timer) => window.clearTimeout(timer));
  protectionTimers = [90, 240, 520].map((delay) => window.setTimeout(scheduleProtectionUpdate, delay));
}

function resize() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const dpr = Math.min(window.devicePixelRatio || 1, profile.value.motion.canvasDpr);
  width = window.innerWidth;
  height = window.innerHeight;
  compact = width <= 980;
  mobile = width <= 680;
  reducedMotion = profile.value.reducedMotion;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context = canvas.getContext('2d', { willReadFrequently: false });
  context?.setTransform(dpr, 0, 0, dpr, 0, 0);

  queueProtectionUpdates();
  resetParticles();
}

function updateScrollState() {
  const current = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const delta = current - lastScrollY;

  scrollProgress = clamp(current / max, 0, 1);
  targetVelocity = reducedMotion ? 0 : clamp(delta / 760, -0.72, 0.72);
  lastScrollY = current;
  queueProtectionUpdates();
}

function updatePointer(event: PointerEvent) {
  if (!profile.value.motion.hoverMotion) return;
  pointerX = event.clientX / Math.max(1, width);
  pointerY = event.clientY / Math.max(1, height);
  pointerActive = true;
}

function leavePointer() {
  pointerActive = false;
}

function drawCoreGlow(theme: ReturnType<typeof getTheme>, energy: number) {
  if (!context || mobile) return;

  const centerX = width * (0.5 + Math.sin(scrollProgress * Math.PI * 1.7) * 0.04);
  const centerY = height * (0.48 + Math.cos(scrollProgress * Math.PI * 1.2) * 0.08);
  const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * 0.36);
  gradient.addColorStop(0, `rgba(${theme.primary}, ${theme.glow + energy * 0.055})`);
  gradient.addColorStop(0.42, `rgba(${theme.secondary}, ${0.035 + energy * 0.035})`);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function repelFromProtection(particle: CoreParticle) {
  protectedRects.forEach((rect) => {
    const nearestX = clamp(particle.x, rect.x, rect.x + rect.width);
    const nearestY = clamp(particle.y, rect.y, rect.y + rect.height);
    const dx = particle.x - nearestX;
    const dy = particle.y - nearestY;
    const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const force = clamp(1 - distance / 82, 0, 1);

    if (force <= 0) return;

    particle.vx += (dx / distance) * force * 0.18;
    particle.vy += (dy / distance) * force * 0.18;
  });
}

function drawParticles(theme: ReturnType<typeof getTheme>, energy: number) {
  if (!context) return;

  const pointerPx = pointerX * width;
  const pointerPy = pointerY * height;
  const centerPullX = width * 0.5;
  const centerPullY = height * 0.48;

  particles.forEach((particle) => {
    const dx = pointerPx - particle.x;
    const dy = pointerPy - particle.y;
    const pointerDistance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const pointerForce = pointerActive && !reducedMotion ? clamp(1 - pointerDistance / 260, 0, 1) : 0;
    const scrollPush = velocity * (0.38 + particle.depth * 0.72);
    const orbit = Math.sin(particle.phase + scrollProgress * Math.PI * 2) * 0.018;

    repelFromProtection(particle);

    particle.vx += ((centerPullX - particle.x) / width) * 0.006 + (dx / pointerDistance) * pointerForce * 0.05;
    particle.vy += ((centerPullY - particle.y) / height) * 0.006 + (dy / pointerDistance) * pointerForce * 0.05 - scrollPush;
    particle.vx += Math.cos(particle.phase) * orbit;
    particle.vy += Math.sin(particle.phase) * orbit;
    particle.vx *= 0.988;
    particle.vy *= 0.988;
    particle.x += particle.vx * (reducedMotion ? 0.3 : 1);
    particle.y += particle.vy * (reducedMotion ? 0.3 : 1);
    particle.phase += 0.006 + particle.depth * 0.007;

    if (
      particle.x < width * 0.08 ||
      particle.x > width * 0.92 ||
      particle.y < height * 0.04 ||
      particle.y > height * 0.96
    ) {
      Object.assign(particle, createParticle(false));
    }

    if (isProtected(particle.x, particle.y, 6)) {
      return;
    }

    const color = particle.kind === 'signal' && props.preset === 'vault' ? theme.secondary : theme.primary;
    const alpha = clamp(0.14 + particle.depth * 0.38 + energy * 0.12 + pointerForce * 0.14, 0, 0.62);
    const radius = particle.radius * (particle.kind === 'node' ? 1.18 : 1);
    const tail = particle.trail * (0.58 + energy * 1.25);
    const tailEndX = particle.x - particle.vx * tail;
    const tailEndY = particle.y - particle.vy * tail;
    const tailMidX = (particle.x + tailEndX) / 2;
    const tailMidY = (particle.y + tailEndY) / 2;
    const tailProtected =
      isProtected(tailEndX, tailEndY, 14) ||
      isProtected(tailMidX, tailMidY, 18) ||
      isProtected(particle.x, particle.y, 8) ||
      segmentProtected(particle.x, particle.y, tailEndX, tailEndY, 18);

    if (!reducedMotion && !tailProtected && (Math.abs(velocity) > 0.02 || pointerForce > 0.1)) {
      context!.strokeStyle = `rgba(${color}, ${alpha * 0.42})`;
      context!.lineWidth = Math.max(0.45, particle.depth * 0.9);
      context!.beginPath();
      context!.moveTo(particle.x, particle.y);
      context!.lineTo(tailEndX, tailEndY);
      context!.stroke();
    }

    context!.fillStyle = `rgba(${color}, ${alpha})`;
    context!.beginPath();
    context!.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
    context!.fill();

    if (particle.kind === 'node') {
      context!.strokeStyle = `rgba(${theme.secondary}, ${alpha * 0.32})`;
      context!.beginPath();
      context!.arc(particle.x, particle.y, radius * 3.8, 0, Math.PI * 2);
      context!.stroke();
    }
  });
}

function drawLinks(theme: ReturnType<typeof getTheme>, energy: number) {
  if (!context || mobile) return;

  const maxLinks = compact ? 18 : 34;
  let drawn = 0;

  for (let index = 0; index < particles.length && drawn < maxLinks; index += 1) {
    const first = particles[index];
    if (isProtected(first.x, first.y, 10)) continue;

    for (let nextIndex = index + 1; nextIndex < particles.length && drawn < maxLinks; nextIndex += 1) {
      const second = particles[nextIndex];
      const dx = first.x - second.x;
      const dy = first.y - second.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const midpointX = (first.x + second.x) / 2;
      const midpointY = (first.y + second.y) / 2;
      const range = Math.min(first.linkRange, second.linkRange);

      if (
        distance > range ||
        isProtected(second.x, second.y, 10) ||
        isProtected(midpointX, midpointY, 16) ||
        segmentProtected(first.x, first.y, second.x, second.y, 18)
      ) {
        continue;
      }

      const alpha = clamp((1 - distance / range) * (0.13 + energy * 0.08), 0, 0.18);
      context.strokeStyle = `rgba(${theme.primary}, ${alpha})`;
      context.lineWidth = 0.65;
      context.beginPath();
      context.moveTo(first.x, first.y);
      context.lineTo(second.x, second.y);
      context.stroke();
      drawn += 1;
    }
  }
}

function drawOrbits(theme: ReturnType<typeof getTheme>, energy: number) {
  if (!context || mobile) return;

  const centerX = width * (0.5 + Math.sin(scrollProgress * Math.PI * 1.2) * 0.035);
  const centerY = height * (0.5 + Math.cos(scrollProgress * Math.PI * 1.6) * 0.055);
  const baseRadius = Math.min(width, height) * (compact ? 0.16 : 0.2);
  const alpha = 0.045 + energy * 0.04;

  context.strokeStyle = `rgba(${theme.secondary}, ${alpha})`;
  context.lineWidth = 1;

  for (let index = 0; index < 3; index += 1) {
    const radiusX = baseRadius * (1 + index * 0.24);
    const radiusY = baseRadius * (0.48 + index * 0.08);
    const start = scrollProgress * Math.PI * 2 + index * 0.9;
    const end = start + Math.PI * (0.58 + energy * 0.35);

    context.save();
    context.translate(centerX, centerY);
    context.rotate(-0.5 + index * 0.42);
    context.beginPath();
    context.ellipse(0, 0, radiusX, radiusY, 0, start, end);
    context.stroke();
    context.restore();
  }
}

function drawScan(theme: ReturnType<typeof getTheme>, energy: number) {
  if (!context || reducedMotion || energy < 0.06 || mobile) return;

  const y = ((scrollProgress * 1.2 + Math.abs(velocity) * 0.4) % 1) * height;
  const gradient = context.createLinearGradient(width * 0.22, y, width * 0.78, y);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(0.48, `rgba(${theme.scan}, ${0.08 + energy * 0.1})`);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  context.strokeStyle = gradient;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(width * 0.22, y);
  context.lineTo(width * 0.78, y + velocity * 48);
  context.stroke();
}

function draw(timestamp = 0) {
  if (!context) return;

  const frameInterval = 1000 / profile.value.motion.canvasFps;
  if (timestamp - lastFrameTime < frameInterval) {
    animationFrame = window.requestAnimationFrame(draw);
    return;
  }
  lastFrameTime = timestamp;

  drawFrame += 1;
  if (drawFrame % 90 === 0) {
    scheduleProtectionUpdate();
  }

  const theme = getTheme();
  velocity = reducedMotion ? 0 : lerp(velocity, targetVelocity, 0.08);
  targetVelocity *= 0.86;
  const energy = reducedMotion ? 0 : clamp(Math.abs(velocity) * 2.2, 0, 1);

  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = 'source-over';
  drawCoreGlow(theme, energy);
  context.globalCompositeOperation = profile.value.motion.compositeOperation;
  if (profile.value.motion.scanLines) {
    drawOrbits(theme, energy);
    drawLinks(theme, energy);
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
  window.addEventListener('pointermove', updatePointer, { passive: true });
  window.addEventListener('pointerleave', leavePointer, { passive: true });
  draw();
});

onUnmounted(() => {
  window.cancelAnimationFrame(animationFrame);
  if (protectionFrame) {
    window.cancelAnimationFrame(protectionFrame);
  }
  protectionTimers.forEach((timer) => window.clearTimeout(timer));
  window.removeEventListener('resize', resize);
  window.removeEventListener('scroll', updateScrollState);
  window.removeEventListener('pointermove', updatePointer);
  window.removeEventListener('pointerleave', leavePointer);
});

watch(
  () => [props.preset, profile.value.deviceTier, profile.value.reducedMotion, profile.value.viewport.width],
  () => {
    resize();
    queueProtectionUpdates();
  },
);
</script>

<template>
  <canvas ref="canvasRef" class="core-motion-particles" aria-hidden="true" />
</template>
