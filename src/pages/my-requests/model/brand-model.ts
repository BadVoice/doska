import { $api } from '@/shared/api';
import { createQuery } from '@farfetched/core';
import { createEvent, sample } from 'effector';

export const mounted = createEvent();
export const getBrands = createQuery({
  handler: async () => $api.brands.getBrands(),
});

sample({
  clock: mounted,
  target: getBrands.start,
});
