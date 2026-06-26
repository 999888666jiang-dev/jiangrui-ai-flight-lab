import { createRouter, createWebHashHistory } from 'vue-router';

const HomePage = () => import('../pages/HomePage.vue');
const VideoBayPage = () => import('../pages/VideoBayPage.vue');
const EvidenceVaultPage = () => import('../pages/EvidenceVaultPage.vue');
const ShowcaseDetailPage = () => import('../pages/ShowcaseDetailPage.vue');
const ShowcaseReelPage = () => import('../pages/ShowcaseReelPage.vue');

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/video-bay', name: 'video-bay', component: VideoBayPage },
    { path: '/evidence-vault', name: 'evidence-vault', component: EvidenceVaultPage },
    { path: '/evidence-vault/code-projects', redirect: '/evidence-vault/deal-results-showcase' },
    { path: '/evidence-vault/:slug/reel', name: 'evidence-showcase-reel', component: ShowcaseReelPage },
    { path: '/evidence-vault/:slug', name: 'evidence-showcase', component: ShowcaseDetailPage },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise((resolve) => {
        const scrollToHash = () => resolve({ el: to.hash, top: 112, behavior: 'smooth' });
        window.setTimeout(scrollToHash, window.innerWidth <= 680 ? 260 : 140);
      });
    }

    return { top: 0 };
  },
});
