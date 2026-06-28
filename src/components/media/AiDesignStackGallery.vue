<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { gsap } from 'gsap';
import { useEnvironment } from '../../composables/useEnvironment';
import { pickText, useLanguage } from '../../composables/useLanguage';
import type { AiDesignWork } from '../../data/aiDesignGalleryManifest';

const props = defineProps<{
  items: AiDesignWork[];
}>();

const { language } = useLanguage();
const { profile } = useEnvironment();
const order = ref<number[]>([]);
const openedIndex = ref<number | undefined>();
const stageRef = ref<HTMLElement>();
const lightboxRef = ref<HTMLElement>();
const dragX = ref(0);
const dragY = ref(0);
const dragRotation = ref(0);
const isDragging = ref(false);
const isExiting = ref(false);
const isHovering = ref(false);
let pointerStart: { x: number; y: number } | undefined;
let pointerMoved = false;
let suppressClickUntil = 0;
let autoTimer: number | undefined;
let releaseTween: gsap.core.Tween | undefined;

const canUseStackMotion = computed(() => {
  const current = profile.value;
  return (
    props.items.length > 1 &&
    !current.reducedMotion &&
    !current.isWeChat &&
    current.deviceTier !== 'minimal'
  );
});

const canDrag = computed(() => {
  const current = profile.value;
  const compactTouch = current.isTouch && current.viewport.width < 1180;
  return canUseStackMotion.value && current.viewport.width >= 860 && !compactTouch;
});

const visibleIndexes = computed(() => order.value.slice(0, Math.min(7, props.items.length)));
const featuredItems = computed(() => {
  const featured = props.items.filter((item) => item.featured);
  return featured.length ? featured.slice(0, 8) : props.items.slice(0, 8);
});
const activeItem = computed(() => props.items[order.value[0]] ?? props.items[0]);
const activeIndexLabel = computed(() => {
  const index = activeItem.value ? props.items.findIndex((item) => item.id === activeItem.value?.id) : 0;
  return `${String(index + 1).padStart(2, '0')} / ${String(props.items.length).padStart(2, '0')}`;
});
const activeCategoryLabel = computed(() => {
  const category = activeItem.value?.category ?? 'archive';
  const zh: Record<string, string> = {
    prototype: '原型',
    visual: '视觉',
    workflow: '流程',
    archive: '归档',
  };
  const en: Record<string, string> = {
    prototype: 'Prototype',
    visual: 'Visual',
    workflow: 'Workflow',
    archive: 'Archive',
  };
  return language.value === 'zh' ? zh[category] : en[category];
});

function resetOrder() {
  order.value = props.items.map((_, index) => index);
}

function cardStyle(stackIndex: number) {
  const baseRotation = [-4, 3, -2, 5, -6, 2, -3][stackIndex] ?? 0;
  const offsetX = stackIndex * 12;
  const offsetY = stackIndex * 10;
  const scale = 1 - stackIndex * 0.035;
  const opacity = 1 - stackIndex * 0.08;

  return {
    zIndex: 20 - stackIndex,
    '--stack-index': stackIndex,
    '--card-x': stackIndex === 0 ? `${dragX.value}px` : `${offsetX}px`,
    '--card-y': stackIndex === 0 ? `${dragY.value}px` : `${offsetY}px`,
    '--card-rotation': `${stackIndex === 0 ? dragRotation.value : baseRotation}deg`,
    '--card-scale': scale,
    '--card-opacity': opacity,
  };
}

function cycleStack(direction = 1) {
  if (order.value.length <= 1) return;
  const next = [...order.value];
  if (direction > 0) {
    const first = next.shift();
    if (first !== undefined) next.push(first);
  } else {
    const last = next.pop();
    if (last !== undefined) next.unshift(last);
  }
  order.value = next;
}

function focusWork(index: number) {
  const next = props.items.map((_, itemIndex) => itemIndex);
  const target = next.indexOf(index);
  if (target > 0) {
    order.value = [...next.slice(target), ...next.slice(0, target)];
  }
}

function releaseToCenter() {
  releaseTween?.kill();
  const state = { x: dragX.value, y: dragY.value, r: dragRotation.value };
  releaseTween = gsap.to(state, {
    x: 0,
    y: 0,
    r: 0,
    duration: 0.42,
    ease: 'elastic.out(1, 0.72)',
    onUpdate: () => {
      dragX.value = state.x;
      dragY.value = state.y;
      dragRotation.value = state.r;
    },
  });
}

