import { createEvent, createStore, sample } from 'effector';
import { not, spread } from 'patronum';
import { createQuery } from '@farfetched/core';
import { $api } from '@/shared/api';
import type { Company } from '@/shared/api/generated/Api';
import { persist } from 'effector-storage/local';

export const changeCompanyVisibleChanged = createEvent<boolean | void>();
export const companyChoosed = createEvent<Company>();

export const $isChangeCompanyVisible = createStore(false);
export const $choosedCompany = createStore<Company | null>(null);
persist({ store: $choosedCompany, key: 'company' });

export const companiesQuery = createQuery({
  handler: async () => (await $api.companies.getUserCompanies()).data,
});

sample({
  clock: companyChoosed,
  fn: (clk) => ({
    $choosedCompany: clk,
    $isChangeCompanyVisible: false,
  }),
  target: spread({
    $choosedCompany,
    $isChangeCompanyVisible,
  }),
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
