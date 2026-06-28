export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    const serviceWorkerUrl = `${import.meta.env.BASE_URL}sw.js`;

    navigator.serviceWorker.register(serviceWorkerUrl).catch(() => {
      document.documentElement.dataset.serviceWorker = 'unavailable';
    });
  });
}
