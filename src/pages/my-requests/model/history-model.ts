import { $api } from '@/shared/api';
import { createQuery } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import type { Confirmation, Order } from '../../../shared/api/generated/Api';
import type { BidWithName } from './my-requests-model';

export const historyClicked = createEvent<BidWithName>();

export const historyQuery = createQuery({
  handler: async (item: BidWithName): Promise<(Confirmation | Order)[]> => {
    const [confirmations, orders, orderReturns] = await Promise.all([
      $api.confirmations
        .getConfirmations()
        .then((res) => res.data)
        .then((data) =>
          data.filter((confirmation) => confirmation.bid === item.id),
        ),
      $api.orders
        .getOrders()
        .then((res) => res.data)
        .then((data) => data.filter((order) => order.bid === item.id)),
      $api.orderReturns.getOrderReturns().then((res) => res.data),
    ]);

    const returns = orderReturns.filter((orderReturn) =>
      orders.map((order) => order.id).includes(orderReturn.order),
    );

    return [...confirmations, ...orders];
  },
});

sample({
  clock: historyClicked,
  target: historyQuery.start,
});
