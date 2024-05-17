import { createMutation, createQuery } from '@farfetched/core';
import { $api } from '@/shared/api';
import {createStore} from "effector";

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
          article: bid.article || 'Не указано',
        brandName: brand ? brand.name : 'Не указано',
        categoryName: category ? category.name : 'Не указано',
      };
    });

    return enrichedBids;
  },
});

export const $requests = createStore<Bid[]>([]);
$requests.on(myRequestsQuery.finished.success, (_, {result}) => {
  return result
});

export const deleteRequestMutation = createMutation({
  // @ts-expect-error the backend expects a number, but returns a string as the id
  handler: (id: string) => $api.bids.deleteBid(id),
});
