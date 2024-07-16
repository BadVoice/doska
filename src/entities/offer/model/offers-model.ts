import { $isAuthorized } from '@/entities/session';
import { $api } from '@/shared/api';
import { $qwepApi } from '@/shared/api/api';
import type {
  Offer,
  PreSearchRequest,
  SearchRequest,
} from '@/shared/api/generated/Api';
import { appMounted } from '@/shared/model';
import { createMutation, createQuery } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { debug, not } from 'patronum';

export const offerListVisibilityChanged = createEvent();
export const deleteOfferClicked = createEvent<number>();
export const offerClicked = createEvent<Offer>();

export const deleteOfferMutation = createMutation({
  handler: (id: number) => $api.offers.deleteOffer(id),
});

export const getVendors = createQuery({
  handler: () => $qwepApi.vendors.getVendors(undefined),
});

sample({
  clock: [appMounted, $isAuthorized],
  filter: $isAuthorized,
  target: getVendors.start,
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

debug(preSearchQuery.start);

sample({
  source: not($offersVisible),
  clock: offerListVisibilityChanged,
  target: $offersVisible,
});