function handlePointerDown(event: PointerEvent) {
  if (!canDrag.value || openedIndex.value !== undefined) return;
  pointerStart = { x: event.clientX, y: event.clientY };
  pointerMoved = false;
  isDragging.value = true;
  releaseTween?.kill();
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}

function handlePointerMove(event: PointerEvent) {
  if (!pointerStart || !canDrag.value) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  if (Math.abs(dx) + Math.abs(dy) > 6) pointerMoved = true;
  dragX.value = dx;
  dragY.value = dy;
  dragRotation.value = Math.max(-12, Math.min(12, dx / 18));
}

function handlePointerUp(event: PointerEvent) {
  if (!pointerStart || !canDrag.value) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  const distance = Math.hypot(dx, dy);
  pointerStart = undefined;
  isDragging.value = false;
  (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);

  if (distance > 156) {
    suppressClickUntil = performance.now() + 180;
    isExiting.value = true;
    dragX.value = dx >= 0 ? 420 : -420;
    dragY.value = dy * 0.35;
    dragRotation.value = dx >= 0 ? 18 : -18;
    window.setTimeout(() => {
      cycleStack(1);
      dragX.value = 0;
      dragY.value = 0;
      dragRotation.value = 0;
      isExiting.value = false;
    }, 240);
    return;
  }

  releaseToCenter();
}

function openActive() {
  if (performance.now() < suppressClickUntil) return;
  if (pointerMoved) {
    pointerMoved = false;
    return;
  }
  const index = order.value[0] ?? 0;
  openedIndex.value = index;
}

function openWork(index: number) {
  focusWork(index);
  openedIndex.value = index;
}

function closeLightbox() {
  openedIndex.value = undefined;
}

function moveLightbox(delta: number) {
  if (openedIndex.value === undefined || props.items.length === 0) return;
  const next = (openedIndex.value + delta + props.items.length) % props.items.length;
  openedIndex.value = next;
  focusWork(next);
}

function handleKeydown(event: KeyboardEvent) {
  if (openedIndex.value !== undefined) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeLightbox();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveLightbox(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveLightbox(-1);
    }
    return;
  }

  if (event.key === 'ArrowRight') cycleStack(1);
  if (event.key === 'ArrowLeft') cycleStack(-1);
}

function installAutoplay() {
  if (autoTimer) window.clearInterval(autoTimer);
  autoTimer = window.setInterval(() => {
    if (!canUseStackMotion.value || isHovering.value || isDragging.value || openedIndex.value !== undefined) return;
    cycleStack(1);
  }, 4600);
}

watch(
  () => props.items,
  () => resetOrder(),
  { immediate: true },
);

watch(openedIndex, async (index) => {
  if (index !== undefined) {
    await nextTick();
    lightboxRef.value?.focus();
  }
});

