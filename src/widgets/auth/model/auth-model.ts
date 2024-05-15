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
      password: data.password,
      first_name: data.first_name,
    }),
});

export const loginUser = createMutation({
  handler: async (data: IAuthFormValues) =>
    $api.token.tokenCreate({
      username: data.value,
      password: data.password,
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
        email: src.$authFormValues?.value,
        password: src.$authFormValues?.password,
      first_name: clk.name,
    }) as SendDetailsParams,
  target: registerUser.start,
});

sample({
    clock: authFormSubmitted,
    source: $inputMode,
    fn: (mode, data: IAuthFormValues) => {
        if (mode === 'email') {
            return {
                ...data,
                value: data.value
            };
        } else {
            return {
                ...data,
                value: data.value
            };
        }
    },
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
