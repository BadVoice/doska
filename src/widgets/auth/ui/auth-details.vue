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
    detailsFormSubmitted,
    formSubmitted,
  } from '@/widgets/auth/model/auth-model';
  import { useAuthForm } from '@/widgets/auth/lib/auth-schema';

  const inputMode = useUnit($inputMode);
  const nextModal = useUnit(formSubmitted);
  const handleSubmit = useUnit(detailsFormSubmitted);

  const { form } = useAuthForm(inputMode.value);

  const onSubmit = () => {
    form.validate();
    if (Object.keys(form.errors.value).length <= 0) {
      handleSubmit(form.values);
      nextModal();
    }
  };

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
    </form>
    <div
      class="inset-x-0 bottom-0 w-full border-t border-[#CCD0D9] bg-white p-4">
      <Button @click="onSubmit" class="w-full text-[17px] font-semibold"
        >Продолжить</Button
      >
    </div>
  </div>
</template>
