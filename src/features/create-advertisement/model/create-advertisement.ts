import { createEvent, createStore, sample } from 'effector';
import { spread } from 'patronum';
import { createMutation } from '@farfetched/core';
import type { Bid, Offer } from '@/shared/api/generated/Api';
import { $api } from '@/shared/api';

type TFormMode = 'selectType' | 'form';
type TAdvertisementType = 'buy' | 'sell';

export interface FormValues {
  name: string;
  article: string;
  count: string;
  assigment: string;
}

const createOfferMutation = createMutation({
  handler: async (data: Offer) => $api.offers.createOffer(data),
});

const createBidMutation = createMutation({
  handler: async (data: Bid) => $api.bids.createBid(data),
});

export const advertisementTypeSelected = createEvent<TAdvertisementType>();
export const formClosed = createEvent();
export const formSubmitted = createEvent<FormValues>();

export const $advertisementType = createStore<TAdvertisementType | null>(
  null,
).reset([formClosed]);
export const $formMode = createStore<TFormMode>('selectType').reset([
  formClosed,
]);

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
    amount: parseInt(clk?.count ?? 1),
    category: 0,
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
    amount: parseInt(clk?.count ?? 1),
    category: 0,
  }),
  target: [createOfferMutation.start, formClosed],
});
