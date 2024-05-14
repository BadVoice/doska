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
  import { useUnit } from 'effector-vue/composition';
  import {
    $inputMode,
    formSubmitted,
    valueInputed,
    passwordInputed, $password,
    authFormSubmitted,
    loginUser,
  } from '@/widgets/auth/model/auth-model';
  import { usePhoneOrEmailForm } from '@/widgets/auth/lib/auth-schema';
  import {ref} from "vue";

  const nextModal = useUnit(formSubmitted);
  const handleInput = useUnit(valueInputed);
  const inputMode = useUnit($inputMode);

  const handlePasswordInput = useUnit(passwordInputed);
  const password = useUnit($password);

  const { form } = usePhoneOrEmailForm(inputMode.value);

  const emit = defineEmits(['submitCloseAuth']);

  const onSubmit = () => {
    form.validate();
    if (Object.keys(form.errors.value).length <= 0) {
      const username = form.values.value;
      const password = $password.getState();

      authFormSubmitted({ username, password });
    }
  };

  loginUser.doneData.watch((response) => {
    localStorage.setItem('accessToken', response.access);
    console.log(response)
    emit('submitCloseAuth', false);
  });

</script>

<template v-else>
  <div class="flex h-full flex-col justify-between">
    <form
      class="mt-4 flex w-full flex-col gap-y-4 px-5"
      @submit.prevent="onSubmit">
      <p class="text-[18px] font-semibold">Введите номер телефона или почту</p>
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
              :modelValue="password"
              @update:modelValue="(payload) => handlePasswordInput(payload.toString())"
              class="..."
              type="password"
             placeholder="Ваш пароль"
              v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
      </FormField>
    </form>
    <div
      @click="onSubmit"
      class="inset-x-0 bottom-0 w-full border-t border-[#CCD0D9] bg-white p-4">
      <Button class="w-full text-[17px] font-semibold">Получить код</Button>
    </div>
  </div>
</template>
