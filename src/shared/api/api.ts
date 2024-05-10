import NProgress from 'nprogress';
import { Api } from '@/shared/api/generated/Api';

export const $api = new Api();

$api.instance.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

$api.instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (response) => {
    NProgress.done();
    return response;
  },
);
