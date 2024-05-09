import { createEvent, createStore, sample } from 'effector';
import { spread } from 'patronum';

type TFormMode = 'selectType' | 'form';
type TAdvertisementType = 'buy' | 'sell';

export const advertisementTypeSelected = createEvent<TAdvertisementType>();
export const formClosed = createEvent();
export const formSubmitted = createEvent<unknown>();

export const advertisementType = createStore<TAdvertisementType | null>(
  null,
).reset(formClosed);
export const formMode = createStore<TFormMode>('selectType').reset(formClosed);

sample({
  clock: advertisementTypeSelected,
  fn: (clk) => ({
    advertisementType: clk,
    formMode: 'form' as const,
  }),
  target: spread({
    advertisementType,
    formMode,
  }),
});

sample({
  clock: formSubmitted,
  fn: (clk) => console.log(clk),
  target: [formClosed],
});
