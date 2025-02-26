import { AdvertisementPage } from '@/pages/advertisement';
import { MyRequestsPage } from '@/pages/my-requests';
import { OffersPage } from '@/pages/offers';
import { SearchHistory } from '@/widgets/search-history';
import NProgress from 'nprogress';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/advertisements',
      component: AdvertisementPage,
    },
    {
      path: '/',
      component: MyRequestsPage,
    },
    {
      path: '/offers',
      component: OffersPage,
    },
    {
      path: '/search-history',
      component: SearchHistory,
    },
  ],
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
