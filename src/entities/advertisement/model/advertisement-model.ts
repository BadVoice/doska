import type { PreSearchResponse } from '@/shared/api/generated/Api';
import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/query';

type TAdvertisement = Omit<PreSearchResponse, 'part_name'>;

export const advertisementClicked = createEvent<
  TAdvertisement & { selectBrand: boolean }
>();

export const preSearchUnmounted = createEvent();

export const $selectedAdvertisement = createStore<TAdvertisement | null>(null);
export const $selectedRequestId = createStore<number | null>(null);

export const $selectedAdvertisementId = createStore<string | null>(null).on(
  $selectedAdvertisement,
  (_, src) => src?.id,
);
export const $brandSelected = createStore(false).on(
  advertisementClicked,
  (_, clk) => clk.selectBrand,
);

persist({
  store: $selectedAdvertisementId,
  key: 'selected-advertisement',
});

sample({
  clock: advertisementClicked,
  target: $selectedAdvertisement,
});
