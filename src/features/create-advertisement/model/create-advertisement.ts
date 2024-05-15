import { $api } from '@/shared/api';
import type { Bid, Offer } from '@/shared/api/generated/Api';
import { createMutation, createQuery } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { spread } from 'patronum';

type TFormMode = 'selectType' | 'form';
type TAdvertisementType = 'buy' | 'sell';

export interface FormValues {
  name: string;
  article: string;
  count: string;
  assigment: number;
}

const createOfferMutation = createMutation({
  handler: (data: Offer) => $api.offers.createOffer(data),
});

const createBidMutation = createMutation({
  handler: (data: Bid) => $api.bids.createBid(data),
});

export const getCategories = createQuery({
  handler: () => $api.categories.getCategories(),
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
  target: getCategories.start,
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
    category: clk.assigment,
  }),
  target: [createBidMutation.start, formClosed],
});

sample({
  clock: formSubmitted,
  source: $advertisementType,
  filter: (src) => src === 'sell',
  fn: (_, clk) => ({
    name: clk.name,
    price: 0,
    amount: parseInt(clk?.count ?? '1'),
    category: clk.assigment,
  }),
  target: [createOfferMutation.start, formClosed],
});
