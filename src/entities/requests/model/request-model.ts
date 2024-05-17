import { createMutation, createQuery } from '@farfetched/core';
import { $api } from '@/shared/api';

export const getBrandsQuery = createQuery({
  handler: () => $api.brands.getBrands(),
});

export const myRequestsQuery = createQuery({
  handler: async () => {
    const responseBid = await $api.bids.getBids();
    const bids = responseBid.data;
    const responseBrand = await $api.brands.getBrands()
    const brands = responseBrand.data
      const responseCategory = await $api.categories.getCategories()
      const categories = responseCategory.data

    const enrichedBids = bids.map((bid) => {
      const brand = brands.find((b) => b.id === bid.brand);
      // @ts-expect-error the backend expects a number, but returns a string as the id
      const category = categories.find((c) =>  c.id === bid.category);

        return {
        ...bid,
        brandName: brand ? brand.name : 'Не указано',
        categoryName: category ? category.name : 'Не указано',
      };
    });

    return enrichedBids;
  },
});

export const deleteRequestMutation = createMutation({
  // @ts-expect-error the backend expects a number, but returns a string as the id
  handler: (id: string) => $api.bids.deleteBid(id),
});
