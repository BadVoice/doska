import { createEvent, createStore, sample } from 'effector';
import { not, spread } from 'patronum';

type TFormMode = 'phoneOrEmail' | 'details' | 'company' | 'verification';

export const handleNextForm = createEvent<TFormMode>();
export const handleRegistrationFulfilled = createEvent();
export const handleShowAuthChanged = createEvent<boolean | void>();
export const addCompanyClicked = createEvent();

export const $showAuth = createStore<boolean>(false);
export const $formMode = createStore<TFormMode>('phoneOrEmail').reset(
  handleRegistrationFulfilled,
);
export const $isCreateCompanySingle = createStore(false).reset(
  handleRegistrationFulfilled,
);

sample({
  clock: addCompanyClicked,
  fn: () =>
    ({
      $formMode: 'company',
      $showAuth: true,
      $isCreateCompanySingle: true,
    }) as const,
  target: spread({
    $formMode,
    $showAuth,
    $isCreateCompanySingle,
  }),
});

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
