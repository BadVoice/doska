import { createEvent, createStore, sample } from 'effector';

type TFormMode = 'phoneOrEmail' | 'details' | 'company' | 'verification';

export const handleNextForm = createEvent<TFormMode>();
export const handleRegistrationFulfilled = createEvent();

export const $formMode = createStore<TFormMode>('verification').reset(
  handleRegistrationFulfilled,
);

sample({
  clock: handleNextForm,
  target: $formMode,
});
