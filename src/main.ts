import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { registerServiceWorker } from './composables/useServiceWorker';
import './styles/index.css';
import './styles/safe-area.css';
import './styles/responsive.css';
import './styles/motion.css';

createApp(App).use(router).mount('#app');
registerServiceWorker();
