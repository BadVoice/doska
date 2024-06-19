import { preSearchQuery } from '@/entities/offer';
import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/query';
import { debounce, spread } from 'patronum';

export const searchTermInputed = createEvent<string>();
export const sortTypeSelected = createEvent<number>();
export const searchVisibilityChanged = createEvent<boolean | void>();

export const $showSearch = createStore(false).on(
  searchVisibilityChanged,
  (src, clk) => clk ?? !src,
);

export const $searchTerm = createStore<string | null>(null);
export const $selectedSortType = createStore<number>(-1);
sample({
  clock: sortTypeSelected,
  target: $selectedSortType,
});

persist({ store: $selectedSortType, key: 'selectedStatus' });
persist({ store: $searchTerm, key: 'search' });

sample({
  clock: debounce(searchTermInputed, 500),
  fn: (clk) => ({
    mutation: {
      search: clk,
    } as const,
    $searchTerm: clk,
  }),
  target: spread({ mutation: preSearchQuery.start, $searchTerm }),
});
