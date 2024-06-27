import { $selectedCompany } from '@/entities/company';
import { myRequestsQuery } from '@/entities/requests';
import { $api } from '@/shared/api';
import type { Ad, Bid } from '@/shared/api/generated/Api';
import { createMutation, createQuery, keepFresh } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';
import { spread } from 'patronum';

type TFormMode = 'selectType' | 'form';
type TAdvertisementType = 'buy' | 'sell';

export interface FormValues {
  name: string;
  article: string;
  count: string;
  price?: number;
  available?: number;
  destination?: number;
}

export const createAdMutation = createMutation({
  handler: (data: Ad) => $api.ads.createAd(data),
});

const createBidMutation = createMutation({
  handler: (data: Bid & { destination: number }) =>
    $api.bids.createBid({
      name: data.name,
      article: data.article || 'Не указано',
      amount: data.amount,
      status: 0,
      destinations: [data.destination],
      company: data.company,
    }),
});

export const getDestinations = createQuery({
  handler: () => $api.destinations.getDestinations(),
});

export const advertisementTypeSelected = createEvent<TAdvertisementType>();
export const formClosed = createEvent();
export const formSubmitted = createEvent<FormValues>();
export const createAdvertisementMounted = createEvent();

export const $advertisementType = createStore<TAdvertisementType | null>(
  null,
).reset([formClosed]);
export const $formMode = createStore<TFormMode>('selectType').reset([
  formClosed,
]);

sample({
  clock: createAdvertisementMounted,
  target: getDestinations.start,
});

sample({
  clock: advertisementTypeSelected,
  fn: (clk) => ({
    $advertisementType: clk,
    $formMode: 'form' as const,
  }),
  target: spread({
    $advertisementType,
    $formMode,
  }),
});

sample({
  clock: formSubmitted,
  source: { $advertisementType, $selectedCompany },
  filter: (src) => src.$advertisementType === 'buy',
  fn: (src, clk) =>
    Object.assign(
      {
        name: clk.name,
        article: clk.article,
        amount: parseInt(clk?.count ?? '1'),
        destination: clk.destination!,
      },
      {
        company: src.$selectedCompany?.id,
      },
    ),
  target: [createBidMutation.start, formClosed],
});

sample({
  clock: formSubmitted,
  source: { $advertisementType, $selectedCompany },
  filter: (src) => src.$advertisementType === 'sell',
  fn: (src, clk) =>
    Object.assign(
      {
        name: clk.name,
        amount: parseInt(clk?.count ?? '1'),
        price: clk.price!,
        delivery_time: clk.available,
        destination: clk.destination!,
      },
      src.$selectedCompany && {
        company: src.$selectedCompany?.id,
      },
    ),
  target: [createAdMutation.start, formClosed],
});

keepFresh(myRequestsQuery, {
  triggers: [createBidMutation.finished.success],
  automatically: true,
});
