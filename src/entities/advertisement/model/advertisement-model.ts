import { createEvent, createStore, sample } from 'effector';
import type { PreSearchResponse } from '@/shared/api/generated/Api';
import { persist } from 'effector-storage/query';

type TAdvertisement = Omit<PreSearchResponse, 'part_name'>;

export const advertisementClicked = createEvent<TAdvertisement>();

export const $selectedAdvertisement = createStore<TAdvertisement | null>(null);

export const $selectedAdvertisementId = createStore<string | null>(null).on(
  $selectedAdvertisement,
  (_, src) => src?.id,
);

persist({
  store: $selectedAdvertisementId,
  key: 'selected-advertisement',
});

sample({
  clock: advertisementClicked,
  target: $selectedAdvertisement,
});
