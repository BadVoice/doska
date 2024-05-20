import { createMutation, createQuery } from '@farfetched/core';
import { $api } from '@/shared/api';
import type { FullRequestParams } from '@/shared/api/generated/Api';

export const myRequestsQuery = createQuery({
  handler: async (params?: FullRequestParams) => {
    const bids = (await $api.bids.getBids()).data;
    const brands = (await $api.brands.getBrands()).data;
    const categories = (await $api.categories.getCategories()).data;

    const brandsMap = new Map(brands.map((brand) => [brand.id, brand.name]));
    const categoriesMap = new Map(
      categories.map((category) => [category.id, category.name]),
    );

    if (params) {
      const response = await $api.bids.getBids({ ...params });
      return response.data;
    }

    const res = bids.map((bid) => ({
      ...bid,
      article: bid.article || 'Не указано',
      // @ts-expect-error the backend expects a number, but returns a string as the id
      brandName: brandsMap.get(bid.brand) || 'Не указано',
      // @ts-expect-error the backend expects a number, but returns a string as the id
      categoryName: categoriesMap.get(bid.category) || 'Не указано',
    }));

    console.log(res);
    return res;
  },
});

export const deleteRequestMutation = createMutation({
  handler: (id: string) => $api.bids.deleteBid(parseInt(id)),
});
