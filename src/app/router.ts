import { createRouter, createWebHistory } from 'vue-router';
import { AdvertisementPage } from '@/pages/advertisement';
import { MyRequestsPage } from '@/pages/my-requests';
import { SearchHistory } from '@/widgets/search-history';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/advertisements',
      name: 'advertisements',
      component: AdvertisementPage,
    },
    {
      path: '/',
      name: 'home_reqeusts',
      component: MyRequestsPage,
    },
    {
      path: '/search-history',
      name: 'search-history',
      component: SearchHistory,
    }
  ],
});
export default router;
