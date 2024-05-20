import { createEvent, sample } from 'effector';
import { searchQuery } from '@/entities/offer';
import { debounce } from 'patronum';

export const searchTermInputed = createEvent<string>();

sample({
  clock: debounce(searchTermInputed, 500),
  fn: (clk) =>
    ({
      search: clk,
      brand: '',
    }) as const,
  target: searchQuery.start,
});
