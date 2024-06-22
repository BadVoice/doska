import { $api } from '@/shared/api';
import { createMutation } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { $authDetailsValue } from './auth-model';

interface ICompanyFormValues {
  name: string;
  legalForm: 'ООО' | 'ИП' | 'ПАО' | 'АО';
  nalog: 'с НДС' | 'без НДС';
  position: string;
  continueAsCompany?: boolean | undefined;
}

enum LegalForm {
  'Не определено' = 0,
  'ООО' = 1,
  'ИП' = 2,
  'ПАО' = 3,
  'АО' = 4,
}

enum TaxSystem {
  'с НДС' = 0,
  'без НДС' = 1,
}

export const companyFormSubmitted = createEvent<ICompanyFormValues>();
export const $companyFormValues = createStore<ICompanyFormValues | null>(null);

export const createCompany = createMutation({
  handler: async (data: ICompanyFormValues) =>
    $api.companies.createUserCompany({
      ...data,
      legal_form: LegalForm[data.legalForm],
      tax_system: TaxSystem[data.nalog],
    }),
});

sample({
  source: $authDetailsValue,
  clock: companyFormSubmitted,
  fn: (src, clk) =>
    Object.assign(
      clk,
      src?.email && { email: src?.email },
      src?.phone && { phone: src?.phone },
    ),
  target: createCompany.start,
});
