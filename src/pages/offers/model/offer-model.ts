import { createAdMutation } from '@/features/create-advertisement';
import { $api } from '@/shared/api';
import { createQuery, keepFresh } from '@farfetched/core';
import { createEvent, createStore } from 'effector';

export const adsQuery = createQuery({
  handler: () => $api.ads.getAds(),
});

export const offersPageVisibilityChanged = createEvent<void | boolean>();

export const $visibleOffersPage = createStore(false).on(
  offersPageVisibilityChanged,
  (src, clk) => clk ?? !src,
);

keepFresh(adsQuery, {
  triggers: [createAdMutation.finished.success],
});
