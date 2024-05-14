import NProgress from 'nprogress';
import { Api } from '@/shared/api/generated/Api';

export const $api = new Api({
  baseURL: 'https://virtserver.swaggerhub.com/riderufa/qrq_core/1.0.0',
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
  baseURL: 'https://virtserver.swaggerhub.com/riderufa/qrq_core/1.0.0',
});

$qwepApi.instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  NProgress.start();
  return config;
});

$qwepApi.instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (response) => {
    NProgress.done();
    return response;
  },
);
