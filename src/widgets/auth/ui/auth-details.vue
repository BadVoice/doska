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
  import { useAuthForm } from '@/widgets/auth/lib/auth-schema';
  import {
    $inputMode,
    detailsFormSubmitted,
    formSubmitted,
    registerUser,
  } from '@/widgets/auth/model/auth-model';
  import { useUnit } from 'effector-vue/composition';
  import VerifyCaptcha from '@/widgets/auth/ui/verify-captcha.vue';
  import { ref } from 'vue';
  import type { AxiosResponse } from 'axios';

  const inputMode = useUnit($inputMode);
  const nextModal = useUnit(formSubmitted);
  const handleSubmit = useUnit(detailsFormSubmitted);

  const showCaptcha = ref(false);
  const registerError = ref(false);
  const captchaToken = ref<string | null>(null);

  const registerStatus = ref<number | null>(null);

  const handleCaptchaVerified = (response: string) => {
    console.log(response);
    captchaToken.value = response;
  };

  const { form } = useAuthForm(inputMode.value);

  const onSubmit = () => {
    form.validate();
    if (Object.keys(form.errors.value).length <= 0) {
      if (showCaptcha.value && !captchaToken.value) {
        registerError.value = true;
        console.error('Пожалуйста, пройдите проверку reCAPTCHA.');
        return;
      }

      form.setFieldValue('captchaToken', captchaToken.value);

      handleSubmit({
        ...form.values,
      });
    }
  };

  interface CustomAxiosResponse<T = any> extends AxiosResponse<T> {
    response?: {
      status?: number;
      data?: any;
    };
  }

  registerUser.finished.success.watch(({ result }) => {
    registerStatus.value =
      (result as CustomAxiosResponse).response?.status || null;
    console.log(registerStatus.value);

    if (registerStatus.value === 201) {
      nextModal();
    } else if (registerStatus.value === 400) {
      registerError.value = true;
    } else if (registerStatus.value === 429) {
      showCaptcha.value = true;
      registerError.value = true;
    } else {
      showCaptcha.value = false;
      registerError.value = false;
      nextModal();
    }
  });

  const label = {
    email: 'номер телефона',
    phone: 'почту',
  };
</script>

<template v-else>
  <div class="flex h-full flex-col justify-between">
    <form @submit="onSubmit" class="mt-4 flex w-full flex-col gap-y-4 px-4">
      <p class="text-[18px] font-semibold">
        Укажите ваше имя и {{ label[inputMode] }}
      </p>
      <p v-if="registerError" class="text-[14px] font-semibold text-[#858FA3]">
        Произошла ошибка, возможно такие данные уже существуют
      </p>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Имя</FormLabel>
          <FormControl>
            <Input
              class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
              type="text"
              placeholder="Имя"
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ componentField }"
        name="email"
        v-if="inputMode === 'phone'">
        <FormItem>
          <FormLabel>Электронная почта</FormLabel>
          <FormControl>
            <Input
              v-if="inputMode === 'phone'"
              class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
              type="text"
              placeholder="Электронная почта"
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="phone" v-else>
        <FormItem>
          <FormLabel>Номер телефона</FormLabel>
          <FormControl>
            <Input
              v-mask="'+7 (###) ###-##-##'"
              class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
              type="text"
              placeholder="Номер телефона"
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
      class="inset-x-0 bottom-0 w-full border-t border-[#CCD0D9] bg-white p-4">
      <Button @click="onSubmit" class="w-full text-[17px] font-semibold"
        >Продолжить</Button
      >
    </div>
  </div>
</template>
