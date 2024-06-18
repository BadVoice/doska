import { Api } from '@/shared/api/generated/Api';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { createEvent } from 'effector';
import NProgress from 'nprogress';

export const unauthorizedErrorHappened = createEvent();

function handleRequest(config: InternalAxiosRequestConfig<any>) {
  if (token) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  NProgress.start();
  return config;
}

function handleResponseError(
  response: AxiosResponse<any, any> & { response: { status: number } },
) {
  NProgress.done();

  if (response.response.status === 401) {
    unauthorizedErrorHappened();
  }

  return response;
}

function handleResponseFullfilled(response: AxiosResponse<any, any>) {
  NProgress.done();
  return response;
}

const token = localStorage.getItem('token');
export const $api = new Api({
  baseURL: '/core/api/v1',
  // baseURL: 'https://virtserver.swaggerhub.com/riderufa/qrq_core/1.0.0',
});
export const $qwepApi = new Api({
  baseURL: '/qwep/api/v1',
  // baseURL: 'https://virtserver.swaggerhub.com/riderufa/qrq_core/1.0.0',
});

$api.instance.interceptors.request.use(handleRequest);

$api.instance.interceptors.response.use(
  handleResponseFullfilled,
  handleResponseError,
);

$qwepApi.instance.interceptors.request.use(handleRequest);

$qwepApi.instance.interceptors.response.use(
  handleResponseFullfilled,
  handleResponseError,
);
