import { $isAuthorized } from '@/entities/session';
import { $api } from '@/shared/api';
import { appMounted } from '@/shared/model';
import { createQuery } from '@farfetched/core';
import { sample } from 'effector';

export const getOrders = createQuery({
  handler: () => $api.orders.getOrders(),
});

sample({
  clock: appMounted,
  filter: $isAuthorized,
  target: getOrders.start,
});
