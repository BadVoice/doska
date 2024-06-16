import type { Company } from '@/shared/api/generated/Api';
import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';

export const companySelected = createEvent<Company>();

export const $selectedCompany = createStore<Company | null>(null);
persist({ store: $selectedCompany, key: 'selected-company' });

sample({
  clock: companySelected,
  target: $selectedCompany,
});
