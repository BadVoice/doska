import { appMounted } from '@/shared/model';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const userAuthorized = createEvent();

export const $isAuthorized = createStore(false);

const checkIsAuthorizedFx = createEffect(() => {
  const token = localStorage.getItem('token');

  return !!token;
});

sample({
  clock: appMounted,
  target: checkIsAuthorizedFx,
});

sample({
  clock: checkIsAuthorizedFx.doneData,
  target: $isAuthorized,
});

sample({
  clock: userAuthorized,
  fn: () => true,
  target: $isAuthorized,
});
