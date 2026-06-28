<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Fog,
  GridHelper,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
  CylinderGeometry,
  PointLight,
} from 'three';
import { useWebGLSupport } from '../../composables/useWebGLSupport';

const hostRef = ref<HTMLDivElement | null>(null);
const { shouldUseThree, supportState, webglPolicy } = useWebGLSupport();
const showFallbackPropeller = computed(() => supportState.value === 'blocked');
let renderer: WebGLRenderer | undefined;
let animationFrame = 0;
let group: Group | undefined;
let scene: Scene | undefined;
let camera: PerspectiveCamera | undefined;
let points: Points | undefined;
let particleBase: Float32Array | undefined;
const pointer = { x: 0, y: 0 };

function bladeShape() {
  const shape = new Shape();
  shape.moveTo(0.18, 0);
  shape.bezierCurveTo(0.52, 0.16, 1.28, 0.2, 2.25, 0.08);
  shape.bezierCurveTo(2.52, 0.04, 2.62, -0.1, 2.42, -0.22);
  shape.bezierCurveTo(1.56, -0.45, 0.72, -0.3, 0.22, -0.08);
  shape.bezierCurveTo(0.14, -0.04, 0.13, -0.02, 0.18, 0);
  return shape;
}

function buildPropeller() {
  const root = new Group();
  const shape = bladeShape();

  for (let index = 0; index < 4; index += 1) {
    const blade = new Group();
    blade.rotation.z = (Math.PI * 2 * index) / 4;

    const body = new Mesh(
      new ShapeGeometry(shape, 40),
      new MeshPhysicalMaterial({
        color: '#8ffff3',
        transparent: true,
        opacity: 0.34,
        roughness: 0.08,
        metalness: 0.05,
        clearcoat: 1,
        side: DoubleSide,
        depthWrite: false,
      }),
    );
    body.position.x = 0.04;
    blade.add(body);

    const wire = new Mesh(
      new ShapeGeometry(shape, 40),
      new MeshBasicMaterial({
        color: index === 1 ? '#d9fff8' : '#49f6e7',
        wireframe: true,
        transparent: true,
        opacity: 0.7,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    wire.position.set(0.04, 0, 0.006);
    blade.add(wire);
    root.add(blade);
  }

  const innerRing = new Mesh(
    new TorusGeometry(0.56, 0.006, 12, 96),
    new MeshBasicMaterial({ color: '#8ffff3', transparent: true, opacity: 0.52, blending: AdditiveBlending }),
  );
  innerRing.rotation.x = Math.PI / 2;
  root.add(innerRing);

  const outerRing = new Mesh(
    new TorusGeometry(0.92, 0.004, 10, 128),
    new MeshBasicMaterial({ color: '#d9fff8', transparent: true, opacity: 0.22, blending: AdditiveBlending }),
  );
  outerRing.rotation.x = Math.PI / 2;
  root.add(outerRing);

  const hub = new Mesh(
    new CylinderGeometry(0.2, 0.28, 0.2, 48),
    new MeshPhysicalMaterial({
      color: '#dffffa',
      transparent: true,
      opacity: 0.58,
      roughness: 0.06,
      metalness: 0.12,
      clearcoat: 1,
      side: DoubleSide,
    }),
  );
  hub.position.z = 0.018;
  root.add(hub);

  const glow = new Mesh(
    new SphereGeometry(0.18, 36, 18),
    new MeshBasicMaterial({ color: '#4fd1c5', transparent: true, opacity: 0.36, blending: AdditiveBlending }),
  );
  glow.position.z = 0.145;
  root.add(glow);

  root.position.set(1.45, 1.1, -0.82);
  root.scale.setScalar(0.74);
  return root;
}

function buildParticles() {
  const count = webglPolicy.value.heroParticles;
  const positions = new Float32Array(count * 3);
  particleBase = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const i = index * 3;
    const radius = 2.2 + Math.random() * 3.2;
    const angle = Math.random() * Math.PI * 2;
    const depth = -2.7 + Math.random() * 3.5;
    particleBase[i] = Math.cos(angle) * radius;
    particleBase[i + 1] = -0.9 + Math.random() * 3.5;
    particleBase[i + 2] = Math.sin(angle) * radius * 0.35 + depth;
    positions[i] = particleBase[i];
    positions[i + 1] = particleBase[i + 1];
    positions[i + 2] = particleBase[i + 2];
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  return new Points(
    geometry,
    new PointsMaterial({ color: '#7de7dc', size: 0.018, transparent: true, opacity: 0.78, sizeAttenuation: true }),
  );
}

function handlePointer(event: PointerEvent) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function resize() {
  const host = hostRef.value;
  if (!host || !renderer || !camera) return;
  const { width, height } = host.getBoundingClientRect();
  camera.aspect = width / Math.max(1, height);
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  if (!renderer || !scene || !camera || !group) return;
  const time = performance.now() * 0.001;
  const scrollProgress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 1.5));

  group.rotation.z = time * (0.38 + scrollProgress * 1.35) + scrollProgress * Math.PI * 1.6;
  group.rotation.x = 0.12 + pointer.y * 0.05 + Math.sin(time * 0.42) * 0.02 + scrollProgress * 0.18;
  group.rotation.y = -0.08 + pointer.x * 0.075 - scrollProgress * 0.22;
  group.position.y = 0.45 + Math.sin(time * 0.55) * 0.12 + scrollProgress * 0.18;

  if (points && particleBase) {
    const attribute = points.geometry.getAttribute('position') as BufferAttribute;
    const positions = attribute.array as Float32Array;
    for (let index = 0; index < positions.length / 3; index += 1) {
      const i = index * 3;
      positions[i] = particleBase[i] + Math.sin(time * 0.34 + index) * 0.025 + pointer.x * 0.05;
      positions[i + 1] = particleBase[i + 1] + Math.cos(time * 0.42 + index) * 0.028 + scrollProgress * 0.28;
      positions[i + 2] = particleBase[i + 2] + Math.sin(time * 0.28 + index * 0.1) * 0.04;
    }
    attribute.needsUpdate = true;
  }

  renderer.render(scene, camera);
  animationFrame = window.requestAnimationFrame(animate);
}

onMounted(() => {
  const host = hostRef.value;

  if (!host || !shouldUseThree.value) {
    return;
  }

  scene = new Scene();
  scene.background = new Color('#05070b');
  scene.fog = new Fog('#05070b', 8, 18);
  camera = new PerspectiveCamera(48, host.clientWidth / Math.max(1, host.clientHeight), 0.1, 100);
  camera.position.set(0, 1.2, 7);

  renderer = new WebGLRenderer({
    antialias: webglPolicy.value.antialias,
    alpha: true,
    powerPreference: webglPolicy.value.antialias ? 'high-performance' : 'low-power',
  });
  renderer.setPixelRatio(webglPolicy.value.pixelRatio);
  host.appendChild(renderer.domElement);

  scene.add(new AmbientLight('#ffffff', 0.7));
  scene.add(new PointLight('#4fd1c5', 5, 20).translateX(3.5).translateY(2.5).translateZ(4));
  scene.add(new PointLight('#79ff8f', 2.2, 20).translateX(-4).translateY(1.2).translateZ(2));

  const floor = new Mesh(new PlaneGeometry(26, 26), new MeshBasicMaterial({ color: '#061013', transparent: true, opacity: 0.82 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -2.15, -1.5);
  scene.add(floor);
  const grid = new GridHelper(26, 52, '#55f7e7', '#123134');
  grid.position.set(0, -2.14, -1.5);
  scene.add(grid);

  group = buildPropeller();
  scene.add(group);
  points = buildParticles();
  scene.add(points);

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', handlePointer, { passive: true });
  animate();
});

onUnmounted(() => {
  window.cancelAnimationFrame(animationFrame);
  window.removeEventListener('resize', resize);
  window.removeEventListener('pointermove', handlePointer);
  renderer?.dispose();
  if (hostRef.value && renderer?.domElement.parentElement === hostRef.value) {
    hostRef.value.removeChild(renderer.domElement);
  }
});
</script>

<template>
  <div ref="hostRef" class="hero-canvas" :class="{ 'hero-canvas--fallback': showFallbackPropeller }" aria-hidden="true">
    <div v-if="showFallbackPropeller" class="hero-fallback-propeller">
      <div class="hero-fallback-propeller__rotor">
        <span class="hero-fallback-propeller__blade" />
        <span class="hero-fallback-propeller__blade" />
        <span class="hero-fallback-propeller__blade" />
        <span class="hero-fallback-propeller__blade" />
        <span class="hero-fallback-propeller__ring hero-fallback-propeller__ring--outer" />
        <span class="hero-fallback-propeller__ring hero-fallback-propeller__ring--inner" />
        <span class="hero-fallback-propeller__hub" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-canvas--fallback {
  display: block;
  overflow: hidden;
}

:global(html[data-runtime-shell='wechat']) .hero-canvas--fallback {
  display: block;
}

.hero-fallback-propeller {
  position: absolute;
  right: clamp(-220px, -13vw, -92px);
  bottom: clamp(34px, 8vh, 110px);
  width: min(620px, 58vw);
  aspect-ratio: 1;
  opacity: 0.68;
  pointer-events: none;
  transform: rotateZ(-14deg);
  transform-origin: 50% 50%;
  will-change: transform;
}

.hero-fallback-propeller__rotor {
  position: absolute;
  inset: 0;
  transform-origin: 50% 50%;
  will-change: transform;
}

.hero-fallback-propeller__rotor::before {
  position: absolute;
  inset: 17%;
  content: '';
  border: 1px dashed rgba(155, 255, 246, 0.22);
  border-radius: 50%;
  box-shadow:
    0 0 64px rgba(85, 247, 231, 0.13),
    inset 0 0 62px rgba(85, 247, 231, 0.08);
}

.hero-fallback-propeller__rotor::after {
  position: absolute;
  top: 50%;
  left: 51%;
  width: 42%;
  height: 3px;
  content: '';
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(245, 255, 253, 0.92), rgba(85, 247, 231, 0.42), transparent 82%);
  box-shadow:
    0 0 18px rgba(85, 247, 231, 0.58),
    0 0 34px rgba(245, 255, 253, 0.26);
  opacity: 0.82;
  transform: translate3d(0, -50%, 0);
}

.hero-fallback-propeller__blade {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 43%;
  height: 13.5%;
  border: 1px solid rgba(205, 255, 250, 0.58);
  border-radius: 78% 14% 78% 16%;
  background:
    linear-gradient(90deg, rgba(85, 247, 231, 0.34), rgba(188, 255, 249, 0.08) 48%, transparent 76%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.14) 0 1px, transparent 1px 24px),
    rgba(7, 36, 40, 0.34);
  box-shadow:
    inset 0 0 28px rgba(85, 247, 231, 0.15),
    0 0 22px rgba(85, 247, 231, 0.2);
  clip-path: polygon(0 44%, 14% 20%, 70% 0, 100% 46%, 74% 100%, 14% 78%, 0 58%);
  transform-origin: 0 50%;
}

.hero-fallback-propeller__blade::after {
  position: absolute;
  inset: 19% 15% 19% 13%;
  content: '';
  border-top: 1px solid rgba(238, 255, 253, 0.36);
  border-bottom: 1px solid rgba(85, 247, 231, 0.2);
  border-radius: inherit;
  transform: skewX(-16deg);
}

.hero-fallback-propeller__blade:nth-child(1) {
  transform: rotate(0deg) translateX(4%);
  border-color: rgba(245, 255, 253, 0.82);
  background:
    linear-gradient(90deg, rgba(226, 255, 252, 0.44), rgba(85, 247, 231, 0.16) 52%, transparent 78%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.18) 0 1px, transparent 1px 24px),
    rgba(7, 36, 40, 0.38);
  box-shadow:
    inset 0 0 32px rgba(226, 255, 252, 0.2),
    0 0 30px rgba(85, 247, 231, 0.28);
}

