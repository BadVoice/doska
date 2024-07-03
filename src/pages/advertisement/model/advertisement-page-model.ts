import {
  $brandSelected,
  $selectedRequestId,
  advertisementClicked,
} from '@/entities/advertisement';
import { offersQuery, preSearchQuery, searchQuery } from '@/entities/offer';
import { $requestViewMode, $searchQS } from '@/pages/my-requests';
import { $searchTerm } from '@/widgets/header';
import { sample } from 'effector';
import { debounce, spread } from 'patronum';

sample({
  clock: advertisementClicked,
  fn: (clk) =>
    ({
      mutation: {
        search: clk.article ?? '',
        brand: clk.brand ?? '',
      },
      $requestViewMode: 'search',
      $searchQS: {
        search: clk.article ?? '',
        brand: clk.brand ?? '',
      },
    }) as const,
  target: spread({
    mutation: searchQuery.start,
    $requestViewMode,
    $searchQS,
  }),
});

sample({
  clock: debounce($searchTerm, 500),
  fn: (clk) =>
    ({
      search: clk ?? '',
    }) as const,
  target: preSearchQuery.start,
});

sample({
  source: { $brandSelected, $selectedRequestId },
  clock: advertisementClicked,
  filter: (src) => src.$brandSelected,
  fn: (src) =>
    ({
      bid: src.$selectedRequestId ?? 1,
    }) as const,
  target: offersQuery.start,
});
