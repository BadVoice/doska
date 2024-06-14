import { $api } from '@/shared/api';
import type { Bid } from '@/shared/api/generated/Api';
import { createMutation, createQuery } from '@farfetched/core';
import { debug } from 'patronum';

export interface IRequestsQueryParams {
  search?: string;
  article?: string;
  amount?: number;
  destinations?: number[];
}

export const myRequestsQuery = createQuery({
  handler: async (params?: IRequestsQueryParams) => {
    const bids = (await $api.bids.getBids()).data;
    const brands = (await $api.brands.getBrands()).data;
    const categories = (await $api.categories.getCategories()).data;

    const brandsMap = new Map(brands.map((brand) => [brand.id, brand.name]));
    const categoriesMap = new Map(
      categories.map((category) => [category.id, category.name]),
    );

    if (params) {
      const response = await $api.bids.getBids(params);
      return response.data;
    }

    return bids.map((bid) => ({
      ...bid,
      article: bid.article || 'Не указано',
      // @ts-expect-error the backend expects a number, but returns a string as the id
      brandName: brandsMap.get(bid.brand) || 'Не указано',
      // @ts-expect-error the backend expects a number, but returns a string as the id
      categoryName: categoriesMap.get(bid.category) || 'Не указано',
    }));
  },
});

export const deleteRequestMutation = createMutation({
  handler: (id: string) => $api.bids.deleteBid(parseInt(id)),
});

export const editRequestMutation = createMutation({
  handler: (bid: Bid) =>
    $api.bids.updateBid(parseInt(bid?.id ?? '0'), {
      name: bid.name,
      status: 3,
      amount: bid.amount,
      category: bid.category,
    }),
});

debug(myRequestsQuery.start);
