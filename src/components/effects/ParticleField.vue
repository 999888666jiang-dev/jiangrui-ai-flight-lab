<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useMotionBudget } from '../../composables/useMotionBudget';

const props = withDefaults(
  defineProps<{
    preset?: 'home' | 'video' | 'vault';
  }>(),
  {
    preset: 'home',
  },
);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const { profile, resolveParticleCount } = useMotionBudget();
let context: CanvasRenderingContext2D | null = null;
let animationFrame = 0;
let lastFrameTime = 0;
let particles: Array<{ x: number; y: number; z: number; vx: number; vy: number; size: number }> = [];
const pointer = { x: 0.62, y: 0.34 };

function getParticleCount() {
  if (props.preset === 'video') {
    return resolveParticleCount({ desktop: 180, compact: 120, mobile: 70, reduced: 36, minimal: 38 });
  }

  if (props.preset === 'vault') {
    return resolveParticleCount({ desktop: 150, compact: 96, mobile: 58, reduced: 32, minimal: 36 });
  }

  return resolveParticleCount({ desktop: 220, compact: 150, mobile: 80, reduced: 36, minimal: 40 });
}

function resetParticles(width: number, height: number) {
  particles = Array.from({ length: getParticleCount() }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    z: Math.random(),
    vx: -0.12 + Math.random() * 0.24,
    vy: -0.08 + Math.random() * 0.16,
    size: 0.5 + Math.random() * 1.8,
  }));
}

function resize() {
  const canvas = canvasRef.value;
  if (!canvas) {
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, profile.value.motion.canvasDpr);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context = canvas.getContext('2d', { willReadFrequently: false });
  context?.setTransform(dpr, 0, 0, dpr, 0, 0);
  resetParticles(window.innerWidth, window.innerHeight);
}

function draw(timestamp = 0) {
  if (!context) {
    return;
  }

  const frameInterval = 1000 / profile.value.motion.canvasFps;
  if (timestamp - lastFrameTime < frameInterval) {
    animationFrame = window.requestAnimationFrame(draw);
    return;
  }
  lastFrameTime = timestamp;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const color = props.preset === 'vault' ? '255,184,91' : '85,247,231';

  context.clearRect(0, 0, width, height);
  context.fillStyle = `rgba(${color}, 0.72)`;
  context.strokeStyle = `rgba(${color}, 0.12)`;

  particles.forEach((particle, index) => {
    const dx = particle.x / width - pointer.x;
    const dy = particle.y / height - pointer.y;
    const force = profile.value.motion.hoverMotion ? Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 0.22) : 0;

    particle.x += particle.vx + dx * force * 2.4;
    particle.y += particle.vy + dy * force * 2.1;

    if (particle.x < -20) particle.x = width + 20;
    if (particle.x > width + 20) particle.x = -20;
    if (particle.y < -20) particle.y = height + 20;
    if (particle.y > height + 20) particle.y = -20;

    context!.globalAlpha = 0.24 + particle.z * 0.76;
    context!.beginPath();
    context!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context!.fill();

    const next = particles[index + 1];
    if (profile.value.motion.scanLines && next && Math.abs(next.x - particle.x) < 86 && Math.abs(next.y - particle.y) < 86) {
      context!.globalAlpha = 0.08;
      context!.beginPath();
      context!.moveTo(particle.x, particle.y);
      context!.lineTo(next.x, next.y);
      context!.stroke();
    }
  });

  context.globalAlpha = 1;
  animationFrame = window.requestAnimationFrame(draw);
}

function updatePointer(event: PointerEvent) {
  if (!profile.value.motion.hoverMotion) return;
  pointer.x = event.clientX / window.innerWidth;
  pointer.y = event.clientY / window.innerHeight;
}

onMounted(() => {
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', updatePointer, { passive: true });
  draw();
});

onUnmounted(() => {
  window.cancelAnimationFrame(animationFrame);
  window.removeEventListener('resize', resize);
  window.removeEventListener('pointermove', updatePointer);
});

watch(
  () => [props.preset, profile.value.deviceTier, profile.value.reducedMotion, profile.value.viewport.width],
  () => resize(),
);
</script>

<template>
  <canvas ref="canvasRef" class="particle-field" aria-hidden="true" />
</template>
