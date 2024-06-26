import { $selectedRequestId } from '@/entities/advertisement';
import { $selectedCompany } from '@/entities/company';
import { $selectedAdvertisementId } from '@/entities/advertisement';
import { createMutation, keepFresh } from '@farfetched/core';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
  type EventCallable,
} from 'effector';
import { not, spread } from 'patronum';

import { $api } from '@/shared/api/api';

import {
  deleteRequestMutation,
  editRequestMutation,
  myRequestsQuery,
} from '@/entities/requests';

import {
  deleteOfferMutation,
  offersQuery,
  preSearchQuery,
} from '@/entities/offer';
import { $isAuthorized } from '@/entities/session';
import { createBidVisibilityChanged } from '@/features/create-advertisement';
import type { Bid, Brand } from '@/shared/api/generated/Api';
import { appMounted } from '@/shared/model';
import { handleShowAuthChanged } from '@/widgets/auth';
import {
  $searchTerm,
  $selectedSortType,
  searchVisibilityChanged,
} from '@/widgets/header';

type TSelectScreenMode = 'offers' | 'selectBrand' | 'history' | 'search' | null;

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
export const requestCompleted = createEvent<Bid>();
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

export const $filteredRequests = combine(
  {
    $selectedSortType,
    $selectedCompany,
    requests: myRequestsQuery.$data,
    $searchTerm,
  },
  (shape) =>
    (shape.$selectedSortType >= 0
      ? shape.requests?.results?.filter(
          (request) => request.status === shape.$selectedSortType,
        )
      : shape.requests?.results
    )
      ?.filter((request) =>
        shape.$selectedCompany
          ? request.company === shape.$selectedCompany
          : true,
      )
      ?.filter((request) => request.name.includes(shape.$searchTerm ?? '')) ??
    [],
);

sample({
  clock: requestClicked,
  fn: (clk) => clk.id ?? null,
  target: $selectedRequestId,
});

sample({
  source: $selectedAdvertisementId,
  clock: deleteOfferMutation.finished.success,
  filter: (_, clk) => [204].includes(clk.result.status),
  fn: (id) =>
    ({
      bid: parseInt(id ?? '1'),
    }) as const,
  target: offersQuery.start,
});

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

function changeRequestStatus(event: EventCallable<Bid>, status: number) {
  sample({
    clock: event,
    fn: (clk) =>
      ({
        name: clk.name,
        amount: clk.amount,
        id: clk.id,
        status: status,
      }) as Bid,
    target: editRequestMutation.start,
  });
}

changeRequestStatus(publicationClicked, 1);
changeRequestStatus(requestCompleted, 2);
changeRequestStatus(archiveRequestClicked, 3);

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
  fn: (clk) =>
    ({
      preSearch: {
        search: clk.article ?? '',
      },
      $requestViewMode: 'selectBrand',
      editRequestSelected: clk,
      id: clk.id?.toString(),
    }) as const,
  target: spread({
    preSearch: preSearchQuery.start,
    $requestViewMode,
    editRequestSelected,
    id: $selectedAdvertisementId,
  }),
});

sample({
  clock: offersQuery.finished.success,
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
const $changedBid = createStore<BidWithName | null>(null).on(
  editRequestSelected,
  (_, clk) => clk,
);

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
