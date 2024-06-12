import { $selectedAdvertisementId } from '@/entities/advertisement/model/advertisement-model';
import { createMutation, keepFresh } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { not, spread } from 'patronum';

import { $api } from '@/shared/api/api';

import {
  deleteRequestMutation,
  editRequestMutation,
  myRequestsQuery,
} from '@/entities/requests';

import { searchQuery } from '@/entities/offer';
import type { Bid, Brand } from '@/shared/api/generated/Api';

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
export const archiveRequestClicked = createEvent<Bid>();
export const filterVisibilityChanged = createEvent<boolean | void>();
export const filterSubmitted = createEvent<FormValues>();
export const requestClicked = createEvent<BidWithName>();
export const requestViewModeChanged = createEvent<TSelectScreenMode>();

export const $filterOpened = createStore(false);

export const resetRequestViewMode = createEvent();
export const $requestViewMode = createStore<TSelectScreenMode | null>(
  null,
).reset(resetRequestViewMode);

export const $searchQS = createStore<{ search: string; brand: string } | null>(
  null,
);

sample({
  clock: deleteRequestClicked,
  fn: (clk) => ({
    mutation: clk,
    $requestViewMode: null,
  }),
  target: spread({
    mutation: deleteRequestMutation.start,
    $requestViewMode,
  }),
});

sample({
  clock: archiveRequestClicked,
  fn: (clk) => ({
    mutation: clk,
    $requestViewMode: null,
  }),
  target: spread({
    mutation: editRequestMutation.start,
    $requestViewMode,
  }),
});

keepFresh(myRequestsQuery, {
  automatically: true,
  triggers: [
    deleteRequestMutation.finished.success,
    editRequestMutation.finished.success,
  ],
});

sample({
  source: not($filterOpened),
  clock: filterVisibilityChanged,
  fn: (src, clk) => clk ?? src,
  target: $filterOpened,
});

sample({
  clock: filterSubmitted,
  fn: (clk: FormValues) =>
    ({
      filterMutation: {
        search: clk.name,
        amount: parseInt(clk.count ?? '1'),
        article: clk.article,
      },
      $filterOpened: false,
    }) as const,
  target: spread({ filterMutation: myRequestsQuery.start, $filterOpened }),
});

sample({
  clock: requestClicked,
  filter: (clk) => !!clk.brandName && clk.brandName !== 'Не указано',
  fn: (clk) => {
    const data = {
      search: clk.name,
      brand: clk.brandName ?? '',
    };

    return {
      search: data,
      qs: data,
      id: clk.id,
    } as const;
  },
  target: spread({
    search: searchQuery.start,
    qs: $searchQS,
    id: $selectedAdvertisementId,
  }),
});

sample({
  clock: requestViewModeChanged,
  target: $requestViewMode,
});

export const bidMutation = createMutation({
  handler: async (data: BidMutationData) => {
    if (!data.brand.name && !data.brand.id) {
      console.log(data.brand.name);
      console.log('brand not found');
    } else {
      const response = await $api.bids.updateBid(parseInt(data.bid.id ?? ''), {
        name: data.bid.name,
        amount: data.bid.amount,
        brand: parseInt(data.brand.id ?? ''),
        category: data.bid.category,
      });
      return response.data;
    }
  },
});

export const editRequestSelected = createEvent<BidWithName>();
export const brandSelected = createEvent<Brand>();
const $changedBid = createStore<BidWithName | null>(null);

sample({
  clock: editRequestSelected,
  target: $changedBid,
});

sample({
  source: $changedBid,
  clock: brandSelected,
  filter: (src, clk) => !!src && !!clk,
  fn: (src, clk) => ({
    params: src!,
    bid: src!,
    brand: clk,
  }),
  target: bidMutation.start,
});

keepFresh(myRequestsQuery, {
  automatically: true,
  triggers: [bidMutation.finished.success],
});
