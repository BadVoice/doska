import { createEvent, createStore, sample } from 'effector';
import type { PreSearchResponse } from '@/shared/api/generated/Api';
import { persist } from 'effector-storage/query';
import { reset, spread } from 'patronum';
import { searchVisibilityChanged } from '@/widgets/header';

type TAdvertisement = Omit<PreSearchResponse, 'part_name'>;

export const advertisementClicked = createEvent<
  TAdvertisement & { selectBrand: boolean }
>();

export const $selectedAdvertisement = createStore<TAdvertisement | null>(null);
export const $selectedRequestId = createStore<number | null>(null)

export const $selectedAdvertisementId = createStore<string | null>(null).on(
  $selectedAdvertisement,
  (_, src) => src?.id,
);
export const $brandSelected = createStore(false).on(
  advertisementClicked,
  (_, clk) => clk.selectBrand,
);

reset({
  clock: searchVisibilityChanged,
  target: $selectedAdvertisementId,
});

persist({
  store: $selectedAdvertisementId,
  key: 'selected-advertisement',
});

sample({
  clock: advertisementClicked,
  target: $selectedAdvertisement,
});
