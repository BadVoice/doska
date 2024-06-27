import { $api } from '@/shared/api';
import { appMounted } from '@/shared/model';
import { createQuery } from '@farfetched/core';
import { sample } from 'effector';

export const getOrders = createQuery({
  handler: () => $api.orders.getOrders(),
});

sample({
  clock: appMounted,
  target: getOrders.start,
});
