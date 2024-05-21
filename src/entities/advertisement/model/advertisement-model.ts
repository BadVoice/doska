import { createEvent, createStore, sample } from 'effector';
import type { PreSearchResponse } from '@/shared/api/generated/Api';
import { persist } from 'effector-storage/query';

export const advertisementClicked = createEvent<PreSearchResponse>();

export const $selectedAdvertisement = createStore<PreSearchResponse | null>(
  null,
);

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