.hero-fallback-propeller__blade:nth-child(2) {
  transform: rotate(90deg) translateX(4%);
}

.hero-fallback-propeller__blade:nth-child(3) {
  transform: rotate(180deg) translateX(4%);
}

.hero-fallback-propeller__blade:nth-child(4) {
  transform: rotate(270deg) translateX(4%);
}

.hero-fallback-propeller__ring,
.hero-fallback-propeller__hub {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.hero-fallback-propeller__ring--outer {
  width: 31%;
  height: 31%;
  border: 1px solid rgba(220, 255, 251, 0.24);
  box-shadow:
    inset 0 0 34px rgba(85, 247, 231, 0.09),
    0 0 28px rgba(85, 247, 231, 0.12);
}

.hero-fallback-propeller__ring--inner {
  width: 18%;
  height: 18%;
  border: 1px solid rgba(220, 255, 251, 0.4);
  background: rgba(5, 24, 26, 0.26);
}

.hero-fallback-propeller__hub {
  width: 10%;
  height: 10%;
  border: 1px solid rgba(232, 255, 252, 0.46);
  background:
    radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.3), transparent 28%),
    rgba(4, 20, 23, 0.9);
  box-shadow:
    inset 0 0 14px rgba(85, 247, 231, 0.18),
    0 0 28px rgba(85, 247, 231, 0.18);
}

