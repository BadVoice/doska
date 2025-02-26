<script setup lang="ts">
  import {
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
  } from '@/shared/ui';
  import { usePhoneOrEmailForm } from '@/widgets/auth/lib/auth-schema';
  import { handleNextForm } from '@/widgets/auth/lib/form-mode';
  import {
    authFormSubmitted,
    authUser,
    valueInputed,
  } from '@/widgets/auth/model/auth-model';
  import VerifyCaptcha from '@/widgets/auth/ui/verify-captcha.vue';
  import { useUnit } from 'effector-vue/composition';
  import { ref } from 'vue';

  const nextModal = useUnit(handleNextForm);
  const handleInput = useUnit(valueInputed);
  const loginError = ref(false);
  const showCaptcha = ref(false);

  const captchaToken = ref<string | null>(null);

  const handleCaptchaVerified = (response: string) => {
    captchaToken.value = response;
  };

  const emit = defineEmits(['onLogin']);

  const { form } = usePhoneOrEmailForm();

  const onSubmit = async () => {
    await form.validate();
    if (Object.keys(form.errors.value).length <= 0) {
      if (showCaptcha.value && !captchaToken.value) {
        loginError.value = true;
        console.error('Пожалуйста, пройдите проверку reCAPTCHA.');
        return;
      }

      const values = {
        ...form.values,
        captchaToken: captchaToken.value,
      };
      authFormSubmitted(values);
    }
  };

  authUser.finished.success.watch(({ result }: any) => {
    if ([201, 200].includes(result.status)) {
      nextModal('verification');
    } else if (result.response?.status === 429) {
      showCaptcha.value = true;
      loginError.value = false;
    } else {
      loginError.value = true;
      showCaptcha.value = false;
    }
  });
</script>

<template v-else>
  <div class="flex h-full flex-col justify-between">
    <form
      class="mt-4 flex w-full flex-col gap-y-4 px-5"
      @submit.prevent="onSubmit">
      <p class="text-[18px] font-semibold">Введите номер телефона или почту</p>
      <p v-if="loginError" class="text-[14px] font-semibold text-[#858FA3]">
        Неверные данные, попробуйте еще раз или продолжите регистрацию. Если вы
        авторизуетесь с помощью номера - номер должен начинатся с +79
      </p>
      <FormField v-slot="{ componentField }" name="value">
        <FormItem>
          <FormLabel>Телефон или почта</FormLabel>
          <FormControl>
            <Input
              autofocus
              autocomplete="tel"
              @update:model-value="(payload) => handleInput(payload.toString())"
              class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
              type="text"
              placeholder="Телефон или почта"
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <VerifyCaptcha
        @captcha-verified="handleCaptchaVerified"
        v-if="showCaptcha" />
    </form>
    <div
      class="inset-x-0 bottom-0 flex w-full flex-col gap-y-3 border-t border-[#CCD0D9] bg-white p-4">
      <Button @click="onSubmit" class="w-full text-[17px] font-semibold"
        >Получить код</Button
      >
    </div>
  </div>
</template>
