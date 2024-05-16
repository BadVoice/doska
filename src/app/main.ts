import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './global.css';
import NProgress from 'nprogress';
import VueTheMask from 'vue-the-mask';

NProgress.configure({ showSpinner: false });

const app = createApp(App);
app.use(router);
// @ts-expect-error seems like bug in VueTheMask types
app.use(VueTheMask);

app.mount('#app');