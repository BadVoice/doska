import { $api } from '@/shared/api';
import { createEvent, createStore, sample } from 'effector';
import { createMutation } from '@farfetched/core';
import type {Brand} from "@/shared/api/generated/Api";

export const showBrandSelector = createEvent();
export const $brandsList = createStore<Brand[]>([]);
export const getBrands = createMutation({
    handler: async (data) =>
        $api.brands.getBrands(),
});

sample({
    clock: showBrandSelector,
    target: getBrands.start,
});

sample({
    clock: showBrandSelector,
    target: getBrands.start,
});

$brandsList.on(getBrands.finished.success, (_, { result: { data } }) => data);