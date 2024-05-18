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
export const requestHistoryVisible = createEvent<boolean>();

export const $filterOpened = createStore(false);
export const $requestHistoryOpened = createStore(false);

export const $selectBrandOpened = createStore(false);

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

export const searchOffersMutation = createMutation({
  handler: (data: BidWithName) =>
    $qwepApi.search.getSearch({
      search: data.name || '',
      brand: data.brandName || '',
    }),
});

sample({
  clock: deleteRequestClicked,
  target: deleteRequestMutation.start,
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
  target: searchOffersMutation.start,
});

sample({
  clock: requestHistoryVisible,
  target: visibilitySelectBrandChanged,
});
