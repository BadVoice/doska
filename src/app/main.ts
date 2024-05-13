import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './global.css';
import NProgress from 'nprogress';
import VueTheMask from 'vue-the-mask';

NProgress.configure({ showSpinner: false });

// @ts-expect-error seems like bug in VueTheMask types
const app = createApp(App).use(router).use(VueTheMask).mount('#app');
