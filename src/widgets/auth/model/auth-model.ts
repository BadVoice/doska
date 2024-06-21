import { $api } from '@/shared/api';
import { unauthorizedErrorHappened } from '@/shared/api/api';
import type { VerifyUserResponse } from '@/shared/api/generated/Api';
import { toast } from '@/shared/ui/toast';
import { $showAuth } from '@/widgets/auth';
import {
  $formMode,
  handleRegistrationFulfilled,
} from '@/widgets/auth/lib/form-mode';
import {
  $isVerifyCaptchaVisible,
  $verifyCaptchaValue,
  verificationCodeComplete,
  verifyUserMutation,
} from '@/widgets/auth/model/verification-model';
import { createMutation } from '@farfetched/core';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { debounce, spread } from 'patronum';
import './verification-model';

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

export const $authMode = createStore('login');
export const $phoneOrEmail = createStore('').on(valueInputed, (_, clk) => clk);
export const $authFormValues = createStore<IAuthFormValues | null>(null);

export const $inputMode = createStore<TInputMode>('email');

export const authUser = createMutation({
  handler: async (data: IAuthFormValues) =>
    $api.user.createAuthUser(
      {
        username: data.value,
        recaptcha: data.captchaToken,
      },
      {
        transformRequest: (data, headers) => {
          delete headers['Authorization'];

          return JSON.stringify(data);
        },
      },
    ),
});

export const updateUser = createMutation({
  handler: async (data: SendDetailsParams) => $api.user.updateUser(data),
});

const notifyUnauthorizedError = createEffect(() => {
  toast({
    title: 'Авторизуйтесь, чтобы получить доступ',
    variant: 'destructive',
  });
});

sample({
  clock: debounce(unauthorizedErrorHappened, 500),
  fn: () => true,
  target: [notifyUnauthorizedError, $showAuth],
});

const saveTokensFx = createEffect((response: VerifyUserResponse) => {
  localStorage.setItem('token', response.access ?? '');
});

sample({
  source: $authMode,
  clock: verifyUserMutation.finished.success,
  filter: (_, clk) => [200].includes(clk.result.status),
  fn: (src, clk) =>
    ({
      $formMode: src === 'register' ? 'details' : 'company',
      saveTokensFx: clk.result.data,
    }) as const,
  target: spread({
    $formMode,
    saveTokensFx: saveTokensFx,
  }),
});

sample({
  source: $authMode,
  clock: verifyUserMutation.finished.success,
  filter: (src, clk) => [200].includes(clk.result.status) && src === 'login',
  target: handleRegistrationFulfilled,
});

sample({
  source: { $phoneOrEmail, $verifyCaptchaValue },
  clock: verificationCodeComplete,
  fn: (src, clk) => ({
    username: src.$phoneOrEmail.includes('@')
      ? src.$phoneOrEmail
      : src.$phoneOrEmail[0] === '8'
        ? '+7' + src.$phoneOrEmail.slice(1)
        : src.$phoneOrEmail,
    code: parseInt(clk.join().replace(/\D/g, '')),
    recaptcha: src.$verifyCaptchaValue,
  }),
  target: verifyUserMutation.start,
});

sample({
  source: $phoneOrEmail,
  clock: authFormSubmitted,
  fn: (src, clk) => ({
    captchaToken: clk.captchaToken,
    value: src.includes('@') ? src : src[0] === '8' ? '+7' + src.slice(1) : src,
  }),
  target: [$authFormValues, authUser.start],
});

sample({
  source: $phoneOrEmail,
  clock: authFormSubmitted,
  fn: (src) => (src.includes('@') ? ('email' as const) : ('phone' as const)),
  target: $inputMode,
});

sample({
  clock: authUser.finished.success,
  filter: (clk) => [201].includes(clk.result.status),
  fn: () => 'register',
  target: $authMode,
});

sample({
  clock: detailsFormSubmitted,
  fn: (clk) =>
    ({
      ...clk,
      first_name: clk.name,
    }) as const,
  target: updateUser.start,
});

sample({
  clock: updateUser.finished.success,
  filter: (clk: any) => [429].includes(clk.result.response?.status),
  fn: () => true,
  target: $isVerifyCaptchaVisible,
});
