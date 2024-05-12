import NProgress from 'nprogress';
import { Api } from '@/shared/api/generated/Api';

export const $api = new Api({
  baseURL: '/core/api/v1',
});

$api.instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
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

export const $qwepApi = new Api({
  baseURL: '/qwep/api/v1',
});

$api.instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
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
