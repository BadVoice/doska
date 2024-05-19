import { createMutation, keepFresh } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { not, spread } from 'patronum';

import {$api, $qwepApi} from '@/shared/api/api';

import {
  type BidWithName,
  deleteRequestMutation,
  myRequestsQuery,
} from '@/entities/requests';
import { visibilitySelectBrandChanged } from '@/features/select-brand';
import type {FullRequestParams, RequestParams} from "@/shared/api/generated/Api";
import { searchQuery } from '@/entities/offer';

type TSelectScreenMode = 'offers' | 'selectBrand' | 'history' | null;

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

export const $searchQS = createStore<{ search: string; brand: string } | null>(
  null,
);

interface FilterParams {
  amount?: number;
}

// TODO: add filter request
const filterMutation = createMutation({
  handler: async (params: FullRequestParams) => {
    console.log(params)
    const response = await $api.bids.getBids({...params});
    return response.data;
  },
  })

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
  // @ts-expect-error
  clock: filterSubmitted,
  fn: (clk: FormValues) => ({
    filterMutation: {
      secure: true,
      format: 'json',
      path: '/bids',
      query: {
        search: clk.name,
        amount: clk.count,
        article: clk.article,
      }
    },
    $filterOpened: false,
  }),
  target: spread({ filterMutation: filterMutation.start, $filterOpened }),
});

sample({
  clock: requestClicked,
  filter: (clk) => !!clk.brandName && clk.brandName !== 'Не указано',
  fn: (clk) =>
    ({
      search: clk.name,
      brand: clk.brandName ?? '',
    }) as const,
  target: [searchQuery.start, $searchQS],
});

sample({
  clock: requestViewModeChanged,
  target: $requestViewMode,
});
