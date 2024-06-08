import { createEvent, sample } from 'effector';
import { createMutation } from '@farfetched/core';
import { $api } from '@/shared/api';
import type { VerifyUser } from '@/shared/api/generated/Api';
import { $phoneOrEmail } from '@/widgets/auth/model/auth-model';

export const verificationCodeComplete = createEvent<string[]>();

const verifyUserMutation = createMutation({
  handler: (data: VerifyUser) => $api.userVerify.verifyUser(data),
});
sample({
  source: $phoneOrEmail,
  clock: verificationCodeComplete,
  fn: (src, clk) => ({
    username: src,
    code: parseInt(clk.join()),
  }),
  target: verifyUserMutation.start,
});
