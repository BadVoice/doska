import { $api } from '@/shared/api';
import { createMutation } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';

export type TInputMode = 'email' | 'phone';

interface IFormValues {
  name: string;
  phone?: string;
  email?: string;
}

interface IAuthFormValues {
  value: string;
  password: string;
}

interface SendDetailsParams {
  email: string;
  phone: string;
  password: string;
  first_name?: string;
}

export const valueInputed = createEvent<string>();
export const formSubmitted = createEvent();
export const formPrevClicked = createEvent();
export const detailsFormSubmitted = createEvent<IFormValues>();
export const authFormSubmitted = createEvent<IAuthFormValues>();

export const $phoneOrEmail = createStore('');
export const $authFormValues = createStore<IAuthFormValues | null>(null);

export const $inputMode = createStore<TInputMode>('email');

const registerUser = createMutation({
  handler: async (data: SendDetailsParams) =>
    $api.user.createUser({
      email: data.email,
      phone: data.phone,
      password: data.password,
      first_name: data.first_name,
    }),
});

const loginUser = createMutation({
  handler: async (data: IAuthFormValues) =>
    $api.token.tokenCreate({
      username: data.value,
      password: data.password,
    }),
});

loginUser.finished.success.watch(({ result }) => {
  if (result.data?.access) {
    localStorage.setItem('accessToken', result.data?.access);
  }
});

sample({
  clock: detailsFormSubmitted,
  source: {
    $inputMode,
    $authFormValues,
    $phoneOrEmail,
  },
  fn: (src, clk) =>
    ({
      email: clk.email ?? src.$phoneOrEmail,
      phone: clk.phone ?? src.$phoneOrEmail,
      password: src.$authFormValues?.password,
      first_name: clk.name,
    }) as SendDetailsParams,
  target: registerUser.start,
});

sample({
  clock: authFormSubmitted,
  target: [loginUser.start, $authFormValues],
});

sample({
  source: $phoneOrEmail,
  fn: (src) =>
    src.startsWith('+') || !isNaN(parseInt(src[0]))
      ? ('phone' as const)
      : ('email' as const),
  target: $inputMode,
});
