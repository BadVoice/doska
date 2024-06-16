import { $api } from '@/shared/api';
import { createQuery } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

export const changeCompanyVisibleChanged = createEvent<boolean | void>();

export const $isChangeCompanyVisible = createStore(false);

export const companiesQuery = createQuery({
  handler: async () => (await $api.companies.getUserCompanies()).data,
});

sample({
  source: not($isChangeCompanyVisible),
  clock: changeCompanyVisibleChanged,
  fn: (src, clk) => clk ?? src,
  target: $isChangeCompanyVisible,
});

sample({
  clock: changeCompanyVisibleChanged,
  filter: (clk) => !!clk,
  target: companiesQuery.start,
});
