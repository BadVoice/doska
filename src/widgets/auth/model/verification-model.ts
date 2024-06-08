import { createEffect, createEvent, createStore, sample } from 'effector';
import { createMutation } from '@farfetched/core';
import { $api } from '@/shared/api';
import type {
  VerifyUser,
  VerifyUserResponse,
} from '@/shared/api/generated/Api';
import { $phoneOrEmail } from '@/widgets/auth/model/auth-model';
import { $formMode } from '@/widgets/auth/lib/form-mode';
import { spread } from 'patronum';

export const verificationCodeComplete = createEvent<string[]>();
export const captchaVerified = createEvent();

export const verifyUserMutation = createMutation({
  handler: (data: VerifyUser) => $api.userVerify.verifyUser(data),
});

export const $isVerifyCaptchaVisible = createStore(false);
export const $verifyCaptchaValue = createStore('').on(
  captchaVerified,
  (_, clk) => clk,
);

const saveTokensFx = createEffect((response: VerifyUserResponse) => {
  localStorage.setItem('token', response.access);
});

sample({
  source: { $phoneOrEmail, $verifyCaptchaValue },
  clock: verificationCodeComplete,
  fn: (src, clk) => ({
    username: src.$phoneOrEmail,
    code: parseInt(clk.join().replace(/\D/g, '')),
    recaptcha: src.$verifyCaptchaValue,
  }),
  target: verifyUserMutation.start,
});

sample({
  clock: verifyUserMutation.finished.success,
  filter: (clk) => [200].includes(clk.result.status),
  fn: (clk) => ({ $formMode: 'company', saveTokensFx: clk.result.data }),
  target: spread({
    $formMode,
    saveTokensFx: saveTokensFx,
  }),
});

sample({
  clock: verifyUserMutation.finished.success,
  filter: (clk) => [429].includes(clk.result.response?.status),
  fn: () => true,
  target: $isVerifyCaptchaVisible,
});
