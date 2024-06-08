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
  captchaToken?: string;
}

interface SendDetailsParams {
  email?: string;
  phone?: string;
  first_name: string;
  captchaToken?: string;
}

export const valueInputed = createEvent<string>();
export const detailsFormSubmitted = createEvent<IFormValues>();
export const authFormSubmitted = createEvent<IAuthFormValues>();

export const $phoneOrEmail = createStore('').on(valueInputed, (_, clk) => clk);
export const $authFormValues = createStore<IAuthFormValues | null>(null);

export const $inputMode = createStore<TInputMode>('email');

export const registerUser = createMutation({
  handler: async (data: SendDetailsParams) =>
    $api.user.createAuthUser({
      username: data.email ?? data.phone ?? '',
      recaptcha: data.captchaToken,
    }),
});

export const loginUser = createMutation({
  handler: async (data: IAuthFormValues) => {
    if (data.value.includes('@')) {
      return $api.user.createAuthUser({
        username: data.value,
        recaptcha: data.captchaToken,
      });
    } else {
      return $api.user.createAuthUser({
        username: data.value.replace(/[^+\d]/g, '').replace(/\+/g, ''),
        recaptcha: data.captchaToken,
      });
    }
  },
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
