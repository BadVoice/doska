import { $api } from '@/shared/api';
import { $qwepApi } from '@/shared/api/api';
import type {
  Offer,
  PreSearchRequest,
  SearchRequest,
} from '@/shared/api/generated/Api';
import { createMutation, createQuery } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

export const offerListVisibilityChanged = createEvent();
export const deleteOfferClicked = createEvent<number>();
export const offerClicked = createEvent<Offer>();

export const deleteOfferMutation = createMutation({
  handler: (id: number) => $api.offers.deleteOffer(id),
});

sample({
  clock: deleteOfferClicked,
  target: deleteOfferMutation.start,
});

export const $offersVisible = createStore(false);

export const searchQuery = createQuery({
  handler: (data: SearchRequest) => $qwepApi.search.getSearch(data),
});

export const offersQuery = createQuery({
  handler: (data?: { bid: number }) => $api.offers.getOffers(data),
});

export const preSearchQuery = createQuery({
  handler: (data: PreSearchRequest) => $qwepApi.preSearch.getPreSearch(data),
});

sample({
  source: not($offersVisible),
  clock: offerListVisibilityChanged,
  target: $offersVisible,
});
