import {combine, createEffect, createEvent, createStore, sample} from 'effector';
import {$api} from "@/shared/api";

export type TInputMode = 'email' | 'phone';
type TFormMode = 'phoneOrEmail' | 'details' | 'company';

interface IFormValues {
  name: string;
  phone?: string;
  email?: string;
  password: string;
}

interface IDetails {
  name: string;
  details: string;
}

export const valueInputed = createEvent<string>();
export const passwordInputed = createEvent<string>();
export const formSubmitted = createEvent();
export const formPrevClicked = createEvent();
export const detailsFormSubmitted = createEvent<IFormValues>();

export const $phoneOrEmail = createStore('');

export const $password = createStore<string>('');

export const $inputMode = createStore<TInputMode>('email');

export const $details = createStore<IDetails | null>(null);

export const $formIndex = createStore<number>(0)
    .on(formSubmitted, (src) => src + 1)
    .on(formPrevClicked, (src) => src - 1);

export const detailsEmailInputed = createEvent<string>();
export const detailsPhoneInputed = createEvent<string>();

export const $detailsEmail = createStore<string>('');
export const $detailsPhone = createStore<string>('');

sample({
  clock: detailsEmailInputed,
  target: $detailsEmail,
});

sample({
  clock: detailsPhoneInputed,
  fn: (value) => value.replace(/\D/g, ''),
  target: $detailsPhone,
});

export const $formMode = combine({ index: $formIndex }, ({ index }) =>
    index <= 2
        ? (['phoneOrEmail', 'details', 'company'] as TFormMode[])[index]
        : 'company',
);

interface SendDetailsParams {
  email: string;
  phone: string;
  password: string;
  first_name?: string;
}

const sendDetailsFx = createEffect<SendDetailsParams, any, Error>(
    async ({ email, phone, password, first_name }) => {
      console.log(email, phone, password, first_name);
      try {
        const response = await $api.user.createUser({
          email,
          phone,
          password,
          first_name,
        });
        return response.data;
      } catch (error: any) {
        console.error('Ошибка отправки данных:', error);
        throw error;
      }
    }
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
  clock: detailsFormSubmitted,
  source: combine({
    phoneOrEmail: $phoneOrEmail,
    password: $password,
    details: $details,
    inputMode: $inputMode,
    detailsEmail: $detailsEmail,
    detailsPhone: $detailsPhone,
  }),
  fn: ({ phoneOrEmail, password, details, inputMode, detailsEmail, detailsPhone }) => ({
    email: inputMode === 'email' ? phoneOrEmail : detailsEmail,
    phone: inputMode === 'phone' ? phoneOrEmail : detailsPhone,
    password,
    first_name: details?.name,
  }),
  target: sendDetailsFx,
});

sample({
  clock: passwordInputed,
  target: $password,
});

sample({
  source: $phoneOrEmail,
  fn: (src) =>
      src.startsWith('+') || !isNaN(parseInt(src[0]))
          ? ('phone' as const)
          : ('email' as const),
  target: $inputMode,
});

sendDetailsFx
    .doneData
    .watch((data) => console.log('Данные успешно отправлены:', data));

sendDetailsFx
    .failData
    .watch((error) => console.error('Ошибка отправки данных:', error));