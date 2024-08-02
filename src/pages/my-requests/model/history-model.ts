import { $api } from '@/shared/api';
import type { Offer, Order, OrderReturn } from '@/shared/api/generated/Api';
import { createQuery } from '@farfetched/core';
import { combine, createEvent, sample } from 'effector';
import type { BidWithName } from './my-requests-model';
import { debug } from 'patronum';

export const historyClicked = createEvent<Order>();
export const historyClickedBid = createEvent<BidWithName>();
export const historyClickedReturn = createEvent<
  OrderReturn & Order & { brand: string }
>();

export const historyQuery = createQuery({
  handler: async (request: BidWithName) => {
    const bid = await $api.bids.getBid(request?.id ?? 1);

    return {
      requestHistory: (bid.data as any).status_history as {
        changed_at: string;
        status: number;
      }[],
      request,
    };
  },
});

export const historyReturnQuery = createQuery({
  handler: async (orderReturn: OrderReturn & Order & { brand: string }) => {
    const offers = (await $api.offers.getOffers()).data;

    const orderReturnHistory = (
      (await $api.orderReturns.getOrderReturn(orderReturn?.id ?? 1)).data as any
    ).status_history as { changed_at: string; status: 0 | 1 }[];
    const orderHistory = (await $api.orders.getOrder(orderReturn?.order ?? 1))
      .data;
    const requestHistory = (await $api.bids.getBid(orderReturn?.bid ?? 1)).data;

    return {
      orderReturnHistory,
      orderHistory: (orderHistory as any).status_history as {
        changed_at: string;
        status: 0 | 1;
      }[],
      requestHistory: (requestHistory as any).status_history as {
        changed_at: string;
        status: number;
      }[],
      request: requestHistory,
      order: {
        ...orderHistory,
        offer: offers.find((o) => o.id === orderHistory?.offer ?? 1),
      } as Order & { offer: Offer },
      orderReturn: {
        ...orderReturn,
        offer: offers.find((o) => o.id === orderHistory?.offer ?? 1),
      } as OrderReturn & Order & { offer: Offer } & { brand: string },
    };
  },
});

export const historyOrderQuery = createQuery({
  handler: async (order: Order) => {
    const offers = (await $api.offers.getOffers()).data;
    const orderHistory = (
      (await $api.orders.getOrder(order?.id ?? 1)).data as any
    ).status_history as {
      changed_at: string;
      status: 0 | 1;
    }[];
    const requestHistory = (await $api.bids.getBid(order?.bid ?? 1)).data;

    return {
      orderHistory,
      requestHistory: (requestHistory as any).status_history as {
        changed_at: string;
        status: number;
      }[],
      request: requestHistory,
      order: {
        ...order,
        offer: offers.find((o) => o.id === order?.offer ?? 1),
      } as Order & { offer: Offer },
    };
  },
});

sample({
  clock: [historyClicked, historyClickedBid, historyClickedReturn],
  target: [
    historyQuery.reset,
    historyReturnQuery.reset,
    historyOrderQuery.reset,
  ],
});

export const $fullHistory = combine(
  {
    first: historyQuery.$data,
    second: historyReturnQuery.$data,
    third: historyOrderQuery.$data,
  },
  (shape) => ({
    requestHistory: [
      ...(shape.first?.requestHistory ?? []),
      ...(shape.second?.requestHistory ?? []),
      ...(shape.third?.requestHistory ?? []),
    ],
    orderHistory: [
      ...(shape.second?.orderHistory ?? []),
      ...(shape.third?.orderHistory ?? []),
    ],
    orderReturnHistory: [...(shape.second?.orderReturnHistory ?? [])],
    request:
      shape.first?.request ?? shape.second?.request ?? shape.third?.request,
    order: shape.third?.order ?? shape.second?.order,
    return: shape.second?.orderReturn,
  }),
);

sample({
  clock: historyClicked,
  target: historyOrderQuery.start,
});

sample({
  clock: historyClickedBid,
  target: historyQuery.start,
});

sample({
  clock: historyClickedReturn,
  target: historyReturnQuery.start,
});

debug(historyReturnQuery.$data);
debug(historyOrderQuery.$data);
