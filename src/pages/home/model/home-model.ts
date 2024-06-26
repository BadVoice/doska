import {
  $selectedAdvertisementId,
  $selectedRequestId,
} from '@/entities/advertisement/';
import { $selectedCompany } from '@/entities/company';
import { $searchQS } from '@/pages/my-requests';
import { $api } from '@/shared/api';
import type { Item, Offer, Order } from '@/shared/api/generated/Api';
import { toast } from '@/shared/ui/toast';
import { createMutation } from '@farfetched/core';
import { createEffect, createEvent, sample } from 'effector';
import { debug } from 'patronum';

export const itemBuyed = createEvent<Item>();
export const offerBuyed = createEvent<Offer>();

const createOffer = createMutation({
  handler: (data: Offer) => $api.offers.createOffer(data),
});

const createOrder = createMutation({
  handler: (data: Order) => $api.orders.createOrder(data),
});

sample({
  source: { $selectedRequestId, $selectedCompany, $searchQS },
  clock: itemBuyed,
  fn: (src, clk) =>
    Object.assign(
      {
        name: src?.$searchQS?.search,
        amount: parseInt(clk.quantity?.value ?? '0'),
        price: parseInt(clk.price?.value ?? '0'),
        bid: src.$selectedRequestId ?? 1,
      },
      src.$selectedCompany?.id && { company: src.$selectedCompany.id },
    ) as Offer,
  target: createOffer.start,
});

sample({
  clock: [createOffer.finished.success],
  filter: (clk) => [201].includes(clk.result.status),
  fn: (clk) =>
    ({
      name: clk.result.data.name,
      offer: clk.result.data.id,
      amount: clk.result.data.amount,
      bid: clk.result.data.bid,
      price: clk.result.data.price,
    }) as Order,
  target: createOrder.start,
});

sample({
  clock: offerBuyed,
  fn: (clk) =>
    ({
      name: clk.name,
      offer: clk.id,
      amount: clk.amount,
      bid: clk.bid,
      price: clk.price,
    }) as Order,
  target: createOrder.start,
});

const notifyBuyedFx = createEffect(() => {
  toast({
    title: 'Куплено',
  });
});

sample({
  clock: createOrder.finished.success,
  filter: (clk) => [201].includes(clk.result.status),
  target: notifyBuyedFx,
});
