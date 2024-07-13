import {
  $selectedAdvertisement,
  $selectedAdvertisementId,
  $selectedRequestId,
} from '@/entities/advertisement';
import { $selectedCompany } from '@/entities/company';
import { createMutation, keepFresh } from '@farfetched/core';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
  type EventCallable,
} from 'effector';
import { not, reset, spread } from 'patronum';

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
import type { Bid, Brand } from '@/shared/api/generated/Api';
import { appMounted } from '@/shared/model';
import {
  $searchTerm,
  $selectedSortType,
  searchTermInputed,
  searchVisibilityChanged,
} from '@/widgets/header';
import { $requestViewMode } from './view-mode';

export interface FormValues {
  name: string;
  requestType: string;
  article: string;
  count: string;
  destinations: number[];
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
export const cancelStatusClicked = createEvent<Bid>();
export const requestCompleted = createEvent<Bid>();
export const filterVisibilityChanged = createEvent<boolean | void>();
export const filterSubmitted = createEvent<FormValues>();
export const requestClicked = createEvent<BidWithName>();
export const pageSelected = createEvent<number>();
export const publicationClicked = createEvent<BidWithName>();

export const $filterOpened = createStore(false);

export const $currentPage = createStore(1).on(pageSelected, (_, clk) => clk);

export const $searchQS = createStore<{ search: string; brand: string } | null>(
  null,
);

export const $filteredRequests = combine(
  {
    $selectedCompany,
    requests: myRequestsQuery.$data,
    $searchTerm,
  },
  (shape) =>
    shape.requests?.results?.filter((request) =>
      shape.$selectedCompany
        ? request.company === shape.$selectedCompany.id
        : true,
    ) ?? [],
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

reset({
  clock: searchVisibilityChanged,
  target: [
    $selectedRequestId,
    $selectedAdvertisementId,
    $selectedAdvertisement,
  ],
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

export function changeRequestStatus(
  event: EventCallable<Bid>,
  status?: number,
) {
  sample({
    clock: event,
    fn: (clk) =>
      ({
        name: clk.name,
        amount: clk.amount,
        id: clk.id,
        status: status ?? (clk?.status as number) - 1,
      }) as Bid,
    target: editRequestMutation.start,
  });
}

changeRequestStatus(publicationClicked, 1);
changeRequestStatus(requestCompleted, 2);
changeRequestStatus(archiveRequestClicked, 3);
changeRequestStatus(cancelStatusClicked, 0);

sample({
  source: { $currentPage },
  clock: appMounted,
  filter: $isAuthorized,
  fn: (src) => ({ page: src.$currentPage }) as const,
  target: myRequestsQuery.start,
});

sample({
  source: { $selectedSortType, $currentPage, $searchTerm },
  clock: [$selectedSortType, $currentPage],
  filter: (src) => src.$selectedSortType >= -2,
  fn: (src) =>
    src.$selectedSortType === -1
      ? undefined
      : src.$selectedSortType === -2
        ? { search: src.$searchTerm ?? '', page: src.$currentPage }
        : ({
            search: src.$searchTerm ?? '',
            status: src.$selectedSortType,
            page: src.$currentPage,
          } as const),
  target: myRequestsQuery.start,
});

reset({
  clock: searchTermInputed,
  target: $currentPage,
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
  source: { $currentPage, $selectedSortType },
  clock: filterSubmitted,
  fn: (src, clk: FormValues) =>
    ({
      filterMutation: {
        search: clk.name,
        amount: parseInt(clk.count ?? '1'),
        article: clk.article,
        page: src.$currentPage,
        destinations: clk.destinations,
        status: src.$selectedSortType,
      },
      $filterOpened: false,
    }) as const,
  target: spread({ filterMutation: myRequestsQuery.start, $filterOpened }),
});

sample({
  clock: requestClicked,
  fn: (clk) =>
    ({
      search: {
        search: clk.article ?? '',
      },
      $requestViewMode: 'selectBrand',
      id: clk.id?.toString(),
    }) as const,
  target: spread({
    search: preSearchQuery.start,
    $requestViewMode,
    id: $selectedAdvertisementId,
  }),
});

sample({
  clock: offersQuery.finished.success,
  filter: (clk) => [200].includes(clk.result.status),
  fn: () => 'offers' as const,
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
  triggers: [
    bidMutation.finished.success,
    deleteRequestMutation.finished.success,
    editRequestMutation.finished.success,
  ],
});
