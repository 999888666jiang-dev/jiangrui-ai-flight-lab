<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useLanguage } from '../../composables/useLanguage';
import { certificateGalleryItems, type CertificateGalleryItem } from '../../data/certificatesManifest';

const { language } = useLanguage();
const selectedCertificate = ref<CertificateGalleryItem>();
const selectedPageIndex = ref(0);
const readerRef = ref<HTMLElement>();
const lastTrigger = ref<HTMLElement>();

const certificates = computed(() => certificateGalleryItems);
const selectedPage = computed(() => selectedCertificate.value?.pages[selectedPageIndex.value]);
const selectedPageLabel = computed(() => {
  const item = selectedCertificate.value;
  if (!item) return '';
  return `${selectedPageIndex.value + 1} / ${item.pageCount}`;
});

const introCopy = computed(() =>
  language.value === 'zh'
    ? {
        eyebrow: '06 / CERTIFICATE BOOK',
        title: '证书与荣誉装订册',
        body: '所有证书从资源包 PDF 渲染为图片展示，不提供 PDF 下载。点击任意证书，像翻开一本薄册一样查看清晰页面。',
        empty: '证书册正在等待装订。把 PDF 放入资源包后运行生成脚本即可自动出现。',
        open: '打开证书',
        close: '关闭',
        prev: '上一页',
        next: '下一页',
        pages: '页',
        files: '份证书',
      }
    : {
        eyebrow: '06 / CERTIFICATE BOOK',
        title: 'Bound Certificates',
        body: 'PDF certificates are rendered into images for display only. Open any volume to review the pages without exposing PDF downloads.',
        empty: 'The certificate book is waiting for source PDFs.',
        open: 'Open certificate',
        close: 'Close',
        prev: 'Previous page',
        next: 'Next page',
        pages: 'pages',
        files: 'certificates',
      },
);

const preloadedPages = new Set<string>();

function preloadCertificatePages(item: CertificateGalleryItem) {
  item.pages.forEach((src) => {
    if (preloadedPages.has(src)) return;
    preloadedPages.add(src);

    const image = new Image();
    image.decoding = 'async';
    image.src = src;
  });
}

function openCertificate(item: CertificateGalleryItem, event: MouseEvent | KeyboardEvent) {
  preloadCertificatePages(item);
  selectedCertificate.value = item;
  selectedPageIndex.value = 0;
  lastTrigger.value = event.currentTarget as HTMLElement;
  void nextTick(() => readerRef.value?.focus());
}

function closeCertificate() {
  selectedCertificate.value = undefined;
  selectedPageIndex.value = 0;
  void nextTick(() => lastTrigger.value?.focus());
}

function nextPage() {
  const item = selectedCertificate.value;
  if (!item) return;
  selectedPageIndex.value = Math.min(item.pageCount - 1, selectedPageIndex.value + 1);
}

function previousPage() {
  selectedPageIndex.value = Math.max(0, selectedPageIndex.value - 1);
}

function handleKeydown(event: KeyboardEvent) {
  if (!selectedCertificate.value) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeCertificate();
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    nextPage();
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    previousPage();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <section class="certificate-book-gallery" aria-labelledby="certificate-book-title">
    <div class="certificate-book-gallery__heading">
      <p class="section-code">{{ introCopy.eyebrow }}</p>
      <h2 id="certificate-book-title">{{ introCopy.title }}</h2>
      <p>{{ introCopy.body }}</p>
      <div class="certificate-book-gallery__stats" aria-label="Certificate gallery summary">
        <span>{{ certificates.length }} {{ introCopy.files }}</span>
        <span>{{ certificates.reduce((total, item) => total + item.pageCount, 0) }} {{ introCopy.pages }}</span>
      </div>
    </div>

    <div v-if="certificates.length" class="certificate-shelf">
      <button
        v-for="(item, index) in certificates"
        :key="item.id"
        class="certificate-book"
        type="button"
        :style="{ '--book-index': index }"
        :aria-label="`${introCopy.open}: ${item.title}`"
        @click="openCertificate(item, $event)"
        @keydown.enter="openCertificate(item, $event)"
        @keydown.space.prevent="openCertificate(item, $event)"
      >
        <span class="certificate-book__spine" aria-hidden="true">
          <strong>{{ String(index + 1).padStart(2, '0') }}</strong>
        </span>
        <span class="certificate-book__cover">
          <span class="certificate-book__paper">
            <img :src="item.cover" :alt="item.title" :loading="index < 4 ? 'eager' : 'lazy'" decoding="async" />
          </span>
          <span class="certificate-book__seal" aria-hidden="true">JR</span>
        </span>
        <span class="certificate-book__meta">
          <small>{{ item.pageCount }} {{ introCopy.pages }} / {{ item.sizeKB }}KB</small>
          <strong>{{ item.title }}</strong>
        </span>
      </button>
    </div>

    <div v-else class="certificate-book-gallery__empty">
      <span aria-hidden="true" />
      <p>{{ introCopy.empty }}</p>
    </div>

    <Teleport to="body">
      <div v-if="selectedCertificate" class="certificate-reader" role="dialog" aria-modal="true" :aria-label="selectedCertificate.title" @click.self="closeCertificate">
        <article ref="readerRef" class="certificate-reader__book" tabindex="-1">
          <button class="certificate-reader__close" type="button" @click="closeCertificate">
            {{ introCopy.close }}
          </button>
          <div class="certificate-reader__page">
            <div class="certificate-reader__sheet">
              <img v-if="selectedPage" :key="selectedPage" :src="selectedPage" :alt="selectedCertificate.title" loading="eager" decoding="async" />
            </div>
          </div>
          <aside class="certificate-reader__meta">
            <small>{{ selectedCertificate.id.toUpperCase() }} / {{ selectedPageLabel }}</small>
            <h3>{{ selectedCertificate.title }}</h3>
            <p>{{ selectedCertificate.sourceName }}</p>
            <div v-if="selectedCertificate.pageCount > 1" class="certificate-reader__controls">
              <button type="button" :disabled="selectedPageIndex === 0" @click="previousPage">
                {{ introCopy.prev }}
              </button>
              <button type="button" :disabled="selectedPageIndex >= selectedCertificate.pageCount - 1" @click="nextPage">
                {{ introCopy.next }}
              </button>
            </div>
          </aside>
        </article>
      </div>
    </Teleport>
  </section>
</template>
