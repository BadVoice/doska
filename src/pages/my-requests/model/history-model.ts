import { $api } from '@/shared/api';
import type { Order, Orders } from '@/shared/api/generated/Api';
import { createQuery } from '@farfetched/core';
import { createEvent, sample } from 'effector';

export const historyClicked = createEvent<Order>();

export const historyQuery = createQuery({
  handler: async (item: Order) =>
    (await $api.bids.getBid(item?.bid ?? 0)).data.history as unknown as {
      orders: Orders;
    },
});

sample({
  clock: historyClicked,
  target: historyQuery.start,
});
