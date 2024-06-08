import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './global.css';
import NProgress from 'nprogress';
import VueTheMask from 'vue-the-mask';

import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

NProgress.configure({ showSpinner: false });

const app = createApp(App);
app.use(router);
app.use(VueVirtualScroller);

// @ts-expect-error seems like bug in VueTheMask types
app.use(VueTheMask);

app.mount('#app');
