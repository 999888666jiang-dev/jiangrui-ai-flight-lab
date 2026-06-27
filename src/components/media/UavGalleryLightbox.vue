<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { pickText, useLanguage } from '../../composables/useLanguage';
import type { UavGalleryImage } from '../../data/uavGalleryManifest';

const props = defineProps<{
  images: UavGalleryImage[];
  modelValue?: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined];
}>();

const { language } = useLanguage();
const lightboxRef = ref<HTMLElement>();
const activeImage = computed(() => (props.modelValue === undefined ? undefined : props.images[props.modelValue]));
const activeIndexLabel = computed(() => {
  if (props.modelValue === undefined) return '';
  return `${String(props.modelValue + 1).padStart(2, '0')} / ${String(props.images.length).padStart(2, '0')}`;
});

function close() {
  emit('update:modelValue', undefined);
}

function go(delta: number) {
  if (props.modelValue === undefined || props.images.length === 0) return;
  emit('update:modelValue', (props.modelValue + delta + props.images.length) % props.images.length);
}

function preloadAround(index: number | undefined) {
  if (index === undefined) return;

  [-1, 0, 1].forEach((offset) => {
    const item = props.images[(index + offset + props.images.length) % props.images.length];
    if (!item) return;
    const image = new Image();
    image.decoding = 'async';
    image.src = item.fullSrc;
  });
}

function handleKeydown(event: KeyboardEvent) {
  if (!activeImage.value) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    close();
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    go(1);
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    go(-1);
  }
}

watch(
  () => props.modelValue,
  async (index) => {
    preloadAround(index);
    if (index !== undefined) {
      await nextTick();
      lightboxRef.value?.focus();
    }
  },
);

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="activeImage" class="uav-lightbox" role="dialog" aria-modal="true" :aria-label="pickText(activeImage.title, language)" @click.self="close">
      <article ref="lightboxRef" class="uav-lightbox__panel" tabindex="-1">
        <button class="uav-lightbox__close" type="button" @click="close">
          {{ language === 'zh' ? '关闭' : 'Close' }}
        </button>
        <button class="uav-lightbox__nav uav-lightbox__nav--prev" type="button" :aria-label="language === 'zh' ? '上一张' : 'Previous image'" @click="go(-1)">
          <span aria-hidden="true" />
        </button>
        <figure class="uav-lightbox__image">
          <img :key="activeImage.id" :src="activeImage.fullSrc" :alt="pickText(activeImage.title, language)" loading="eager" decoding="async" />
        </figure>
        <button class="uav-lightbox__nav uav-lightbox__nav--next" type="button" :aria-label="language === 'zh' ? '下一张' : 'Next image'" @click="go(1)">
          <span aria-hidden="true" />
        </button>
        <aside class="uav-lightbox__meta">
          <small>{{ activeIndexLabel }} / HANGAR IMAGE</small>
          <h3>{{ pickText(activeImage.title, language) }}</h3>
          <p>{{ activeImage.sourceName }} / {{ activeImage.sizeMB }}MB</p>
        </aside>
      </article>
    </div>
  </Teleport>
</template>
