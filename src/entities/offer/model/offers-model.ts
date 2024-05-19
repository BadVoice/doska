import { createQuery } from '@farfetched/core';
import { $qwepApi } from '@/shared/api/api';
import type { SearchRequest } from '@/shared/api/generated/Api';
import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

export const offerListVisibilityChanged = createEvent();

export const $offersVisible = createStore(false);

export const searchQuery = createQuery({
  handler: (data: SearchRequest) => $qwepApi.search.getSearch(data),
});

sample({
  source: not($offersVisible),
  clock: offerListVisibilityChanged,
  target: $offersVisible,
});
