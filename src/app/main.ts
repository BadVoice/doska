import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './global.css';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

const app = createApp(App).use(router).mount('#app');
