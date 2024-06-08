import { advertisementClicked } from '@/entities/advertisement';
import { searchQuery } from '@/entities/offer';
import { $requestViewMode } from '@/pages/my-requests/model/my-requests-model';
import { sample } from 'effector';
import { spread } from 'patronum';

sample({
  clock: advertisementClicked,
  fn: (clk) =>
    ({
      mutation: {
        search: clk.article ?? '',
        brand: clk.brand ?? '',
      },
      $requestViewMode: 'offers',
    }) as const,
  target: spread({
    mutation: searchQuery.start,
    $requestViewMode,
  }),
});
