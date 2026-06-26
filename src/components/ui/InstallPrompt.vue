<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useLanguage } from '../../composables/useLanguage';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const { language } = useLanguage();
const installEvent = ref<BeforeInstallPromptEvent>();
const dismissed = ref(false);
const updateReady = ref(false);

function handleBeforeInstallPrompt(event: Event) {
  event.preventDefault();
  installEvent.value = event as BeforeInstallPromptEvent;
}

async function installApp() {
  const event = installEvent.value;
  if (!event) return;

  await event.prompt();
  await event.userChoice;
  installEvent.value = undefined;
}

function dismissPrompt() {
  dismissed.value = true;
}

function reloadForUpdate() {
  window.location.reload();
}

function watchForUpdates(registration: ServiceWorkerRegistration) {
  registration.addEventListener('updatefound', () => {
    const worker = registration.installing;
    if (!worker) return;

    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        updateReady.value = true;
      }
    });
  });
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(watchForUpdates).catch(() => undefined);
  }
});

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});
</script>

<template>
  <aside
    v-if="!dismissed && (installEvent || updateReady)"
    class="install-prompt"
    role="status"
    aria-live="polite"
  >
    <div>
      <small>PWA / FLIGHT SHELL</small>
      <strong>
        {{
          updateReady
            ? (language === 'zh' ? '站点已有新版本' : 'Site update ready')
            : (language === 'zh' ? '安装为桌面应用' : 'Install app')
        }}
      </strong>
    </div>
    <button v-if="updateReady" type="button" @click="reloadForUpdate">
      {{ language === 'zh' ? '刷新' : 'Reload' }}
    </button>
    <button v-else type="button" @click="installApp">
      {{ language === 'zh' ? '安装' : 'Install' }}
    </button>
    <button type="button" aria-label="Dismiss install prompt" @click="dismissPrompt">×</button>
  </aside>
</template>
