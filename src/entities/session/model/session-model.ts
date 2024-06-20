import { createEvent, createStore, sample } from 'effector';

export const userAuthorized = createEvent();

export const $isAuthorized = createStore(!!localStorage.getItem('token'));

sample({
  clock: userAuthorized,
  fn: () => true,
  target: $isAuthorized,
});
