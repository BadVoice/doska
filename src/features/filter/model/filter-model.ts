import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/query';
import { spread } from 'patronum';
import { searchQuery } from '@/entities/offer';
import { $selectedAdvertisement } from '@/entities/advertisement';

interface IFilterValues {
  vendors: string[];
  brands: string[];
  cities: number[];
  denomination?: string;
  article?: string;
  priceFrom?: number;
  priceTo?: number;
  countFrom?: number;
  countTo?: number;
}

export const filterSubmitted = createEvent<IFilterValues>();
export const offersUnmounted = createEvent();

export const $filterValues = createStore<IFilterValues | null>(null).reset(
  offersUnmounted,
);
persist({
  store: $filterValues,
  key: 'filter',
  serialize: (v) => JSON.stringify(v),
  deserialize: (v) => JSON.parse(v),
});

sample({
  source: $selectedAdvertisement,
  clock: filterSubmitted,
  fn: (src, clk) => ({
    $filterValues: clk,
    query: {
      page_size: 10,
      search: src?.article ?? '',
      brand: src?.brand ?? '',
      filters: {
        name: clk.denomination,
        article: clk.article,
        price: {
          from: clk.priceFrom,
          to: clk.priceTo,
        },
        delivery: {
          from: clk.countFrom,
          to: clk.countTo,
        },
      },
      exclude: {
        brand: clk.brands,
        vendor: clk.vendors,
        city_id: clk.cities,
      },
    },
  }),
  target: spread({ $filterValues, query: searchQuery.start }),
});
