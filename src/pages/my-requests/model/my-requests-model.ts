import {createMutation, keepFresh} from '@farfetched/core';
import {combine, createEvent, createStore, sample} from 'effector';
import { not, spread } from 'patronum';

import { $api } from '@/shared/api/api';

import {
  deleteRequestMutation,
  myRequestsQuery,
} from '@/entities/requests';

import type { Bid, Brand } from "@/shared/api/generated/Api";
import { searchQuery } from '@/entities/offer';

type TSelectScreenMode = 'offers' | 'selectBrand' | 'history' | null;

export interface FormValues {
  name: string;
  requestType: string;
  article: string;
  count: string;
  assigment: string;
}

export interface BidWithName extends Bid {
  brandName?: string;
  categoryName?: string;
}

interface BidMutationData {
  params: BidWithName;
  bid: BidWithName;
  brand: Brand;
}

export const deleteRequestClicked = createEvent<string>();
export const filterVisibilityChanged = createEvent<boolean | void>();
export const filterSubmitted = createEvent<FormValues>();
export const requestClicked = createEvent<BidWithName>();
export const requestViewModeChanged = createEvent<TSelectScreenMode>();

export const $filterOpened = createStore(false);
export const $requestViewMode = createStore<TSelectScreenMode>(null);
export const resetRequestViewMode = createEvent();

export const $searchQS = createStore<{ search: string; brand: string } | null>(
  null,
);

$requestViewMode.on(resetRequestViewMode, () => null);

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
  target: spread({ filterMutation: myRequestsQuery.start, $filterOpened }),
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

export const requestClickedOnChange = createEvent<BidWithName>();
export const brandClickedOnChange = createEvent<Brand>();
const changedBid = createStore<BidWithName>({} as BidWithName);
const changedBrand = createStore<Brand>({} as Brand);

sample({
  clock: requestClickedOnChange,
  fn: (bidData) => {
    return bidData;
  },
  target: changedBid,
});

sample({
  clock: brandClickedOnChange,
  fn: (brandData) => {
    return brandData;
  },
  target: changedBrand,
});

// @ts-expect-error
export const bidMutation = createMutation<BidMutationData>({
  handler: async (data) => {
   if(!data.brand.name && !data.brand.id) {
     console.log(data.brand.name)
     console.log('brand not found')
   }
   else {
     const response = await $api.bids.updateBid(parseInt(data.bid.id ?? "", 10), {
       name: data.bid.name,
       amount: data.bid.amount,
       brand: parseInt(data.brand.id ?? "", 10),
       category: data.bid.category,
     });
     return response.data;
   }
  },
});

const $combinedBidData = combine(
    changedBid,
    changedBrand,
    (bid, brand) => ({ bid, brand })
);

sample({
  clock: $combinedBidData,
  fn: (combinedData: { bid: BidWithName; brand: Brand }) => {
    return {
      id: combinedData.bid.id,
      params: combinedData.bid,
      bid: combinedData.bid,
      brand: combinedData.brand
    };
  },
  target: bidMutation.start,
});