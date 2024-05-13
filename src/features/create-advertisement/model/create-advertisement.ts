import { createEvent, createStore, sample, split } from 'effector';
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

const createBidMutation = createMutation({
  handler: async (data: Bid) => $api.bids.createBid(data),
});

const createOfferMutation = createMutation({
  handler: async (data: Offer) => $api.offers.createOffer(data),
});

export const advertisementTypeSelected = createEvent<TAdvertisementType>();
export const formClosed = createEvent();
export const formSubmitted = createEvent<FormValues>();

export const $advertisementType = createStore<TAdvertisementType | null>(
  null,
).reset([formClosed, formSubmitted]);
export const $formMode = createStore<TFormMode>('selectType').reset(formClosed);

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

split({
  source: $advertisementType,
  clock: formSubmitted,
  match: {
    buy: (src) => src === 'buy',
    sell: (src) => src === 'sell',
  },

  cases: {
    buy: createBidMutation.start,
    sell: createOfferMutation.start,
  },
});
