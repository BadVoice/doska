<script setup lang="ts">
  import { Button, PinInput, PinInputGroup, PinInputInput } from '@/shared/ui';
  import { $inputMode, $phoneOrEmail } from '@/widgets/auth/model/auth-model';
  import { useUnit } from 'effector-vue/composition';
  import { ref } from 'vue';
  import {
    $isVerifyCaptchaVisible,
    captchaVerified,
    verificationCodeComplete,
  } from '../model/verification-model';
  import VerifyCaptcha from '@/widgets/auth/ui/verify-captcha.vue';

  const phoneOrEmail = useUnit($phoneOrEmail);
  const handleComplete = useUnit(verificationCodeComplete);
  const isCaptchaVisible = useUnit($isVerifyCaptchaVisible);
  const handleCaptchaVerified = useUnit(captchaVerified);
  const inputMode = useUnit($inputMode);

  const value = ref([]);

  function handleSubmit() {
    if (value.value.length >= 4) {
      handleComplete(value.value);
    }
  }
</script>

<template v-else>
  <div class="flex h-full flex-col justify-between">
    <form @submit="handleSubmit" class="mt-4 flex w-full flex-col gap-y-4 px-4">
      <p class="text-[18px] font-semibold">Введите проверочный код</p>
      <p class="text-[18px] font-semibold">
        Мы отправили код на
        {{
          (inputMode === 'phone' ? 'ваш номер телефона ' : 'вашу почту ') +
          phoneOrEmail
        }}
      </p>
      <!--      <p v-if="registerError" class="text-[14px] font-semibold text-[#858FA3]">-->
      <!--        Произошла ошибка, возможно такие данные уже существуют-->
      <!--      </p>-->
      <PinInput
        id="pin-input"
        v-model="value"
        placeholder="*"
        class="mt-1 flex items-center gap-2 text-[24px] font-semibold text-[#0017FC]"
        otp
        type="number">
        <PinInputGroup class="gap-2">
          <PinInputInput
            class="min-h-[47px] min-w-[47px] rounded-lg border border-[#CCD0D9] text-[24px]"
            v-for="(id, index) in 4"
            :key="id"
            :index="index" />
        </PinInputGroup>
      </PinInput>
      <VerifyCaptcha
        @captcha-verified="handleCaptchaVerified"
        v-if="isCaptchaVisible" />
    </form>

    <div
      class="inset-x-0 bottom-0 w-full border-t border-[#CCD0D9] bg-white p-4">
      <Button @click="handleSubmit" class="w-full text-[17px] font-semibold"
        >Продолжить</Button
      >
    </div>
  </div>
</template>
