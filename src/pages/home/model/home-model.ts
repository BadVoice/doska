import { $selectedRequestId } from '@/entities/advertisement/';
import { $selectedCompany } from '@/entities/company';
import { $isAuthorized } from '@/entities/session';
import { $searchQS, requestClicked } from '@/pages/my-requests';
import { $api } from '@/shared/api';
import { $qwepApi } from '@/shared/api/api';
import type { Item, Offer, Order } from '@/shared/api/generated/Api';
import { appMounted } from '@/shared/model';
import { toast } from '@/shared/ui/toast';
import { createMutation, createQuery } from '@farfetched/core';
import { createEffect, createEvent, sample } from 'effector';

export const itemBuyed = createEvent<Item>();
export const offerBuyed = createEvent<Offer>();

const getVendors = createQuery({
  handler: () => $qwepApi.vendors.getVendors(),
});

sample({
  clock: [appMounted, $isAuthorized, requestClicked],
  filter: $isAuthorized,
  target: getVendors.start,
});

const createOffer = createMutation({
  handler: (data: Offer) => $api.offers.createOffer(data),
});

const createOrder = createMutation({
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
      },
      src.$selectedCompany?.id && { company: src.$selectedCompany.id },
      clk.parsedDelivery && {
        delivery_time: clk.parsedDelivery,
      },
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
