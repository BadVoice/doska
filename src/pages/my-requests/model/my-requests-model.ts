import { createMutation, createQuery } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { not, spread } from 'patronum';
import type { Bid } from '@/shared/api/generated/Api';

import { $api, $qwepApi } from '@/shared/api/api';

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

export const $filterOpened = createStore(false);
export const myRequestsQuery = createQuery({
  handler: async () => (await $api.bids.getBids()).data,
});

const deleteRequestMutation = createMutation({
  // @ts-expect-error the backend expects a number, but returns a string as the id
  handler: async (id: string) => $api.bids.deleteBid(id),
});

// TODO: add filter request
const filterMutation = createMutation({
  handler: async (data) => 'REQUEST HERE',
});

export const searchOffersMutation = createMutation({
  handler: async (data: Bid) =>
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
