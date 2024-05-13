import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';
import { createMutation } from '@farfetched/core';
import type { Offer } from '@/shared/api/generated/Api';
import { $api } from '@/shared/api';

interface FormValues {
  amount: number;
  article?: string;
  deliveryFrom?: number;
  deliveryTo?: number;
  name: string;
  purpose?: string;
  supplier: string;
}

export const createOfferMutation = createMutation({
  handler: (data: Offer) => $api.offers.createOffer(data),
});

export const offerAddButtonClicked = createEvent();
export const formSubmitted = createEvent<FormValues>();

export const $showAddOfferModal = createStore(false);

sample({
  clock: offerAddButtonClicked,
  source: not($showAddOfferModal),
  target: $showAddOfferModal,
});

sample({
  clock: formSubmitted,
  fn: (clk) =>
    ({
      name: clk.name,
      article: clk.article,
      price: 0,
      amount: clk.amount,
      company: 0,
      category: 0,
    }) as Offer,
  target: createOfferMutation.start,
});
