<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { gsap } from 'gsap';
import { useEnvironment } from '../../composables/useEnvironment';
import { pickText, useLanguage } from '../../composables/useLanguage';
import type { UavGalleryImage } from '../../data/uavGalleryManifest';
import UavGalleryLightbox from './UavGalleryLightbox.vue';

const props = defineProps<{
  images: UavGalleryImage[];
}>();

const { language } = useLanguage();
const { profile } = useEnvironment();
const rotX = ref(-4);
const rotY = ref(0);
const selectedIndex = ref(0);
const openedIndex = ref<number | undefined>();
const stageRef = ref<HTMLElement>();
const sphereRef = ref<HTMLElement>();
let pointerStart: { x: number; y: number; rotX: number; rotY: number } | undefined;
let moved = false;
let lastDragAt = 0;
let inertiaTween: gsap.core.Tween | undefined;

const canUseDome = computed(() => {
  const current = profile.value;
  const compactTouch = current.isTouch && current.viewport.width < 1180;
  return (
    props.images.length > 0 &&
    current.viewport.width >= 980 &&
    !compactTouch &&
    !current.isWeChat &&
    !current.reducedMotion &&
    current.deviceTier !== 'low' &&
    current.deviceTier !== 'minimal'
  );
});

const featuredImages = computed(() => {
  const featured = props.images.filter((image) => image.featured);
  return featured.length ? featured.slice(0, 8) : props.images.slice(0, 8);
});
const activeImage = computed(() => props.images[selectedIndex.value] ?? props.images[0]);
const imageCountLabel = computed(() => String(props.images.length).padStart(2, '0'));

const domeItems = computed(() => {
  const columns = Math.ceil(props.images.length / 3);
  const rings = [-17, 0, 17];

  return props.images.map((image, index) => {
    const column = index % columns;
    const ring = Math.floor(index / columns);
    const rotateY = (column / columns) * 360;
    const rotateX = rings[ring] ?? 0;
    const featured = image.featured || index < 6;

    return {
      image,
      index,
      rotateY,
      rotateX,
      featured,
      style: {
        '--tile-rot-y': `${rotateY}deg`,
        '--tile-rot-x': `${rotateX}deg`,
        '--tile-delay': `${index * 22}ms`,
      },
    };
  });
});

const sphereStyle = computed(() => ({
  transform: `translateZ(calc(var(--uav-dome-radius) * -1)) rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)`,
}));

