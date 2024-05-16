import { createMutation } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { not, spread } from 'patronum';
import type { Bid } from '@/shared/api/generated/Api';

import { $qwepApi } from '@/shared/api/api';
import { deleteRequestMutation } from '@/entities/requests';

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
export const requestClicked = createEvent<Bid>();
export const requestHistoryClicked = createEvent();
export const requestHistoryHidden = createEvent();

export const $filterOpened = createStore(false);
export const $requestHistoryOpened = createStore(false);

// TODO: add filter request
const filterMutation = createMutation({
  handler: async (data) => 'REQUEST HERE',
});

export const searchOffersMutation = createMutation({
  handler: (data: Bid) =>
    $qwepApi.search.getSearch({
      search: data.name,
      brand: data.brand?.toString() ?? '',
    }),
});

sample({
  clock: deleteRequestClicked,
  target: deleteRequestMutation.start,
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
  clock: requestHistoryClicked,
  fn: () => true,
  target: $requestHistoryOpened,
});

sample({
  clock: requestHistoryHidden,
  fn: () => false,
  target: $requestHistoryOpened,
});
