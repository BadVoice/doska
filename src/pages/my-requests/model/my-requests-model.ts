import { $selectedAdvertisementId } from '@/entities/advertisement/model/advertisement-model';
import { createMutation, keepFresh } from '@farfetched/core';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { not, spread } from 'patronum';

import { $api } from '@/shared/api/api';

import {
  deleteRequestMutation,
  editRequestMutation,
  myRequestsQuery,
} from '@/entities/requests';

import { searchQuery } from '@/entities/offer';
import { $isAuthorized } from '@/entities/session';
import { createBidVisibilityChanged } from '@/features/create-advertisement';
import type { Bid, Brand } from '@/shared/api/generated/Api';
import { appMounted } from '@/shared/model';
import { handleShowAuthChanged } from '@/widgets/auth';
import { searchVisibilityChanged } from '@/widgets/header';

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
export const editRequestSelected = createEvent<BidWithName>();

export const deleteRequestClicked = createEvent<number>();
export const archiveRequestClicked = createEvent<Bid>();
export const filterVisibilityChanged = createEvent<boolean | void>();
export const filterSubmitted = createEvent<FormValues>();
export const requestClicked = createEvent<BidWithName>();
export const requestViewModeChanged = createEvent<TSelectScreenMode>();
export const pageSelected = createEvent<number>();
export const publicationClicked = createEvent<BidWithName>();

export const $filterOpened = createStore(false);

export const $currentPage = createStore(1).on(pageSelected, (_, clk) => clk);
export const resetRequestViewMode = createEvent();
export const $requestViewMode = createStore<TSelectScreenMode | null>(
  null,
).reset(
  resetRequestViewMode,
  handleShowAuthChanged,
  createBidVisibilityChanged,
  searchVisibilityChanged,
);

export const $searchQS = createStore<{ search: string; brand: string } | null>(
  null,
);

sample({
  clock: deleteRequestClicked,
  fn: (clk) => ({
    mutation: clk?.toString(),
    $requestViewMode: null,
  }),
  target: spread({
    mutation: deleteRequestMutation.start,
    $requestViewMode,
  }),
});

sample({
  clock: publicationClicked,
  fn: (clk) =>
    ({
      name: clk.name,
      amount: clk.amount,
      id: clk.id,
      status: 1,
    }) as const,
  target: editRequestMutation.start,
});

sample({
  clock: archiveRequestClicked,
  fn: (clk) => ({
    mutation: {
      name: clk.name,
      amount: clk.amount,
      id: clk.id,
      status: 3,
    } as const,
    $requestViewMode: null,
  }),
  target: spread({
    mutation: editRequestMutation.start,
    $requestViewMode,
  }),
});

sample({
  source: { $isAuthorized, $currentPage },
  clock: appMounted,
  filter: (src) => src.$isAuthorized,
  fn: (src) => ({ page: src.$currentPage }) as const,
  target: myRequestsQuery.start,
});

keepFresh(myRequestsQuery, {
  automatically: true,
  triggers: [
    deleteRequestMutation.finished.success,
    editRequestMutation.finished.success,
    $isAuthorized.updates,
  ],
});

sample({
  clock: pageSelected,
  fn: (clk) =>
    ({
      page: clk,
    }) as const,
  target: myRequestsQuery.start,
});

sample({
  source: not($filterOpened),
  clock: filterVisibilityChanged,
  fn: (src, clk) => clk ?? src,
  target: $filterOpened,
});

sample({
  source: $currentPage,
  clock: filterSubmitted,
  fn: (src, clk: FormValues) =>
    ({
      filterMutation: {
        search: clk.name,
        amount: parseInt(clk.count ?? '1'),
        article: clk.article,
        page: src,
      },
      $filterOpened: false,
    }) as const,
  target: spread({ filterMutation: myRequestsQuery.start, $filterOpened }),
});

sample({
  clock: requestClicked,
  filter: (clk) => !clk.brand,
  fn: (clk) =>
    ({
      $requestViewMode: 'selectBrand',
      editRequestSelected: clk,
      id: clk.id?.toString(),
    }) as const,
  target: spread({
    $requestViewMode,
    editRequestSelected,
    id: $selectedAdvertisementId,
  }),
});

sample({
  clock: requestClicked,
  filter: (clk) => !!clk.brand,
  fn: (clk) => {
    const data = {
      search: clk.name,
      brand: clk.brandName ?? '',
    };

    return {
      search: data,
      qs: data,
      id: clk.id?.toString(),
    } as const;
  },
  target: spread({
    search: searchQuery.start,
    qs: $searchQS,
    id: $selectedAdvertisementId,
  }),
});

sample({
  clock: searchQuery.finished.success,
  filter: (clk) => [200].includes(clk.result.status),
  fn: () => 'offers' as const,
  target: $requestViewMode,
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
      const response = await $api.bids.updateBid(
        parseInt(data.bid.id?.toString() ?? '0'),
        {
          name: data.bid.name,
          amount: data.bid.amount,
          brand: parseInt(data.brand.id?.toString() ?? ''),
          category: data.bid.category ?? 1,
        },
      );
      return response.data;
    }
  },
});

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

const getBidWithBrandNameFx = createEffect(
  async (bid: Bid): Promise<BidWithName> => {
    const brands = (await $api.brands.getBrands()).data;
    const categories = (await $api.categories.getCategories()).data;

    const brandsMap = new Map(brands.map((brand) => [brand.id, brand.name]));
    const categoriesMap = new Map(
      categories.map((category) => [category.id, category.name]),
    );

    return {
      ...bid,
      article: bid.article || 'Не указано',
      brandName: brandsMap.get(bid.brand) || 'Не указано',
      categoryName: categoriesMap.get(bid.category) || 'Не указано',
    };
  },
);

sample({
  clock: bidMutation.finished.success,
  fn: (clk) =>
    ({
      $requestViewMode: 'offers',
      getBidWithBrandNameFx: clk.result,
    }) as const,
  target: spread({
    $requestViewMode,
    getBidWithBrandNameFx,
  }),
});

sample({
  clock: getBidWithBrandNameFx.doneData,
  target: requestClicked,
});

keepFresh(myRequestsQuery, {
  automatically: true,
  triggers: [bidMutation.finished.success],
});
