import { $api } from '@/shared/api';
import { appMounted } from '@/shared/model';
import { createQuery } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';

export const userAuthorized = createEvent();

function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}
export const $isAuthorized = createStore(
  parseJwt(localStorage.getItem('token') ?? '').exp * 1000 >=
    new Date().getTime(),
);

export const getSelf = createQuery({
  handler: async () => (await $api.user.getUser()).data,
});

sample({
  clock: appMounted,
  filter: $isAuthorized,
  target: getSelf.start,
});

sample({
  clock: userAuthorized,
  fn: () => true,
  target: $isAuthorized,
});
