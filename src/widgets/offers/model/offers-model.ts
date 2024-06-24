import { $selectedAdvertisementId } from '@/entities/advertisement';
import { offersQuery } from '@/entities/offer';
import { $api } from '@/shared/api';
import type { Offer } from '@/shared/api/generated/Api';
import { createMutation, createQuery } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

interface FormValues {
  supplier: string;
  name: string;
  amount: number;
  deliveryFrom?: number | undefined;
  deliveryTo?: number | undefined;
  article?: string | undefined;
  purpose?: string | undefined;
  price: number;
}

export const createOfferMutation = createMutation({
  handler: (data: Offer) => $api.offers.createOffer(data),
});

export const getDestinations = createQuery({
  handler: () => $api.destinations.getDestinations(),
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
  source: $selectedAdvertisementId,
  clock: formSubmitted,
  fn: (src, clk) =>
    ({
      bid: parseInt(src ?? '1'),
      name: clk.name,
      article: clk.article,
      price: clk.price,
      amount: clk.amount,
      category: clk.purpose,
      delivery_time: clk.deliveryTo,
    }) as Offer,
  target: createOfferMutation.start,
});

sample({
  source: $showAddOfferModal,
  filter: (src) => src,
  target: getDestinations.start,
});

sample({
  source: $selectedAdvertisementId,
  clock: createOfferMutation.finished.success,
  filter: (_, clk) => [201].includes(clk.result.status),
  fn: (id) =>
    ({
      bid: parseInt(id ?? '1'),
    }) as const,
  target: offersQuery.start,
});