onMounted(() => {
  installAutoplay();
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  if (autoTimer) window.clearInterval(autoTimer);
  releaseTween?.kill();
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <section class="ai-stack-gallery" aria-labelledby="ai-stack-title">
    <header class="ai-stack-gallery__heading">
      <p class="section-code">02 / NEURAL ATELIER STACK</p>
      <h2 id="ai-stack-title">{{ language === 'zh' ? '智能体手稿堆叠台' : 'Neural Atelier Stack' }}</h2>
      <p>
        {{
          language === 'zh'
            ? 'AI 辅助设计、界面草图和交互方案以堆叠卡片呈现；拖动最上层作品可切换，点击可进入聚光灯查看。'
            : 'AI-assisted design, interface drafts, and interaction studies are arranged as a tactile stack. Drag the top work to cycle, or open it in a focused viewer.'
        }}
      </p>
      <div class="ai-stack-gallery__stats" aria-label="AI design gallery summary">
        <span>{{ String(items.length).padStart(2, '0') }} {{ language === 'zh' ? '张作品' : 'works' }}</span>
        <span>{{ canDrag ? 'DRAG STACK' : 'CLICK STACK' }}</span>
        <span>{{ activeCategoryLabel }}</span>
      </div>
    </header>

    <div
      ref="stageRef"
      class="ai-stack-stage"
      :class="{
        'ai-stack-stage--dragging': isDragging,
        'ai-stack-stage--exiting': isExiting,
        'ai-stack-stage--lite': !canDrag,
      }"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <div class="ai-stack-stage__grid" aria-hidden="true">
        <span v-for="dot in 20" :key="dot" />
      </div>

      <div class="ai-stack-stage__deck" aria-label="AI design work stack">
        <button
          v-for="(itemIndex, stackIndex) in visibleIndexes"
          :key="items[itemIndex]?.id"
          class="ai-stack-card"
          :class="{ 'ai-stack-card--top': stackIndex === 0 }"
          type="button"
          :style="cardStyle(stackIndex)"
          :aria-label="`${language === 'zh' ? '打开' : 'Open'} ${pickText(items[itemIndex].title, language)}`"
          @pointerdown="stackIndex === 0 && handlePointerDown($event)"
          @pointermove="stackIndex === 0 && handlePointerMove($event)"
          @pointerup="stackIndex === 0 && handlePointerUp($event)"
          @pointercancel="stackIndex === 0 && handlePointerUp($event)"
          @click="stackIndex === 0 ? openActive() : focusWork(itemIndex)"
        >
          <span class="ai-stack-card__shine" aria-hidden="true" />
          <img
            :src="items[itemIndex].displaySrc"
            :alt="pickText(items[itemIndex].title, language)"
            :loading="stackIndex < 3 ? 'eager' : 'lazy'"
            decoding="async"
            draggable="false"
          />
          <span class="ai-stack-card__meta">
            <small>{{ items[itemIndex].id.toUpperCase() }} / {{ items[itemIndex].sizeMB }}MB</small>
            <strong>{{ pickText(items[itemIndex].title, language) }}</strong>
          </span>
        </button>
      </div>

      <aside v-if="activeItem" class="ai-stack-stage__readout">
        <small>{{ activeIndexLabel }} / ATELIER WORK</small>
        <h3>{{ pickText(activeItem.title, language) }}</h3>
        <p>{{ activeItem.sourceTitle || activeItem.sourceName }}</p>
        <div>
          <button type="button" @click="cycleStack(-1)">{{ language === 'zh' ? '上一张' : 'Prev' }}</button>
          <button type="button" @click="openActive">{{ language === 'zh' ? '聚光查看' : 'Open' }}</button>
          <button type="button" @click="cycleStack(1)">{{ language === 'zh' ? '下一张' : 'Next' }}</button>
        </div>
      </aside>
    </div>

    <div class="ai-stack-rail" aria-label="Featured AI design works">
      <button
        v-for="work in featuredItems"
        :key="work.id"
        type="button"
        :class="{ 'is-active': activeItem?.id === work.id }"
        @click="focusWork(items.findIndex((item) => item.id === work.id))"
        @dblclick="openWork(items.findIndex((item) => item.id === work.id))"
      >
        <img :src="work.thumbSrc" :alt="pickText(work.title, language)" loading="lazy" decoding="async" />
        <span>{{ pickText(work.title, language) }}</span>
      </button>
    </div>

    <Teleport to="body">
      <div v-if="openedIndex !== undefined && items[openedIndex]" class="ai-stack-lightbox" role="dialog" aria-modal="true" :aria-label="pickText(items[openedIndex].title, language)" @click.self="closeLightbox">
        <article ref="lightboxRef" class="ai-stack-lightbox__panel" tabindex="-1">
          <button class="ai-stack-lightbox__close" type="button" @click="closeLightbox">
            {{ language === 'zh' ? '关闭' : 'Close' }}
          </button>
          <button class="ai-stack-lightbox__nav ai-stack-lightbox__nav--prev" type="button" :aria-label="language === 'zh' ? '上一张' : 'Previous work'" @click="moveLightbox(-1)">
            <span aria-hidden="true" />
          </button>
          <figure class="ai-stack-lightbox__image">
            <img :key="items[openedIndex].id" :src="items[openedIndex].fullSrc" :alt="pickText(items[openedIndex].title, language)" loading="eager" decoding="async" />
          </figure>
          <button class="ai-stack-lightbox__nav ai-stack-lightbox__nav--next" type="button" :aria-label="language === 'zh' ? '下一张' : 'Next work'" @click="moveLightbox(1)">
            <span aria-hidden="true" />
          </button>
          <aside class="ai-stack-lightbox__meta">
            <small>{{ String(openedIndex + 1).padStart(2, '0') }} / {{ String(items.length).padStart(2, '0') }} / NEURAL ATELIER</small>
            <h3>{{ pickText(items[openedIndex].title, language) }}</h3>
            <p>{{ items[openedIndex].sourceName }} / {{ items[openedIndex].sizeMB }}MB</p>
          </aside>
        </article>
      </div>
    </Teleport>
  </section>
</template>
