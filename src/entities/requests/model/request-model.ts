import { $api } from '@/shared/api';
import type { Bid } from '@/shared/api/generated/Api';
import { cache, createMutation, createQuery } from '@farfetched/core';

export interface IRequestsQueryParams {
  search?: string;
  article?: string;
  amount?: number;
  destinations?: number[];
  page: number;
  status?: number;
}

export const myRequestsQuery = createQuery({
  handler: async (params?: IRequestsQueryParams) => {
    const bids = (
      await $api.bids.getBids(
        Object.assign(
          {
            search: params?.search,
            amount: params?.amount,
            article: params?.article,
            destinations: params?.destinations,
          },
          (params?.status || params?.status === 0) && {
            status: params?.status,
          },
        ),
        {
          // @ts-ignore
          page: params?.page ?? 1,
        },
      )
    ).data;
    const brands = (await $api.brands.getBrands()).data;
    const categories = (await $api.categories.getCategories()).data;

    const brandsMap = new Map(brands.map((brand) => [brand.id, brand.name]));
    const categoriesMap = new Map(
      categories.map((category) => [category.id, category.name]),
    );

    const results = bids.results?.map((bid) => ({
      ...bid,
      article: bid.article || 'Не указано',
      brandName: brandsMap.get(bid.brand) || 'Не указано',
      categoryName: categoriesMap.get(bid.category) || 'Не указано',
    }));

    return {
      ...bids,
      results: results,
    };
  },
});

cache(myRequestsQuery);

export const deleteRequestMutation = createMutation({
  handler: (id: string) => $api.bids.deleteBid(parseInt(id)),
});

export const editRequestMutation = createMutation({
  handler: (bid: Bid) =>
    $api.bids.updateBid(parseInt(bid?.id?.toString() ?? '0'), bid),
});
