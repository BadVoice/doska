import { $api } from '@/shared/api';
import { createMutation } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';

export type TInputMode = 'email' | 'phone';

interface IFormValues {
  name: string;
  phone?: string;
  email?: string;
  captchaToken?: string;
}

interface IAuthFormValues {
  value: string;
  password: string;
  captchaToken?: string;
}

interface SendDetailsParams {
  email?: string;
  phone?: string;
  password: string;
  first_name: string;
  captchaToken?: string;
}

export const valueInputed = createEvent<string>();
export const formSubmitted = createEvent();
export const formPrevClicked = createEvent();
export const detailsFormSubmitted = createEvent<IFormValues>();
export const authFormSubmitted = createEvent<IAuthFormValues>();

export const $phoneOrEmail = createStore('').on(valueInputed, (_, clk) => clk);
export const $authFormValues = createStore<IAuthFormValues | null>(null);

export const $inputMode = createStore<TInputMode>('email');

export const registerUser = createMutation({
  handler: async (data: SendDetailsParams) =>
    $api.user.createUser(
      Object.assign(
        {
          password: data.password,
          first_name: data.first_name,
          recaptcha: data.captchaToken,
        },
        data.email && { email: data.email },
        data.phone && { phone: data.phone },
      ),
    ),
});

export const loginUser = createMutation({
  handler: async (data: IAuthFormValues) =>
    $api.token.tokenCreate({
      username: data.value,
      password: data.password,
      recaptcha: data.captchaToken,
    }),
});

sample({
  clock: detailsFormSubmitted,
  source: {
    $inputMode,
    $authFormValues,
  },
  fn: (src, clk) =>
    ({
      email:
        src.$inputMode === 'email' ? src.$authFormValues?.value : undefined,
      phone:
        src.$inputMode === 'phone' ? src.$authFormValues?.value : undefined,
      password: src.$authFormValues?.password ?? '',
      first_name: clk.name ?? '',
      captchaToken: clk.captchaToken,
    }) as const,
  target: registerUser.start,
});

sample({
  clock: authFormSubmitted,
  target: [$authFormValues, loginUser.start],
});

sample({
  source: $phoneOrEmail,
  fn: (src) =>
    src.startsWith('+') || !isNaN(parseInt(src[0]))
      ? ('phone' as const)
      : ('email' as const),
  target: $inputMode,
});
