import { createEvent, createStore, sample } from 'effector';
import { preSearchQuery } from '@/entities/offer';
import { debounce, spread } from 'patronum';
import { persist } from 'effector-storage/query';

export const searchTermInputed = createEvent<string>();
export const sortTypeSelected = createEvent<number>();

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
