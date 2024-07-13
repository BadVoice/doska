import { $isAuthorized } from '@/entities/session';
import { $api } from '@/shared/api';
import { appMounted } from '@/shared/model';
import { createQuery } from '@farfetched/core';
import { sample } from 'effector';
import { delay } from 'patronum';

export const getOrders = createQuery({
  handler: async () => {
    const orders = await $api.orders.getOrders();
    const offers = await $api.offers.getOffers();

    return {
      ...orders,
      results: orders.data.results?.map((order) => {
        return {
          ...order,
          ...offers.data.find((offer) => order.offer === offer.id),
        };
      }),
    };
  },
});

sample({
  clock: delay(appMounted, 1000),
  filter: $isAuthorized,
  target: getOrders.start,
});
