import { myRequestsQuery } from '@/entities/requests';
import { $api } from '@/shared/api';
import type { Bid, Offer } from '@/shared/api/generated/Api';
import { createMutation, createQuery, keepFresh } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { spread } from 'patronum';

type TFormMode = 'selectType' | 'form';
type TAdvertisementType = 'buy' | 'sell';

export interface FormValues {
  name: string;
  article: string;
  count: string;
  price?: number;
  available?: number;
  destination?: number;
}

const createOfferMutation = createMutation({
  handler: (data: Offer) => $api.offers.createOffer(data),
});

const createBidMutation = createMutation({
  handler: (data: Bid & { destination: number }) =>
    $api.bids.createBid({
      name: data.name,
      article: data.article || 'Не указано',
      amount: data.amount,
      brand: 1,
      category: 1,
      status: 0,
      destinations: [data.destination],
    }),
});

export const getDestinations = createQuery({
  handler: () => $api.destinations.getDestinations(),
});

export const advertisementTypeSelected = createEvent<TAdvertisementType>();
export const formClosed = createEvent();
export const formSubmitted = createEvent<FormValues>();
export const createAdvertisementMounted = createEvent();

export const $advertisementType = createStore<TAdvertisementType | null>(
  null,
).reset([formClosed]);
export const $formMode = createStore<TFormMode>('selectType').reset([
  formClosed,
]);

sample({
  clock: createAdvertisementMounted,
  target: getDestinations.start,
});

sample({
  clock: advertisementTypeSelected,
  fn: (clk) => ({
    $advertisementType: clk,
    $formMode: 'form' as const,
  }),
  target: spread({
    $advertisementType,
    $formMode,
  }),
});

sample({
  clock: formSubmitted,
  source: $advertisementType,
  filter: (src) => src === 'buy',
  fn: (_, clk) => ({
    name: clk.name,
    article: clk.article,
    amount: parseInt(clk?.count ?? '1'),
    destination: clk.destination!,
  }),
  target: [createBidMutation.start, formClosed],
});

sample({
  clock: formSubmitted,
  source: $advertisementType,
  filter: (src) => src === 'sell',
  fn: (_, clk) => ({
    name: clk.name,
    amount: parseInt(clk?.count ?? '1'),
    price: clk.price!,
    delivery_time: clk.available,
    destination: clk.destination!,
  }),
  target: [createOfferMutation.start, formClosed],
});

keepFresh(myRequestsQuery, {
  triggers: [
    createOfferMutation.finished.success,
    createBidMutation.finished.success,
  ],
  automatically: true,
});
