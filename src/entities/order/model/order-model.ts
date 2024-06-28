import { $isAuthorized } from '@/entities/session';
import { $api } from '@/shared/api';
import { appMounted } from '@/shared/model';
import { createQuery } from '@farfetched/core';
import { sample } from 'effector';
import { delay } from 'patronum';

export const getOrders = createQuery({
  handler: () => $api.orders.getOrders(),
});

sample({
  clock: delay(appMounted, 1000),
  filter: $isAuthorized,
  target: getOrders.start,
});
