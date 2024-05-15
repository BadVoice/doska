import { createEvent, createStore, sample } from 'effector';
import { formPrevClicked, formSubmitted } from '../model/auth-model';

type TFormMode = 'phoneOrEmail' | 'details' | 'company';

export const formIndexExceded = createEvent();

export const $formIndex = createStore<number>(0)
  .on(formSubmitted, (src) => src + 1)
  .on(formPrevClicked, (src) => src - 1)
  .reset(formIndexExceded);

export const $formMode = createStore<TFormMode>('phoneOrEmail');

sample({
  source: $formIndex,
  filter: (src) => src >= 3,
  target: formIndexExceded,
});

sample({
  source: $formIndex,
  filter: (src) => src <= 2,
  fn: (src) => (['phoneOrEmail', 'details', 'company'] as const)[src],
  target: $formMode,
});
