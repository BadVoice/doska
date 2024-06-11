import { createEvent, createStore, sample } from 'effector';
import { createMutation } from '@farfetched/core';
import { $api } from '@/shared/api';
import type { VerifyUser } from '@/shared/api/generated/Api';
import { handleNextForm } from '@/widgets/auth/lib/form-mode';

export const verificationCodeComplete = createEvent<string[]>();
export const captchaVerified = createEvent();

export const verifyUserMutation = createMutation({
  handler: (data: VerifyUser) => $api.userVerify.verifyUser(data),
});

export const $isVerifyCaptchaVisible = createStore(false).reset(handleNextForm);
export const $verifyCaptchaValue = createStore('').on(
  captchaVerified,
  (_, clk) => clk,
);

sample({
  clock: verifyUserMutation.finished.success,
  filter: (clk: any) => [429].includes(clk.result.response?.status),
  fn: () => true,
  target: $isVerifyCaptchaVisible,
});
