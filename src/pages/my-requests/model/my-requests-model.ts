import { createMutation } from '@farfetched/core';
import {createEvent, createStore, forward, sample} from 'effector';
import { not, spread } from 'patronum';

import { $qwepApi } from '@/shared/api/api';
import {$requests, deleteRequestMutation, myRequestsQuery} from '@/entities/requests';
import {showBrandSelector} from "@/features/select-brand/model/brand-model";

export interface FormValues {
  name: string;
  requestType: string;
  article: string;
  count: string;
  assigment: string;
}

export interface Bid {
  id?: string;
  /**
   * @format date-time
   * @example "2024-04-14T08:12:44.533679Z"
   */
  created_at?: string;
  /** @format binary */
  image?: File | null;
  /**
   * dictionary:
   *   * 0 Создана
   *   * 1 Опубликована
   *   * 2 Исполнена
   *   * 3 Архивирована
   * @default 0
   */
  status?: 0 | 1 | 2 | 3;
  name: string;
  article?: string;
  amount: number;
  delivery_time?: number;
  description?: string;
  /** company_id */
  company?: number;
  /** category_id */
  category: number;
  /** brand_id */
  brand?: number;
  brandName?: string;
  categoryName?: string;
  /** destination_id */
  destinations?: number[];
}

export const deleteRequestClicked = createEvent<string>();
export const filterVisibilityChanged = createEvent<boolean | void>();
export const filterSubmitted = createEvent<FormValues>();
export const requestClicked = createEvent<Bid>();
export const requestHistoryClicked = createEvent();
export const selectBrandHidden = createEvent();
export const showSelectBrandClicked = createEvent();
export const requestHistoryHidden = createEvent();

export const $filterOpened = createStore(false);
export const $requestHistoryOpened = createStore(false);

export const $selectBrandOpened = createStore(false);

// TODO: add filter request
const filterMutation = createMutation({
  handler: async (data) => 'REQUEST HERE',
});

export const searchOffersMutation = createMutation({
  handler: (data: Bid) =>
    $qwepApi.search.getSearch({
      search: data.name || '',
      brand: data.brandName || '',
    }),
});

sample({
  clock: deleteRequestClicked,
  target: [deleteRequestMutation.start, myRequestsQuery.start],
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
  fn: (cardData) => {
    console.log('Payload data:', cardData);
    return {
      ...cardData,
    };
  },
  target: searchOffersMutation.start,
});

// sample({
//   clock: requestHistoryClicked,
//   fn: () => true,
//   target: $requestHistoryOpened,
// });
//
// sample({
//   clock: requestHistoryHidden,
//   fn: () => false,
//   target: $requestHistoryOpened,
// });

sample({
  clock: showSelectBrandClicked,
  fn: () => true,
  target: $selectBrandOpened,
});

sample({
  clock: selectBrandHidden,
  fn: () => false,
  target: $selectBrandOpened,
});
