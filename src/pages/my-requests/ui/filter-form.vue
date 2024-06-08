<script setup lang="ts">
  import { X } from 'lucide-vue-next';
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
    filterSubmitted,
    filterVisibilityChanged,
    type FormValues,
  } from '../model/my-requests-model';
  import { useFilterRequestsForm } from '../lib/filter-form';

  const { changeFilterVisibility, submitFilter } = useUnit({
    changeFilterVisibility: filterVisibilityChanged,
    submitFilter: filterSubmitted,
  });

  const { form } = useFilterRequestsForm();

  const onSubmit = form.handleSubmit((values) => {
    console.log(values);
    submitFilter(values as FormValues);
  });
</script>

<template>
  <div class="w-full items-center border-b border-[#D0D4DB] px-0 py-3">
    <Button
      class="flex gap-x-2"
      variant="ghost"
      @click="changeFilterVisibility()">
      <X class="h-7 w-7" color="#000FFC" />
      <p class="text-[16px] font-semibold text-[#000FFC]">Закрыть</p>
    </Button>
  </div>
  <form @submit="onSubmit" class="mt-10 flex w-full flex-col gap-y-4 px-5">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Наименование</FormLabel>
        <FormControl>
          <Input
            class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
            type="text"
            placeholder="Наименование"
            v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="article">
      <FormItem>
        <FormLabel>Артикул</FormLabel>
        <FormControl>
          <Input
            class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
            type="text"
            placeholder="Артикул"
            v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="count">
      <FormItem>
        <FormLabel>Количество</FormLabel>

        <FormControl>
          <Input
            class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
            type="number"
            placeholder="Количество"
            v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="assigment">
      <FormItem>
        <FormLabel>Назначение</FormLabel>
        <FormControl>
          <Input
            class="h-fit rounded-[8px] border border-[#D0D4DB] px-4 py-2 text-[16px] placeholder:text-[#858FA3]"
            type="text"
            placeholder="Назначение"
            v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </form>
  <div
    @click="onSubmit"
    class="mt-auto w-full border-t border-[#CCD0D9] bg-[#F9FAFB] p-4 md:min-w-[305px]">
    <Button class="w-full text-[17px] font-semibold" type="submit">
      Применить фильтр
    </Button>
  </div>
</template>
