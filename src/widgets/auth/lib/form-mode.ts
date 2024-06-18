import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

type TFormMode = 'phoneOrEmail' | 'details' | 'company' | 'verification';

export const handleNextForm = createEvent<TFormMode>();
export const handleRegistrationFulfilled = createEvent();
export const handleShowAuthChanged = createEvent<boolean | void>();

export const $showAuth = createStore<boolean>(false);
export const $formMode = createStore<TFormMode>('phoneOrEmail').reset(
  handleRegistrationFulfilled,
);

sample({
  source: not($showAuth),
  clock: handleShowAuthChanged,
  fn: (src, clk) => clk ?? src,
  target: $showAuth,
});

sample({
  clock: handleNextForm,
  target: $formMode,
});
