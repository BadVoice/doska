import { $api } from '@/shared/api';
import { createEvent, sample } from 'effector';
import { createQuery } from '@farfetched/core';

export const mounted = createEvent();

export const getBrands = createQuery({
  handler: async () => $api.brands.getBrands(),
});

sample({
  clock: mounted,
  target: getBrands.start,
});