@media (max-width: 680px) {
  .hero-fallback-propeller {
    right: clamp(-198px, -32vw, -118px);
    bottom: clamp(38px, 7.5vh, 112px);
    width: clamp(306px, 94vw, 388px);
    opacity: 0.7;
    transform: rotateZ(-18deg);
  }
}

@media (max-width: 390px) {
  .hero-fallback-propeller {
    right: clamp(-182px, -36vw, -112px);
    bottom: clamp(30px, 6vh, 92px);
    width: clamp(282px, 92vw, 352px);
    opacity: 0.66;
  }
}

@media (min-width: 681px) and (max-width: 1024px) {
  .hero-fallback-propeller {
    right: clamp(-190px, -18vw, -96px);
    bottom: clamp(6px, 3.5vh, 70px);
    width: min(570px, 54vw);
    opacity: 0.66;
  }
}

@media (max-width: 360px) {
  .hero-fallback-propeller {
    right: clamp(-166px, -38vw, -106px);
    bottom: clamp(18px, 4.5vh, 74px);
    width: clamp(254px, 88vw, 318px);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .hero-fallback-propeller {
    animation: fallbackPropellerFloat 8.4s ease-in-out infinite;
  }

  .hero-fallback-propeller__rotor {
    animation: fallbackPropellerSpin 4.8s linear infinite;
  }
}

@keyframes fallbackPropellerFloat {
  0%,
  100% {
    transform: rotateZ(-18deg) translate3d(0, 0, 0);
  }
  50% {
    transform: rotateZ(-15deg) translate3d(4px, -6px, 0);
  }
}

@keyframes fallbackPropellerSpin {
  to {
    transform: rotateZ(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-fallback-propeller,
  .hero-fallback-propeller__rotor {
    animation: none;
  }
}
</style>
