<script setup lang="ts">
  import {
    Button,
    FormField,
    FormItem,
    FormLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/shared/ui';
  import { useCompanyForm } from '@/widgets/auth/lib/company-schema';
  import { useUnit } from 'effector-vue/composition';
  import {
    companyFormSubmitted,
    createCompany,
  } from '@/widgets/auth/model/company-model';
  import type { AxiosResponse } from 'axios';
  import { ref } from 'vue';
  import { handleRegistrationFulfilled } from '@/widgets/auth/lib/form-mode';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import FormInput from '@/widgets/offers/ui/form-input.vue';
  import FormCheckbox from '@/shared/ui/form/FormCheckbox.vue';

  const handleSubmit = useUnit(companyFormSubmitted);
  const { form } = useCompanyForm();

  const onSubmit = () => {
    form.validate();
    if (Object.keys(form.errors.value).length <= 0) {
      handleSubmit({
        ...form.values,
      });
      console.log(form.values);

      nextModal();
    }
  };

  interface CustomAxiosResponse<T = any> extends AxiosResponse<T> {
    response?: {
      status?: number;
      data?: any;
    };
  }

  const registerStatus = ref<number | null>(null);

  createCompany.finished.success.watch(({ result }) => {
    registerStatus.value =
      (result as CustomAxiosResponse).response?.status || null;

    if (registerStatus.value === 201) {
      nextModal();
    } else if (registerStatus.value === 400) {
      console.error(result);
    } else if (registerStatus.value === 429) {
    } else {
      console.error(result);
    }
  });

  const nextModal = useUnit(handleRegistrationFulfilled);
</script>

<template v-else>
  <div class="flex h-full flex-col justify-between">
    <ScrollArea class="max-h-full px-5 py-4">
      <p class="mb-6 text-[19px] font-semibold">Регистрация компании</p>
      <form @submit="onSubmit" class="flex w-full flex-col gap-y-4">
        <FormInput name="legalForm" placeholder="Правовая форма" />
        <FormInput name="name" placeholder="Наименование" />
        <FormField v-slot="{ componentField }" name="category">
          <FormItem>
            <FormLabel>Категория</FormLabel>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="osn">ОСН </SelectItem>
                <SelectItem value="usn">УСН </SelectItem>
                <SelectItem value="envd">ЕНВД </SelectItem>
                <SelectItem value="psn">ПСН </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="nalog">
          <FormItem>
            <FormLabel>Система налогообложения</FormLabel>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Система налогооблажения" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="osn">ОСН </SelectItem>
                <SelectItem value="usn">УСН </SelectItem>
                <SelectItem value="envd">ЕНВД </SelectItem>
                <SelectItem value="psn">ПСН </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>

        <FormInput name="address" placeholder="Адрес" />

        <FormField v-slot="{ componentField }" name="sellerOrBuyer">
          <FormItem>
            <FormLabel>Продавец или покупатель</FormLabel>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Продавец или покупатель" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seller">Продавец </SelectItem>
                <SelectItem value="buyer">Покупатель </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>

        <FormInput name="position" placeholder="Должность" />
        <FormCheckbox
          name="continueAsCompany"
          label="Продолжить, как компания" />
      </form>
    </ScrollArea>

    <div
      class="mt-auto flex w-full flex-col items-center justify-center gap-y-2 border-t border-[#D0D4DB] p-4">
      <Button @click="onSubmit" class="w-full rounded-[9px] text-[16px]">
        Зарегистрировать
      </Button>
      <Button
        @click="nextModal()"
        class="bg-whhite w-full border border-[#0017FC] text-[17px] font-semibold text-[#0017FC] hover:bg-white"
        >Пропустить этот шаг</Button
      >
    </div>
  </div>
</template>
