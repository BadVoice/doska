import { $api } from '@/shared/api';
import type { Order, OrderReturn } from '@/shared/api/generated/Api';
import { createQuery } from '@farfetched/core';
import { createEvent, sample } from 'effector';
import type { BidWithName } from './my-requests-model';

export const historyClicked = createEvent<Order>();
export const historyClickedBid = createEvent<BidWithName>();
export const historyClickedReturn = createEvent<
  OrderReturn & Order & { brand: string }
>();

export const historyQuery = createQuery({
  handler: async (id: number) => {
    const bid = await $api.bids.getBid(id);
    const brands = await $api.brands.getBrands();
    const categories = await $api.categories.getCategories();

    return {
      ...bid.data,
      brandName: brands.data.find((brand) => brand.id === bid.data.brand),
      categoryName: categories.data.find(
        (category) => category.id === bid.data.category,
      ),
    };
  },
});

sample({
  clock: historyClicked,
  fn: (clk) => clk?.bid ?? 1,
  target: historyQuery.start,
});

sample({
  clock: historyClickedBid,
  fn: (clk) => clk?.id ?? 1,
  target: historyQuery.start,
});

sample({
  clock: historyClickedReturn,
  fn: (clk) => clk?.bid ?? 1,
  target: historyQuery.start,
});
