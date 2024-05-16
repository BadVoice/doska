import { $api } from '@/shared/api';
import { createMutation } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';

interface ICompanyFormValues {
    name: string;
    phone: string;
    email: string;
}

interface SendCompanyParams {
    name: string;
    phone: string;
    email: string;
}
export const formSubmitted = createEvent();
export const companyFormSubmitted = createEvent<ICompanyFormValues>();
export const $companyFormValues = createStore<ICompanyFormValues | null>(null);

export const createCompany = createMutation({
    handler: async (data: SendCompanyParams) =>
        $api.companies.createUserCompany({
            email: data.email,
            phone: data.phone,
            name: data.name,
        }),
});

sample({
    clock: companyFormSubmitted,
    source: {
        $companyFormValues,
    },
    fn: (src, clk) =>
        ({
            email: clk.email,
            phone: clk.phone,
            name: clk.name,

        }) as SendCompanyParams,
    target: [$companyFormValues, createCompany.start],
});

$companyFormValues.watch((value) => console.log(value));
