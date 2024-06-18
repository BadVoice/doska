import { userAuthorized } from '@/entities/session';
import { $api } from '@/shared/api';
import type { VerifyUser } from '@/shared/api/generated/Api';
import { handleNextForm } from '@/widgets/auth/lib/form-mode';
import { createMutation } from '@farfetched/core';
import { createEvent, createStore, sample } from 'effector';

export const verificationCodeComplete = createEvent<string[]>();
export const captchaVerified = createEvent();

export const verifyUserMutation = createMutation({
  handler: (data: VerifyUser) =>
    $api.userVerify.verifyUser(data, {
      transformRequest: (data, headers) => {
        delete headers['Authorization'];

        return JSON.stringify(data);
      },
    }),
});

export const $isVerifyCaptchaVisible = createStore(false).reset(handleNextForm);
export const $verifyCaptchaValue = createStore('').on(
  captchaVerified,
  (_, clk) => clk,
);

sample({
  clock: verifyUserMutation.finished.success,
  filter: (clk: any) => [200].includes(clk.result.status),
  target: userAuthorized,
});

sample({
  clock: verifyUserMutation.finished.success,
  filter: (clk: any) => [429].includes(clk.result.response?.status),
  fn: () => true,
  target: $isVerifyCaptchaVisible,
});
