<script setup lang="ts">
  import {
    Button,
    FormCheckbox,
    FormField,
    FormItem,
    FormLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/shared/ui';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useCompanyForm } from '@/widgets/auth/lib/company-schema';
  import { FormInput } from '@/widgets/offers';
  import type { AxiosResponse } from 'axios';
  import { useUnit } from 'effector-vue/composition';
  import { ref } from 'vue';
  import {
    $isCreateCompanySingle,
    handleRegistrationFulfilled,
  } from '../lib/form-mode';
  import { companyFormSubmitted, createCompany } from '../model/company-model';

  const handleSubmit = useUnit(companyFormSubmitted);
  const { form } = useCompanyForm();
  const isCreateCompanySingle = useUnit($isCreateCompanySingle);

  const onSubmit = () => {
    form.validate();
    if (Object.keys(form.errors.value).length <= 0) {
      console.log(form.values);

      handleSubmit(form.values);

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
      <p class="mb-6 text-[19px] font-semibold" v-if="!isCreateCompanySingle">
        Регистрация компании
      </p>
      <form @submit="onSubmit" class="flex w-full flex-col gap-y-4">
        <FormField v-slot="{ componentField }" name="legalForm">
          <FormItem>
            <FormLabel>Правовая форма</FormLabel>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Правовая форма" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ООО">ООО </SelectItem>
                <SelectItem value="ИП">ИП </SelectItem>
                <SelectItem value="ПАО">ПАО </SelectItem>
                <SelectItem value="АО">АО </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>

        <FormInput
          name="name"
          label="Наименование"
          placeholder="Наименование" />

        <FormField v-slot="{ componentField }" name="nalog">
          <FormItem>
            <FormLabel>Система налогообложения</FormLabel>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Система налогооблажения" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="с НДС">с НДС </SelectItem>
                <SelectItem value="без НДС">без НДС </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>

        <FormInput name="position" label="Должность" placeholder="Должность" />

        <FormCheckbox
          :default="true"
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
        v-if="!isCreateCompanySingle"
        @click="nextModal()"
        class="bg-whhite w-full border border-[#0017FC] text-[17px] font-semibold text-[#0017FC] hover:bg-white"
        >Пропустить этот шаг</Button
      >
    </div>
  </div>
</template>
