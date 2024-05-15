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
  import {
    $inputMode,
    authFormSubmitted,
    formSubmitted,
    valueInputed,
    loginUser
  } from '@/widgets/auth/model/auth-model';
  import { useUnit } from 'effector-vue/composition';
  import { ref } from "vue";
  import VerifyCaptcha from "@/widgets/auth/ui/verify-captcha.vue";

  const nextModal = useUnit(formSubmitted);
  const handleInput = useUnit(valueInputed);
  const inputMode = useUnit($inputMode);
  const loginError = ref(false)
  const showCaptcha = ref(false);

  const captchaToken = ref<string | null>(null);

  const handleCaptchaVerified = (response: string) => {
    captchaToken.value = response;
  };

  const emit = defineEmits(['onLogin'])

  const { form } = usePhoneOrEmailForm(inputMode.value);


  const onSubmit = () => {
    form.validate();
    if (Object.keys(form.errors.value).length <= 0) {

      if (showCaptcha.value && !captchaToken.value) {
        loginError.value = true;
        console.error("Пожалуйста, пройдите проверку reCAPTCHA.");
        return;
      }

      form.setFieldValue('captchaToken', captchaToken.value);
      console.log(form.values);
      console.log(captchaToken.value)
      authFormSubmitted(form.values);
    }
  };

  const onRegister = () => {
    form.validate();
    if (Object.keys(form.errors.value).length <= 0) {
      nextModal();
    }
  };

  const label = {
    email: 'номер телефона',
    phone: 'почту',
  };

  import { type AxiosResponse} from 'axios';

  interface CustomAxiosResponse<T = any> extends AxiosResponse<T> {
    response?: {
      status?: number;
      data?: any;
    };
  }

  loginUser.finished.success.watch(({ result }) => {
    if (result.data?.access) {
      localStorage.setItem('token', result.data?.access);
      emit('onLogin', true)
    }
    else if ((result as CustomAxiosResponse).response?.status === 429) {
      showCaptcha.value = true;
      loginError.value = true
    }
    else {
      loginError.value = true
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
      <p v-if="loginError" class="text-[14px] text-[#858FA3] font-semibold">Неверные данные, попробуйте еще раз или продолжите регистрацию.</p>
      <FormField v-slot="{ componentField }" name="value">
        <FormItem>
          <FormLabel>Телефон или почта</FormLabel>
          <FormControl>
            <Input
              autofocus
              autocomplete="tel"
              v-if="inputMode === 'phone'"
              v-mask="'+7 (###) ###-##-##'"
              @update:model-value="(payload) => handleInput(payload.toString())"
              class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
              type="text"
              placeholder="Телефон или почта"
              v-bind="componentField" />
            <Input
              autofocus
              v-else
              autocomplete="email"
              @update:model-value="(payload) => handleInput(payload.toString())"
              class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
              type="text"
              placeholder="Телефон или почта"
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Пароль</FormLabel>
          <FormControl>
            <Input
              autofocus
              type="password"
              placeholder="Ваш пароль"
              v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <VerifyCaptcha @captcha-verified="handleCaptchaVerified" v-if="showCaptcha" />
    </form>
    <div
      class="inset-x-0 bottom-0 w-full border-t border-[#CCD0D9] bg-white p-4 flex flex-col gap-y-3">
      <Button @click="onSubmit" class="w-full text-[17px] font-semibold">Войти</Button>
      <Button @click="onRegister" v-if="loginError" class="bg-whhite w-full border border-[#0017FC] text-[17px] font-semibold text-[#0017FC] hover:bg-white">Продолжить регистрацию</Button>
    </div>

  </div>
</template>
