import { $isAuthorized } from '@/entities/session';
import { $api } from '@/shared/api';
import type { VerifyUser } from '@/shared/api/generated/Api';
import { toast } from '@/shared/ui/toast';
import { handleNextForm } from '@/widgets/auth/lib/form-mode';
import { createMutation } from '@farfetched/core';
import { createEffect, createEvent, createStore, sample } from 'effector';

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

const notifyWrongCodeFx = createEffect(() => {
  toast({
    title: 'Неверный код',
    variant: 'destructive',
  });
});

sample({
  clock: verifyUserMutation.finished.success,
  filter: (clk: any) => [200].includes(clk.result.status),
  fn: () => !!localStorage.getItem('token'),
  target: $isAuthorized,
});

sample({
  clock: verifyUserMutation.finished.success,
  filter: (clk: any) => [400].includes(clk.result.response?.status),
  target: notifyWrongCodeFx,
});

sample({
  clock: verifyUserMutation.finished.success,
  filter: (clk: any) => [429].includes(clk.result.response?.status),
  fn: () => true,
  target: $isVerifyCaptchaVisible,
});
