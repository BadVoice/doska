import {
  $brandSelected,
  $selectedRequestId,
  advertisementClicked,
} from '@/entities/advertisement';
import { offersQuery, searchQuery } from '@/entities/offer';
import { $requestViewMode, $searchQS } from '@/pages/my-requests';
import { createOfferMutation } from '@/widgets/offers';
import { sample } from 'effector';
import { debug, spread } from 'patronum';

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
  source: { $brandSelected, $selectedRequestId },
  clock: advertisementClicked,
  filter: (src) => src.$brandSelected,
  fn: (src) =>
    ({
      bid: src.$selectedRequestId ?? 1,
    }) as const,
  target: offersQuery.start,
});
