import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

export const createBidVisibilityChanged = createEvent<boolean | void>();

export const $showCreateAdvertisement = createStore(false);

sample({
  source: not($showCreateAdvertisement),
  clock: createBidVisibilityChanged,
  fn: (clk) => clk,
  target: $showCreateAdvertisement,
});
