import { $selectedRequestId } from '@/entities/advertisement/';
import { $selectedCompany } from '@/entities/company';
import { getVendors } from '@/entities/offer/model/offers-model';
import { $searchQS } from '@/pages/my-requests';
import { $api } from '@/shared/api';
import type { Item, Offer, Order } from '@/shared/api/generated/Api';
import { toast } from '@/shared/ui/toast';
import { createMutation } from '@farfetched/core';
import { createEffect, createEvent, sample } from 'effector';

export const itemBuyed = createEvent<Item>();
export const offerBuyed = createEvent<Offer>();

const createOffer = createMutation({
  handler: (data: Offer) => $api.offers.createOffer(data),
});

export const createOrder = createMutation({
  handler: (data: Order) => $api.orders.createOrder(data),
});

sample({
  source: {
    $selectedRequestId,
    $selectedCompany,
    $searchQS,
    vendors: getVendors.$data,
  },
  clock: itemBuyed,
  fn: (src, clk) =>
    Object.assign(
      {
        name: clk.title,
        amount: parseInt(clk.quantity?.value ?? '0'),
        price: parseInt(clk.price?.value ?? '0'),
        bid: src.$selectedRequestId ?? 1,
        vendor:
          src.vendors?.data.find((v) =>
            v.qwep_vendors?.find((qv) => qv.title === clk.vendorTitle),
          )?.id ?? 1,
        article: clk.article,
        raw_brand: clk.brand,
      },
      src.$selectedCompany?.id && { company: src.$selectedCompany.id },
      clk.parsedDelivery && {
        delivery_time: clk.parsedDelivery,
      },
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
      vendor: clk.result.data.vendor,
      price: clk.result.data.price,
      delivery_time: clk.result.data.delivery_time,
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
