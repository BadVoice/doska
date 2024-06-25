import { $api } from '@/shared/api';
import { appMounted } from '@/shared/model';
import { createQuery } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';

export const userAuthorized = createEvent();

export const $isAuthorized = createStore(!!localStorage.getItem('token'));

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
