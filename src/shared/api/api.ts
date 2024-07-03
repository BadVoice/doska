import { Api } from '@/shared/api/generated/Api';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { createEffect, createEvent, sample } from 'effector';
import NProgress from 'nprogress';
import { debounce } from 'patronum';

export const unauthorizedErrorHappened = createEvent();

const requestSended = createEvent();
const responseReceived = createEvent();

const startProgressFx = createEffect(() => {
  NProgress.start();
});
const endProgressFx = createEffect(() => {
  NProgress.done();
});

sample({
  clock: debounce(requestSended, 300),
  target: startProgressFx,
});

sample({
  clock: debounce(responseReceived, 300),
  target: endProgressFx,
});

function handleRequest(config: InternalAxiosRequestConfig<any>) {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  requestSended();
  return config;
}

function handleResponseError(
  response: AxiosResponse<any, any> & { response: { status: number } },
) {
  responseReceived();

  if (response.response.status === 401) {
    unauthorizedErrorHappened();
  }

  return response;
}

function handleResponseFullfilled(response: AxiosResponse<any, any>) {
  responseReceived();

  return response;
}

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
