import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';
import { createMutation } from '@farfetched/core';
import type { Confirmation } from '@/shared/api/generated/Api';
import { $api } from '@/shared/api';

interface FormValues {
  supplier: string;
  name: string;
  amount: number;
  deliveryFrom?: number | undefined;
  deliveryTo?: number | undefined;
  article?: string | undefined;
  purpose?: string | undefined;
}

export const createOfferMutation = createMutation({
  handler: (data: Confirmation) => $api.confirmations.createConfirmation(data),
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
      category: clk.purpose,
      delivery_time: clk.deliveryTo,
    }) as Confirmation,
  target: createOfferMutation.start,
});
