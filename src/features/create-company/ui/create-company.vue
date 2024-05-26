<script setup lang="ts">
  import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
  } from '@/shared/ui';
  import { useCompanyForm } from '@/features/create-company/lib/company-schema';
  import { useUnit } from 'effector-vue/composition';
  import {
    companyFormSubmitted,
    createCompany,
  } from '@/features/create-company/model/company-model';
  import type { AxiosResponse } from 'axios';
  import { ref } from 'vue';

  const emit = defineEmits(['registerCompany', 'closeRegisterCompany']);
  const handleSubmit = useUnit(companyFormSubmitted);
  const { form } = useCompanyForm();

  const onSubmit = () => {
    form.validate();
    if (Object.keys(form.errors.value).length <= 0) {
      handleSubmit({
        ...form.values,
      });

      emit('closeRegisterCompany')
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
      emit('closeRegisterCompany');
    } else if (registerStatus.value === 400) {
      console.error(result);
    } else if (registerStatus.value === 429) {
    } else {
      console.error(result);
    }
  });
</script>

<template v-else>
  <div class="flex h-full flex-col justify-between">
    <div class="custom-scrollbar max-h-[calc(100vh-200px)] overflow-x-auto">
      <form @submit="onSubmit" class="mt-4 flex w-full flex-col gap-y-4 px-5">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Название компании</FormLabel>
            <FormControl>
              <Input
                class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
                type="text"
                placeholder="Название"
                v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Почта компании</FormLabel>
            <FormControl>
              <Input
                class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
                type="text"
                placeholder="Название почты"
                v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="phone">
          <FormItem>
            <FormLabel>Номер телефона организации</FormLabel>
            <FormControl>
              <Input
                class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
                type="text"
                placeholder="Телефон организации"
                v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
    </div>
  </div>
</template>

<style scoped lang="postcss">
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #d0d4db #f9fafb;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    background-color: #f9fafb;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d0d4db;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #a7acb5;
  }
</style>
