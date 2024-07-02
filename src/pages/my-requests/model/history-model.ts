import { $api } from '@/shared/api';
import type { Order, Orders } from '@/shared/api/generated/Api';
import { createQuery } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import type { BidWithName } from './my-requests-model';

export const historyClicked = createEvent<Order>();
export const historyClickedBid = createEvent<BidWithName>();

export const historyQuery = createQuery({
  handler: async (item: Order) =>
    (await $api.bids.getBid(item?.bid ?? 0)).data.history as unknown as {
      orders: Orders;
    },
});

export const historyQueryBid = createQuery({
  handler: async (item: BidWithName) =>
    (await $api.bids.getBid(item?.id ?? 0)).data.history as unknown as {
      orders: Orders;
    },
});

sample({
  clock: historyClicked,
  target: historyQuery.start,
});

sample({
  clock: historyClickedBid,
  target: historyQueryBid.start,
});
