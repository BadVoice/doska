import { $api } from '@/shared/api';
import { createEvent, createStore, sample } from 'effector';
import { createQuery } from '@farfetched/core';
import { not } from 'patronum';

export const visibilitySelectBrandChanged = createEvent<void | boolean>();
export const mounted = createEvent();

export const $visible = createStore(false);

export const getBrands = createQuery({
  handler: async () => $api.brands.getBrands(),
});

sample({
  clock: mounted,
  target: getBrands.start,
});

sample({
  source: not($visible),
  clock: visibilitySelectBrandChanged,
  fn: (src, clk) => clk ?? src,
  target: $visible,
});