function normalizeSignedAngle(value: number) {
  const normalized = ((((value + 180) % 360) + 360) % 360) - 180;
  return normalized;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function updateSelectedIndex() {
  if (!props.images.length || !canUseDome.value) return;

  let nextIndex = selectedIndex.value;
  let nextDistance = Number.POSITIVE_INFINITY;
  domeItems.value.forEach((item) => {
    const yDistance = Math.abs(normalizeSignedAngle(item.rotateY + rotY.value));
    const xDistance = Math.abs(item.rotateX + rotX.value);
    const distance = yDistance + xDistance * 1.3;
    if (distance < nextDistance) {
      nextDistance = distance;
      nextIndex = item.index;
    }
  });
  selectedIndex.value = nextIndex;
}

function handlePointerDown(event: PointerEvent) {
  if (!canUseDome.value) return;
  pointerStart = { x: event.clientX, y: event.clientY, rotX: rotX.value, rotY: rotY.value };
  moved = false;
  inertiaTween?.kill();
  stageRef.value?.setPointerCapture(event.pointerId);
}

function handlePointerMove(event: PointerEvent) {
  if (!pointerStart || !canUseDome.value) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;

  rotY.value = pointerStart.rotY + dx / 4.8;
  rotX.value = clamp(pointerStart.rotX - dy / 12, -20, 20);
  updateSelectedIndex();
}

function handlePointerUp(event: PointerEvent) {
  if (!pointerStart || !canUseDome.value) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  pointerStart = undefined;
  stageRef.value?.releasePointerCapture(event.pointerId);

  if (moved) {
    lastDragAt = performance.now();
    const target = {
      x: rotX.value,
      y: rotY.value,
    };
    inertiaTween = gsap.to(target, {
      x: clamp(rotX.value - dy / 28, -20, 20),
      y: rotY.value + dx / 8,
      duration: 1.1,
      ease: 'power3.out',
      onUpdate: () => {
        rotX.value = target.x;
        rotY.value = target.y;
        updateSelectedIndex();
      },
    });
  }
}

function focusTile(index: number) {
  if (!canUseDome.value) {
    selectedIndex.value = index;
    return;
  }

  const target = domeItems.value.find((item) => item.index === index);
  if (!target) return;

  const tweenState = {
    x: rotX.value,
    y: rotY.value,
  };
  inertiaTween?.kill();
  gsap.to(tweenState, {
    x: clamp(-target.rotateX, -20, 20),
    y: -target.rotateY,
    duration: 0.62,
    ease: 'power3.out',
    onUpdate: () => {
      rotX.value = tweenState.x;
      rotY.value = tweenState.y;
      updateSelectedIndex();
    },
    onComplete: () => {
      selectedIndex.value = index;
    },
  });
}

function openImage(index: number) {
  if (performance.now() - lastDragAt < 130) return;
  selectedIndex.value = index;
  openedIndex.value = index;
}

watch(canUseDome, (enabled) => {
  if (enabled) {
    updateSelectedIndex();
  }
});

onMounted(() => {
  updateSelectedIndex();
});

onUnmounted(() => {
  inertiaTween?.kill();
});
</script>

<template>
  <section class="uav-hangar" aria-labelledby="uav-hangar-title">
    <header class="uav-hangar__heading">
      <p class="section-code">03 / HANGAR DOME</p>
      <h2 id="uav-hangar-title">{{ language === 'zh' ? '空域机库穹顶' : 'UAV Hangar Dome' }}</h2>
      <p>
        {{
          language === 'zh'
            ? '真实飞行、地面准备、平台装备和航拍环境被整理成一个可拖拽的机库穹顶。视频素材本轮不接入，只展示图片档案。'
            : 'Real flight scenes, field setup, platforms, and aerial environments are arranged into a draggable hangar dome. This pass displays images only.'
        }}
      </p>
      <div class="uav-hangar__stats" aria-label="UAV gallery summary">
        <span>{{ imageCountLabel }} {{ language === 'zh' ? '张图片' : 'images' }}</span>
        <span>{{ language === 'zh' ? '视频已忽略' : 'videos ignored' }}</span>
        <span>{{ canUseDome ? 'DOME 3D' : 'LITE GRID' }}</span>
      </div>
    </header>

    <div
      ref="stageRef"
      class="uav-hangar__stage"
      :class="{ 'uav-hangar__stage--lite': !canUseDome }"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
    >
      <div class="uav-hangar__hud" aria-hidden="true">
        <span>PLATFORM ARCHIVE</span>
        <span>{{ imageCountLabel }} FRAMES</span>
      </div>

      <template v-if="canUseDome">
        <div class="uav-dome">
          <div ref="sphereRef" class="uav-dome__sphere" :style="sphereStyle">
            <button
              v-for="item in domeItems"
              :key="item.image.id"
              class="uav-dome__tile"
              :class="{ 'uav-dome__tile--active': selectedIndex === item.index, 'uav-dome__tile--featured': item.featured }"
              type="button"
              :style="item.style"
              :aria-label="`${language === 'zh' ? '查看' : 'Open'} ${pickText(item.image.title, language)}`"
              @pointerenter="focusTile(item.index)"
              @focus="focusTile(item.index)"
              @click="openImage(item.index)"
            >
              <img :src="item.image.displaySrc" :alt="pickText(item.image.title, language)" :loading="item.index < 8 ? 'eager' : 'lazy'" decoding="async" draggable="false" />
            </button>
          </div>
        </div>

        <aside v-if="activeImage" class="uav-hangar__focus">
          <small>{{ activeImage.id.toUpperCase() }} / {{ activeImage.sizeMB }}MB</small>
          <h3>{{ pickText(activeImage.title, language) }}</h3>
          <p>{{ activeImage.sourceName }}</p>
          <button type="button" @click="openImage(selectedIndex)">
            {{ language === 'zh' ? '打开高清图像' : 'Open high-res image' }}
          </button>
        </aside>
      </template>

      <template v-else>
        <div class="uav-lite-rail" aria-label="Featured UAV images">
          <button v-for="(image, index) in featuredImages" :key="image.id" type="button" @click="openImage(index)">
            <img :src="image.displaySrc" :alt="pickText(image.title, language)" loading="eager" decoding="async" />
            <span>{{ pickText(image.title, language) }}</span>
          </button>
        </div>
      </template>
    </div>

    <div class="uav-gallery-grid" aria-label="All UAV gallery images">
      <button v-for="(image, index) in images" :key="image.id" type="button" class="uav-gallery-grid__item" @click="openImage(index)">
        <img :src="image.thumbSrc" :alt="pickText(image.title, language)" :loading="index < 10 ? 'eager' : 'lazy'" decoding="async" />
        <span>{{ pickText(image.title, language) }}</span>
      </button>
    </div>

    <UavGalleryLightbox v-model="openedIndex" :images="images" />
  </section>
</template>
