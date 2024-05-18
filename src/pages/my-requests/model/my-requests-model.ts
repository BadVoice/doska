import { createMutation, keepFresh } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { not, spread } from 'patronum';

import { $qwepApi } from '@/shared/api/api';
import {
  type BidWithName,
  deleteRequestMutation,
  myRequestsQuery,
} from '@/entities/requests';

type TSelectScreenMode = 'selectBrand' | 'history' | null;

export interface FormValues {
  name: string;
  requestType: string;
  article: string;
  count: string;
  assigment: string;
}

export const deleteRequestClicked = createEvent<string>();
export const filterVisibilityChanged = createEvent<boolean | void>();
export const filterSubmitted = createEvent<FormValues>();
export const requestClicked = createEvent<BidWithName>();
export const requestViewModeChanged = createEvent<TSelectScreenMode>();

export const $filterOpened = createStore(false);
export const $requestViewMode = createStore<TSelectScreenMode>(null);

// TODO: add filter request
const filterMutation = createMutation({
  handler: async (data) => 'REQUEST HERE',
});

export const searchOffersMutation = createMutation({
  handler: (data: BidWithName) =>
    $qwepApi.search.getSearch({
      search: data.name || '',
      brand: data.brandName || '',
    }),
});

sample({
  clock: deleteRequestClicked,
  fn: () => ({
    $requestViewMode: null,
  }),
  target: spread({
    mutation: deleteRequestMutation.start,
    $requestViewMode,
  }),
});

keepFresh(myRequestsQuery, {
  automatically: true,
  triggers: [deleteRequestMutation.finished.success],
});

sample({
  source: not($filterOpened),
  clock: filterVisibilityChanged,
  fn: (src, clk) => clk ?? src,
  target: $filterOpened,
});

sample({
  clock: filterSubmitted,
  fn: (clk) => ({
    filterMutation: clk,
    $filterOpened: false,
  }),
  target: spread({ filterMutation: filterMutation.start, $filterOpened }),
});

sample({
  clock: requestClicked,
  target: searchOffersMutation.start,
});

sample({
  clock: requestViewModeChanged,
  target: $requestViewMode,
});
