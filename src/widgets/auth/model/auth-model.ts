import { combine, createEvent, createStore, sample } from 'effector';

export type TInputMode = 'email' | 'phone';
type TFormMode = 'phoneOrEmail' | 'details' | 'company';

interface IFormValues {
  name: string;
  phone?: string;
  email?: string;
}

interface IDetails {
  name: string;
  details: string;
}

export const valueInputed = createEvent<string>();
export const formSubmitted = createEvent();
export const formPrevClicked = createEvent();
export const detailsFormSubmitted = createEvent<IFormValues>();

export const $phoneOrEmail = createStore('');
export const $inputMode = createStore<TInputMode>('email');

export const $details = createStore<IDetails | null>(null);

export const $formIndex = createStore<number>(0)
  .on(formSubmitted, (src) => src + 1)
  .on(formPrevClicked, (src) => src - 1);

export const $formMode = combine({ index: $formIndex }, ({ index }) =>
  index <= 2
    ? (['phoneOrEmail', 'details', 'company'] as TFormMode[])[index]
    : 'company',
);

sample({
  clock: detailsFormSubmitted,
  fn: (clk) =>
    ({
      name: clk.name,
      details: clk.phone ?? clk.email,
    }) as IDetails,
  target: $details,
});

sample({
  clock: valueInputed,
  target: $phoneOrEmail,
});

sample({
  source: $phoneOrEmail,
  fn: (src) =>
    src.startsWith('+') || !isNaN(parseInt(src[0]))
      ? ('phone' as const)
      : ('email' as const),
  target: $inputMode,
});
