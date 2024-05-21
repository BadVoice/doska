import { createQuery } from '@farfetched/core';
import { $qwepApi } from '@/shared/api/api';
import type {
  PreSearchRequest,
  SearchRequest,
} from '@/shared/api/generated/Api';
import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

export const offerListVisibilityChanged = createEvent();

export const $offersVisible = createStore(false);

export const searchQuery = createQuery({
  handler: (data: SearchRequest) => $qwepApi.search.getSearch(data),
});

export const preSearchQuery = createQuery({
  handler: (data: PreSearchRequest) => $qwepApi.preSearch.getPreSearch(data),
});

sample({
  source: not($offersVisible),
  clock: offerListVisibilityChanged,
  target: $offersVisible,
});
