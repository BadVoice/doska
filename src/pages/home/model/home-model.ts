import { $selectedAdvertisementId } from '@/entities/advertisement/model/advertisement-model';
import { $selectedCompany } from '@/entities/company';
import { $searchQS } from '@/pages/my-requests';
import { $api } from '@/shared/api';
import type { Item, Offer, Order } from '@/shared/api/generated/Api';
import { toast } from '@/shared/ui/toast';
import { createMutation } from '@farfetched/core';
import { createEffect, createEvent, sample } from 'effector';

export const offerBuyed = createEvent<Item>();

const createOffer = createMutation({
  handler: (data: Offer) => $api.offers.createOffer(data),
});

const createOrder = createMutation({
  handler: (data: Order) => $api.orders.createOrder(data),
});

sample({
  source: { $selectedAdvertisementId, $selectedCompany, $searchQS },
  clock: offerBuyed,
  fn: (src, clk) =>
    Object.assign(
      {
        name: src?.$searchQS?.search,
        brand: src?.$searchQS?.brand,
        amount: parseInt(clk.quantity?.value ?? '0'),
        price: parseInt(clk.price?.value ?? '0'),
        bid: parseInt(src.$selectedAdvertisementId ?? '0'),
      },
      src.$selectedCompany?.id && { company: src.$selectedCompany.id },
    ) as Offer,
  target: createOffer.start,
});

sample({
  clock: createOffer.finished.success,
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
