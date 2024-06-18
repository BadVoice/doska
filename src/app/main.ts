import { attachLogger } from 'effector-logger';
import NProgress from 'nprogress';
import { createApp } from 'vue';
import VueTheMask from 'vue-the-mask';
import App from './App.vue';
import './global.css';
import router from './router';

import { appMounted } from '@/shared/model';
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

NProgress.configure({ showSpinner: false });

const app = createApp(App);
app.use(router);
app.use(VueVirtualScroller);

const unlogger = attachLogger();
unlogger();

if (import.meta.env.PROD) {
  unlogger();
}

// @ts-expect-error seems like bug in VueTheMask types
app.use(VueTheMask);

app.mount('#app');

appMounted();
