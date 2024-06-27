import { offersQuery, preSearchQuery, searchQuery } from '@/entities/offer';
import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/query';
import { debounce } from 'patronum';

export const searchTermInputed = createEvent<string>();
export const sortTypeSelected = createEvent<number>();
export const searchVisibilityChanged = createEvent<boolean | void>();

export const $showSearch = createStore(false).on(
  searchVisibilityChanged,
  (src, clk) => clk ?? !src,
);

sample({
  clock: searchVisibilityChanged,
  target: [preSearchQuery.reset, searchQuery.reset, offersQuery.reset],
});

export const $searchTerm = createStore<string | null>(null)
  .reset(searchVisibilityChanged)
  .on(searchTermInputed, (_, clk) => clk);
export const $selectedSortType = createStore<number>(-1);
sample({
  clock: sortTypeSelected,
  target: $selectedSortType,
});

persist({ store: $selectedSortType, key: 'selectedStatus' });

sample({
  source: $selectedSortType,
  clock: debounce(searchTermInputed, 500),
  filter: (src) => src !== -2,
  fn: (_, clk) =>
    ({
      search: clk,
    }) as const,
  target: preSearchQuery.start,
});
